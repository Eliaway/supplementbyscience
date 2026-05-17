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

interface WebUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: string;
  healthProfile?: HealthProfile;
}

interface HealthProfile {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goals?: string[];
  diseases?: string[];
  allergies?: string[];
  medications?: string[];
  currentSupplements?: string[];
  activityLevel?: string;
  diet?: string;
  smokingStatus?: string;
  pregnancyStatus?: string;
  updatedAt?: string;
}

const webUsers: WebUser[] = [];
let nextUserId = 1;

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
    server.listen(port, () => { server.close(() => resolve(true)); });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "") || (req as any).cookies?.token;
  if (!token) { res.status(401).json({ error: "غير مصرح" }); return; }
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
      res.status(403).json({ error: "غير مصرح - مسؤول فقط" }); return;
    }
    next();
  });
}

// Load scientific data
let scientificData: any = null;
function getScientificData() {
  if (!scientificData) {
    const dataFile = path.join(process.cwd(), "server", "scientific-supplements.json");
    if (fs.existsSync(dataFile)) {
      scientificData = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    } else {
      scientificData = { supplements: [], diseases: [], allergies: [], medications: [], goals: [] };
    }
  }
  return scientificData;
}

async function startServer() {
  await initAdmin();

  const app = express();
  const server = createServer(app);

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") { res.sendStatus(200); return; }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const publicDir = path.join(process.cwd(), "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // ============ AUTH API ============

  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { res.status(400).json({ error: "جميع الحقول مطلوبة" }); return; }
    if (password.length < 6) { res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }); return; }
    const existing = webUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) { res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" }); return; }
    const passwordHash = await bcrypt.hash(password, 10);
    const user: WebUser = { id: nextUserId++, name, email: email.toLowerCase(), passwordHash, role: "user", createdAt: new Date().toISOString() };
    webUsers.push(user);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }); return; }
    const user = webUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) { res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }); return; }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) { res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }); return; }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, hasProfile: !!user.healthProfile } });
  });

  app.get("/api/auth/me", authMiddleware, (req, res) => {
    const userId = (req as any).user?.id;
    const user = webUsers.find(u => u.id === userId);
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, hasProfile: !!user.healthProfile });
  });

  // ============ HEALTH PROFILE API ============

  // GET /api/profile — get current user's health profile
  app.get("/api/profile", authMiddleware, (req, res) => {
    const userId = (req as any).user?.id;
    const user = webUsers.find(u => u.id === userId);
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    res.json({ profile: user.healthProfile || null, name: user.name, email: user.email });
  });

  // POST /api/profile — save/update health profile
  app.post("/api/profile", authMiddleware, (req, res) => {
    const userId = (req as any).user?.id;
    const user = webUsers.find(u => u.id === userId);
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    const profile: HealthProfile = {
      age: req.body.age,
      gender: req.body.gender,
      height: req.body.height,
      weight: req.body.weight,
      goals: req.body.goals || [],
      diseases: req.body.diseases || [],
      allergies: req.body.allergies || [],
      medications: req.body.medications || [],
      currentSupplements: req.body.currentSupplements || [],
      activityLevel: req.body.activityLevel,
      diet: req.body.diet,
      smokingStatus: req.body.smokingStatus,
      pregnancyStatus: req.body.pregnancyStatus,
      updatedAt: new Date().toISOString(),
    };
    user.healthProfile = profile;
    res.json({ success: true, profile });
  });

  // POST /api/profile/analyze — analyze profile and return personalized recommendations
  app.post("/api/profile/analyze", authMiddleware, (req, res) => {
    const userId = (req as any).user?.id;
    const user = webUsers.find(u => u.id === userId);
    if (!user || !user.healthProfile) {
      res.status(400).json({ error: "يجب إكمال الملف الصحي أولاً" }); return;
    }
    const profile = user.healthProfile;
    const data = getScientificData();
    const supplements = data.supplements || [];

    // Calculate BMI
    let bmi = null;
    let bmiCategory = "";
    if (profile.height && profile.weight) {
      const hm = profile.height / 100;
      bmi = (profile.weight / (hm * hm)).toFixed(1);
      const bmiNum = parseFloat(bmi);
      if (bmiNum < 18.5) bmiCategory = "نقص الوزن";
      else if (bmiNum < 25) bmiCategory = "وزن طبيعي";
      else if (bmiNum < 30) bmiCategory = "زيادة في الوزن";
      else bmiCategory = "سمنة";
    }

    // Filter safe supplements based on diseases and medications
    const warnings: string[] = [];
    const recommendations: any[] = [];
    const cautions: any[] = [];

    for (const supp of supplements) {
      let isSafe = true;
      let cautionReasons: string[] = [];

      // Check disease interactions
      for (const diseaseId of (profile.diseases || [])) {
        const interaction = (supp.disease_interactions || []).find((d: any) => d.disease && d.disease.toLowerCase().includes(diseaseId.replace(/_/g, " ")));
        if (interaction) {
          if (interaction.severity === "high") {
            isSafe = false;
            warnings.push(`${supp.name_ar}: تحذير مع ${interaction.disease} — ${interaction.effect}`);
          } else if (interaction.severity === "medium") {
            cautionReasons.push(`احتياط مع ${interaction.disease}`);
          }
        }
      }

      // Check allergy interactions
      for (const allergyId of (profile.allergies || [])) {
        if (allergyId === "fish" && supp.id === "omega3") {
          isSafe = false;
          warnings.push(`${supp.name_ar}: ممنوع لمن لديه حساسية من الأسماك`);
        }
        if (allergyId === "fish" && supp.id === "collagen" && supp.name_ar.includes("سمك")) {
          isSafe = false;
        }
      }

      // Check goal matching
      const goalMatch = matchGoalsToSupplements(profile.goals || [], supp);

      if (isSafe && goalMatch > 0) {
        if (cautionReasons.length > 0) {
          cautions.push({ ...supp, goalMatch, cautionReasons });
        } else {
          recommendations.push({ ...supp, goalMatch });
        }
      }
    }

    // Sort by goal match score
    recommendations.sort((a, b) => b.goalMatch - a.goalMatch);
    cautions.sort((a, b) => b.goalMatch - a.goalMatch);

    res.json({
      bmi,
      bmiCategory,
      warnings: [...new Set(warnings)],
      recommendations: recommendations.slice(0, 8),
      cautions: cautions.slice(0, 4),
      profile,
      analyzedAt: new Date().toISOString(),
    });
  });

  function matchGoalsToSupplements(goals: string[], supp: any): number {
    const goalMap: Record<string, string[]> = {
      weight_loss: ["omega3", "vitamin_d3", "probiotics"],
      muscle_gain: ["creatine", "vitamin_d3", "magnesium", "zinc"],
      energy_boost: ["vitamin_b12", "coq10", "magnesium", "iron"],
      sleep_improvement: ["magnesium", "ashwagandha"],
      stress_reduction: ["ashwagandha", "magnesium", "omega3"],
      immune_support: ["vitamin_d3", "vitamin_c", "zinc", "probiotics"],
      heart_health: ["omega3", "coq10", "magnesium", "vitamin_d3"],
      bone_health: ["vitamin_d3", "magnesium", "collagen"],
      brain_health: ["omega3", "vitamin_b12", "coq10", "ashwagandha"],
      skin_hair: ["collagen", "vitamin_c", "zinc", "omega3"],
      digestive_health: ["probiotics", "magnesium"],
      hormonal_balance: ["vitamin_d3", "zinc", "ashwagandha", "magnesium"],
      athletic_performance: ["creatine", "magnesium", "vitamin_d3", "coq10"],
      anti_aging: ["coq10", "vitamin_c", "collagen", "omega3"],
      fertility: ["zinc", "vitamin_d3", "coq10", "omega3"],
      blood_sugar: ["magnesium", "vitamin_d3", "omega3"],
      cholesterol: ["omega3", "coq10"],
      inflammation: ["omega3", "turmeric_curcumin", "vitamin_d3"],
    };
    let score = 0;
    for (const goal of goals) {
      if (goalMap[goal]?.includes(supp.id)) score += 2;
    }
    return score;
  }

  // ============ SCIENTIFIC DATA API ============

  // GET /api/scientific/supplements — full scientific data
  app.get("/api/scientific/supplements", (_req, res) => {
    const data = getScientificData();
    res.json({ supplements: data.supplements || [], total: (data.supplements || []).length });
  });

  // GET /api/scientific/supplements/:id
  app.get("/api/scientific/supplements/:id", (req, res) => {
    const data = getScientificData();
    const supp = (data.supplements || []).find((s: any) => s.id === req.params.id);
    if (!supp) { res.status(404).json({ error: "المكمل غير موجود" }); return; }
    res.json(supp);
  });

  // GET /api/scientific/diseases
  app.get("/api/scientific/diseases", (_req, res) => {
    const data = getScientificData();
    res.json(data.diseases || []);
  });

  // GET /api/scientific/allergies
  app.get("/api/scientific/allergies", (_req, res) => {
    const data = getScientificData();
    res.json(data.allergies || []);
  });

  // GET /api/scientific/medications
  app.get("/api/scientific/medications", (_req, res) => {
    const data = getScientificData();
    res.json(data.medications || []);
  });

  // GET /api/scientific/goals
  app.get("/api/scientific/goals", (_req, res) => {
    const data = getScientificData();
    res.json(data.goals || []);
  });

  // POST /api/scientific/interactions — check interactions between supplements and medications
  app.post("/api/scientific/interactions", (req, res) => {
    const { supplementIds, medicationIds, diseaseIds } = req.body;
    const data = getScientificData();
    const supplements = data.supplements || [];
    const results: any[] = [];

    for (const suppId of (supplementIds || [])) {
      const supp = supplements.find((s: any) => s.id === suppId);
      if (!supp) continue;
      const interactions: any[] = [];

      for (const medId of (medicationIds || [])) {
        const med = (supp.drug_interactions || []).find((d: any) =>
          d.drug?.toLowerCase().includes(medId.replace(/_/g, " ").toLowerCase())
        );
        if (med) interactions.push({ type: "drug", ...med, severity: "check" });
      }

      for (const diseaseId of (diseaseIds || [])) {
        const dis = (supp.disease_interactions || []).find((d: any) =>
          d.disease?.toLowerCase().includes(diseaseId.replace(/_/g, " ").toLowerCase())
        );
        if (dis) interactions.push({ type: "disease", ...dis });
      }

      if (interactions.length > 0) {
        results.push({ supplement: { id: supp.id, name_ar: supp.name_ar }, interactions });
      }
    }

    res.json({ results, checkedAt: new Date().toISOString() });
  });

  // ============ SUPPLEMENTS API (legacy) ============

  let supplementsData: any = { products: [], categories: {} };
  const supplementsFile = path.join(process.cwd(), "server", "supplements-data.json");
  if (fs.existsSync(supplementsFile)) {
    supplementsData = JSON.parse(fs.readFileSync(supplementsFile, "utf-8"));
  }

  app.get("/api/supplements", (_req, res) => {
    res.json({ products: supplementsData.products || [], categories: supplementsData.categories || {}, total: (supplementsData.products || []).length });
  });

  app.get("/api/supplements/:id", (req, res) => {
    const product = (supplementsData.products || []).find((p: any) => p.id === req.params.id);
    if (!product) { res.status(404).json({ error: "المنتج غير موجود" }); return; }
    res.json(product);
  });

  // ============ ADMIN API ============

  app.get("/api/admin/users", adminMiddleware, (_req, res) => {
    res.json(webUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt, hasProfile: !!u.healthProfile })));
  });

  app.delete("/api/admin/users/:id", adminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = webUsers.findIndex(u => u.id === id);
    if (idx === -1) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    if (webUsers[idx].role === "admin") { res.status(400).json({ error: "لا يمكن حذف حساب المسؤول" }); return; }
    webUsers.splice(idx, 1);
    res.json({ success: true });
  });

  app.get("/api/admin/stats", adminMiddleware, (_req, res) => {
    const data = getScientificData();
    res.json({
      totalUsers: webUsers.filter(u => u.role === "user").length,
      totalProducts: (supplementsData.products || []).length,
      totalScientificSupplements: (data.supplements || []).length,
      totalCategories: Object.keys(supplementsData.categories || {}).length,
      usersWithProfile: webUsers.filter(u => u.role === "user" && u.healthProfile).length,
    });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

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
  if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  server.listen(port, () => { console.log(`[api] server listening on port ${port}`); });
}

startServer().catch(console.error);
