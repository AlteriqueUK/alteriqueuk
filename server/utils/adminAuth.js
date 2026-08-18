const crypto = require("crypto");

/**
 * Single fixed admin account, set via ADMIN_EMAIL / ADMIN_PASSWORD env vars.
 * Sessions are stateless HMAC tokens signed with ADMIN_TOKEN_SECRET so a
 * server restart doesn't log the admin out.
 */

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function secret() {
  return process.env.ADMIN_TOKEN_SECRET || "";
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || !secret()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function login(email, password) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !secret()) return null;
  const emailOk = safeEqual(String(email || "").trim().toLowerCase(), ADMIN_EMAIL.toLowerCase());
  const passOk = safeEqual(password || "", ADMIN_PASSWORD);
  if (!emailOk || !passOk) return null;
  return sign({ sub: "admin", exp: Date.now() + TOKEN_TTL_MS });
}

/** Express middleware guarding admin routes */
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!verify(token)) {
    return res.status(401).json({ error: "Not authorised." });
  }
  next();
}

module.exports = { login, requireAdmin };
