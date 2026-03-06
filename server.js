import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { db } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());

// serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// --------- helper: basic auth (simple) ----------
function adminAuth(req, res, next) {
  const header = req.headers.authorization || "";

  // show popup login
  if (!header.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Admin Panel"');
    return res.status(401).send("Authentication required");
  }

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const [user, pass] = decoded.split(":");

  const okUser = process.env.ADMIN_USER;
  const okPass = process.env.ADMIN_PASS;

  if (!okUser || !okPass) {
    console.warn("⚠️ Missing ADMIN_USER or ADMIN_PASS env vars");
    return res.status(500).send("Server misconfigured");
  }

  if (user === okUser && pass === okPass) return next();

  res.set("WWW-Authenticate", 'Basic realm="Admin Panel"');
  return res.status(401).send("Invalid credentials");
}

// --------- helper: create key code ----------
function makeKey(prefix = "ProductHub") {
  const part = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${part()}${part()}-${part()}${part()}`;
}

// homepage -> customer page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "costumer.html"));
});

// 🚫 block direct access if admin.html is inside /public
app.get("/admin.html", (req, res) => {
  return res.status(404).send("Not found");
});

// admin page (protected)
// ✅ option A: if admin.html is OUTSIDE public -> backend/admin.html
app.get("/admin", adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// --------- CUSTOMER: redeem ----------
app.post("/api/redeem", async (req, res) => {
  try {
    const { key, email } = req.body;
    if (!key || !email) return res.status(400).json({ ok: false, msg: "Missing key/email" });

    const [rows] = await db.query("SELECT * FROM keys WHERE key_code=? LIMIT 1", [key.trim()]);
    if (!rows.length) return res.status(404).json({ ok: false, msg: "Key not found" });

    const k = rows[0];
    if (k.status !== "UNUSED" && k.status !== "REUSABLE") {
      return res.status(409).json({ ok: false, msg: "Key already redeemed" });
    }

    await db.query(
      "UPDATE keys SET status=IF(status='REUSABLE','REUSABLE','REDEEMED'), bound_email=?, redeemed_at=NOW() WHERE key_code=?",
      [email.trim(), key.trim()]
    );

    await db.query("INSERT INTO activity_log(action, details) VALUES(?, ?)", [
      "KEY_REDEEM",
      `Key ${key.trim()} redeemed by ${email.trim()}`
    ]);

    res.json({ ok: true, msg: "Redeem successful" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});

// --------- ADMIN: generate keys ----------
app.post("/api/admin/keys/generate", adminAuth, async (req, res) => {
  try {
    const qty = Math.max(1, Math.min(500, Number(req.body.qty || 10)));
    const reusable = req.body.reusable === true;

    const keys = [];
    for (let i = 0; i < qty; i++) {
      const code = makeKey("ProductHub");
      keys.push(code);
      await db.query("INSERT INTO keys(key_code, status) VALUES(?, ?)", [
        code,
        reusable ? "REUSABLE" : "UNUSED"
      ]);
    }

    await db.query("INSERT INTO activity_log(action, details) VALUES(?, ?)", [
      "KEYS_GENERATED",
      `${qty} keys generated (reusable=${reusable})`
    ]);

    res.json({ ok: true, keys });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});

// --------- ADMIN: list keys ----------
app.get("/api/admin/keys", adminAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT key_code, status, bound_email, created_at, redeemed_at FROM keys ORDER BY id DESC LIMIT 500"
    );
    res.json({ ok: true, rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});

// --------- ADMIN: dashboard metrics ----------
app.get("/api/admin/metrics", adminAuth, async (req, res) => {
  try {
    const [[total]] = await db.query("SELECT COUNT(*) as n FROM keys");
    const [[unused]] = await db.query("SELECT COUNT(*) as n FROM keys WHERE status='UNUSED'");
    const [[redeemed]] = await db.query("SELECT COUNT(*) as n FROM keys WHERE status='REDEEMED'");
    const [[reusable]] = await db.query("SELECT COUNT(*) as n FROM keys WHERE status='REUSABLE'");

    res.json({
      ok: true,
      metrics: { total: total.n, unused: unused.n, redeemed: redeemed.n, reusable: reusable.n }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});

// listen (last)
app.listen(PORT, () => console.log(`API running on port ${PORT}`));