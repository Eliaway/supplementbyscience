import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";

const JWT_SECRET = process.env.JWT_SECRET || "supplement-by-science-secret-2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@supplementbyscience.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2026!";

// In-memory user store (for simplicity - can be replaced with DB)
interface WebUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: string;
}

const webUsers: WebUser[] = [];
let nextUserId = 1;

// Initialize admin user
async function initAdmin() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  webUsers.push({
    id: nextUserId++,
    name: "المسؤول",
    email: ADMIN_EMAIL,
    passwordHash: hash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
  console.log(`[auth] Admin user initialized: ${ADMIN_EMAIL}`);
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// Auth middleware
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "غير مصرح" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "رمز غير صالح" });
  }
}

function adminMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  authMiddleware(req, res, () => {
    if ((req as any).user?.role !== "admin") {
      res.status(403).json({ error: "غير مصرح - مسؤول فقط" });
      return;
    }
    next();
  });
}

async function startServer() {
  await initAdmin();

  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve static files from public directory
  const publicDir = path.join(process.cwd(), "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // ============ AUTH API ============

  // POST /api/auth/register
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "جميع الحقول مطلوبة" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }
    const existing = webUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user: WebUser = {
      id: nextUserId++,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    webUsers.push(user);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // POST /api/auth/login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
      return;
    }
    const user = webUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return;
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // GET /api/auth/me
  app.get("/api/auth/me", authMiddleware, (req, res) => {
    const userId = (req as any).user?.id;
    const user = webUsers.find(u => u.id === userId);
    if (!user) {
      res.status(404).json({ error: "المستخدم غير موجود" });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  });

  // ============ SUPPLEMENTS API ============

  // Load supplements data
  let supplementsData: any = { products: [], categories: {} };
  const supplementsFile = path.join(process.cwd(), "server", "supplements-data.json");
  if (fs.existsSync(supplementsFile)) {
    supplementsData = JSON.parse(fs.readFileSync(supplementsFile, "utf-8"));
  }

  // GET /api/supplements
  app.get("/api/supplements", (_req, res) => {
    res.json({
      products: supplementsData.products || [],
      categories: supplementsData.categories || {},
      total: (supplementsData.products || []).length,
    });
  });

  // GET /api/supplements/:id
  app.get("/api/supplements/:id", (req, res) => {
    const product = (supplementsData.products || []).find((p: any) => p.id === req.params.id);
    if (!product) {
      res.status(404).json({ error: "المنتج غير موجود" });
      return;
    }
    res.json(product);
  });

  // ============ ADMIN API ============

  // GET /api/admin/users
  app.get("/api/admin/users", adminMiddleware, (_req, res) => {
    res.json(webUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })));
  });

  // DELETE /api/admin/users/:id
  app.delete("/api/admin/users/:id", adminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = webUsers.findIndex(u => u.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "المستخدم غير موجود" });
      return;
    }
    if (webUsers[idx].role === "admin") {
      res.status(400).json({ error: "لا يمكن حذف حساب المسؤول" });
      return;
    }
    webUsers.splice(idx, 1);
    res.json({ success: true });
  });

  // GET /api/admin/stats
  app.get("/api/admin/stats", adminMiddleware, (_req, res) => {
    res.json({
      totalUsers: webUsers.filter(u => u.role === "user").length,
      totalProducts: (supplementsData.products || []).length,
      totalCategories: Object.keys(supplementsData.categories || {}).length,
    });
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  // tRPC
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Fallback: serve index.html for SPA routes
  app.get("*", (req, res) => {
    const indexPath = path.join(publicDir, "index.html");
    if (fs.existsSync(indexPath) && !req.path.startsWith("/api/")) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
