const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supplement-by-science-secret-2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@supplementbyscience.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2026!";
const PORT = process.env.PORT || 3000;

// In-memory users store
const webUsers = [];
let nextUserId = 1;

// Initialize admin
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
  console.log(`[auth] Admin initialized: ${ADMIN_EMAIL}`);
}

// Load scientific data
let scientificData = null;
function getScientificData() {
  if (!scientificData) {
    const dataFile = path.join(__dirname, "data", "scientific-supplements.json");
    if (fs.existsSync(dataFile)) {
      scientificData = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    } else {
      scientificData = { supplements: [], diseases: [], allergies: [], medications: [], goals: [] };
    }
  }
  return scientificData;
}

// Load supplements data
let supplementsData = { products: [], categories: {} };
const supplementsFile = path.join(__dirname, "data", "supplements-data.json");
if (fs.existsSync(supplementsFile)) {
  supplementsData = JSON.parse(fs.readFileSync(supplementsFile, "utf-8"));
}

// Middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) { res.status(401).json({ error: "غير مصرح" }); return; }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "رمز غير صالح" });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "غير مصرح - مسؤول فقط" }); return;
    }
    next();
  });
}

function matchGoalsToSupplements(goals, supp) {
  const goalMap = {
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

async function startServer() {
  await initAdmin();

  const app = express();

  // CORS
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

  // Serve static files
  const publicDir = path.join(__dirname, "public");
  app.use(express.static(publicDir));

  // ============ AUTH API ============

  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { res.status(400).json({ error: "جميع الحقول مطلوبة" }); return; }
    if (password.length < 6) { res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }); return; }
    const existing = webUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) { res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" }); return; }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: nextUserId++, name, email: email.toLowerCase(), passwordHash, role: "user", createdAt: new Date().toISOString() };
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
    const user = webUsers.find(u => u.id === req.user?.id);
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, hasProfile: !!user.healthProfile });
  });

  // ============ HEALTH PROFILE API ============

  app.get("/api/profile", authMiddleware, (req, res) => {
    const user = webUsers.find(u => u.id === req.user?.id);
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    res.json({ profile: user.healthProfile || null, name: user.name, email: user.email });
  });

  app.post("/api/profile", authMiddleware, (req, res) => {
    const user = webUsers.find(u => u.id === req.user?.id);
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    user.healthProfile = {
      age: req.body.age, gender: req.body.gender, height: req.body.height, weight: req.body.weight,
      goals: req.body.goals || [], diseases: req.body.diseases || [], allergies: req.body.allergies || [],
      medications: req.body.medications || [], currentSupplements: req.body.currentSupplements || [],
      activityLevel: req.body.activityLevel, diet: req.body.diet,
      smokingStatus: req.body.smokingStatus, pregnancyStatus: req.body.pregnancyStatus,
      updatedAt: new Date().toISOString(),
    };
    res.json({ success: true, profile: user.healthProfile });
  });

  app.post("/api/profile/analyze", authMiddleware, (req, res) => {
    const user = webUsers.find(u => u.id === req.user?.id);
    if (!user || !user.healthProfile) { res.status(400).json({ error: "يجب إكمال الملف الصحي أولاً" }); return; }
    const profile = user.healthProfile;
    const data = getScientificData();
    const supplements = data.supplements || [];
    let bmi = null, bmiCategory = "";
    if (profile.height && profile.weight) {
      const hm = profile.height / 100;
      bmi = (profile.weight / (hm * hm)).toFixed(1);
      const bmiNum = parseFloat(bmi);
      if (bmiNum < 18.5) bmiCategory = "نقص الوزن";
      else if (bmiNum < 25) bmiCategory = "وزن طبيعي";
      else if (bmiNum < 30) bmiCategory = "زيادة في الوزن";
      else bmiCategory = "سمنة";
    }
    const warnings = [], recommendations = [], cautions = [];
    for (const supp of supplements) {
      let isSafe = true;
      const cautionReasons = [];
      for (const diseaseId of (profile.diseases || [])) {
        const interaction = (supp.disease_interactions || []).find(d => d.disease?.toLowerCase().includes(diseaseId.replace(/_/g, " ")));
        if (interaction) {
          if (interaction.severity === "high") { isSafe = false; warnings.push(`${supp.name_ar}: تحذير مع ${interaction.disease}`); }
          else if (interaction.severity === "medium") cautionReasons.push(`احتياط مع ${interaction.disease}`);
        }
      }
      const goalMatch = matchGoalsToSupplements(profile.goals || [], supp);
      if (isSafe && goalMatch > 0) {
        if (cautionReasons.length > 0) cautions.push({ ...supp, goalMatch, cautionReasons });
        else recommendations.push({ ...supp, goalMatch });
      }
    }
    recommendations.sort((a, b) => b.goalMatch - a.goalMatch);
    cautions.sort((a, b) => b.goalMatch - a.goalMatch);
    res.json({ bmi, bmiCategory, warnings: [...new Set(warnings)], recommendations: recommendations.slice(0, 8), cautions: cautions.slice(0, 4), profile, analyzedAt: new Date().toISOString() });
  });

  // ============ SCIENTIFIC DATA API ============

  app.get("/api/scientific/supplements", (_req, res) => {
    const data = getScientificData();
    res.json({ supplements: data.supplements || [], total: (data.supplements || []).length });
  });

  app.get("/api/scientific/supplements/:id", (req, res) => {
    const data = getScientificData();
    const supp = (data.supplements || []).find(s => s.id === req.params.id);
    if (!supp) { res.status(404).json({ error: "المكمل غير موجود" }); return; }
    res.json(supp);
  });

  app.get("/api/scientific/diseases", (_req, res) => { res.json(getScientificData().diseases || []); });
  app.get("/api/scientific/allergies", (_req, res) => { res.json(getScientificData().allergies || []); });
  app.get("/api/scientific/medications", (_req, res) => { res.json(getScientificData().medications || []); });
  app.get("/api/scientific/goals", (_req, res) => { res.json(getScientificData().goals || []); });

  app.post("/api/scientific/interactions", (req, res) => {
    const { supplementIds, medicationIds, diseaseIds } = req.body;
    const supplements = getScientificData().supplements || [];
    const results = [];
    for (const suppId of (supplementIds || [])) {
      const supp = supplements.find(s => s.id === suppId);
      if (!supp) continue;
      const interactions = [];
      for (const medId of (medicationIds || [])) {
        const med = (supp.drug_interactions || []).find(d => d.drug?.toLowerCase().includes(medId.replace(/_/g, " ").toLowerCase()));
        if (med) interactions.push({ type: "drug", ...med });
      }
      for (const diseaseId of (diseaseIds || [])) {
        const dis = (supp.disease_interactions || []).find(d => d.disease?.toLowerCase().includes(diseaseId.replace(/_/g, " ").toLowerCase()));
        if (dis) interactions.push({ type: "disease", ...dis });
      }
      if (interactions.length > 0) results.push({ supplement: { id: supp.id, name_ar: supp.name_ar }, interactions });
    }
    res.json({ results, checkedAt: new Date().toISOString() });
  });

  // ============ SUPPLEMENTS API ============

  app.get("/api/supplements", (_req, res) => {
    res.json({ products: supplementsData.products || [], categories: supplementsData.categories || {}, total: (supplementsData.products || []).length });
  });

  app.get("/api/supplements/:id", (req, res) => {
    const product = (supplementsData.products || []).find(p => p.id === req.params.id);
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
      usersWithProfile: webUsers.filter(u => u.role === "user" && u.healthProfile).length,
    });
  });

  app.get("/api/health", (_req, res) => { res.json({ ok: true, timestamp: Date.now() }); });

  // Serve SPA
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) { res.status(404).json({ error: "Not found" }); return; }
    const exactPath = path.join(publicDir, req.path);
    if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) { res.sendFile(exactPath); return; }
    const dirIndex = path.join(publicDir, req.path, "index.html");
    if (fs.existsSync(dirIndex)) { res.sendFile(dirIndex); return; }
    const indexPath = path.join(publicDir, "index.html");
    if (fs.existsSync(indexPath)) { res.sendFile(indexPath); }
    else res.status(404).json({ error: "Not found" });
  });

  app.listen(PORT, () => {
    console.log(`[server] Supplement by Science running on port ${PORT}`);
  });
}

startServer().catch(console.error);
