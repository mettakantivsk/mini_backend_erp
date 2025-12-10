const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const fs = require("fs");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "LOCAL_DEV_SECRET";

const localDB = path.join(__dirname, "construction_erp.db");
const renderDB = "/tmp/construction_erp.db";

if (!fs.existsSync(renderDB)) {
  fs.copyFileSync(localDB, renderDB);
}

let db;

let startTheServer = async () => {
  try {
    db = await open({
      filename: renderDB,
      driver: sqlite3.Database,
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log("Server running on port", PORT));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startTheServer();

// ---------------- AUTH MIDDLEWARE ----------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let jwtToken = undefined;

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }

  if (jwtToken === undefined) {
    return res.status(401).send("Invalid JWT Token");
  }

  jwt.verify(jwtToken, JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).send("Invalid JWT Token");
    }
    next();
  });
};

// REGISTER
app.post("/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const password_hash = bcrypt.hashSync(password, 10);

  await db.run(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)",
    [name, email, password_hash, role]
  );

  res.json({ message: "User registered successfully" });
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// USERS CRUD
app.get("/users", authenticateToken, async (req, res) => {
  const users = await db.all("SELECT * FROM users");
  res.json({ users });
});

app.get("/users/:id", authenticateToken, async (req, res) => {
  const row = await db.get("SELECT * FROM users WHERE id = ?", [req.params.id]);
  res.json({ user: row });
});

app.post("/users", authenticateToken, async (req, res) => {
  const { name, email, password_hash, role } = req.body;

  await db.run(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)",
    [name, email, password_hash, role]
  );

  res.json({ message: "User created" });
});

app.put("/users/:id", authenticateToken, async (req, res) => {
  const { name, email, role } = req.body;

  await db.run(
    "UPDATE users SET name=?, email=?, role=? WHERE id=?",
    [name, email, role, req.params.id]
  );

  res.json({ message: "User updated" });
});

app.delete("/users/:id", authenticateToken, async (req, res) => {
  await db.run("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.json({ message: "User deleted" });
});

// PROJECT CRUD
app.post("/projects", authenticateToken, async (req, res) => {
  const { name, budget, spent, progress, status } = req.body;

  await db.run(
    "INSERT INTO projects (name, budget, spent, progress, status) VALUES (?,?,?,?,?)",
    [name, budget, spent, progress, status]
  );

  res.json({ message: "Project created" });
});

app.get("/projects", authenticateToken, async (req, res) => {
  const projects = await db.all("SELECT * FROM projects");
  res.json({ projects });
});

app.put("/projects/:id", authenticateToken, async (req, res) => {
  const { name, budget, spent, progress, status } = req.body;

  await db.run(
    "UPDATE projects SET name=?, budget=?, spent=?, progress=?, status=? WHERE id=?",
    [name, budget, spent, progress, status, req.params.id]
  );

  res.json({ message: "Project updated" });
});

app.delete("/projects/:id", authenticateToken, async (req, res) => {
  await db.run("DELETE FROM projects WHERE id = ?", [req.params.id]);
  res.json({ message: "Project deleted" });
});

// AI RISK
app.get("/ai/project-risk/:id", authenticateToken, async (req, res) => {
  const project = await db.get("SELECT * FROM projects WHERE id = ?", [req.params.id]);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  let riskScore = 0;
  const budgetUsedPercent = (project.spent / project.budget) * 100;

  if (budgetUsedPercent > project.progress + 20) {
    riskScore += 50;
  }

  let riskLevel = "Low";
  if (riskScore > 60) riskLevel = "Critical";
  else if (riskScore > 30) riskLevel = "High";
  else riskLevel = "Medium";

  res.json({
    projectId: project.id,
    risk_score: riskScore,
    risk_level: riskLevel,
  });
});
