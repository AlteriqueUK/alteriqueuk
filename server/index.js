require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDb = require("./config/db");
const quoteRoutes = require("./routes/quote");
const contactRoutes = require("./routes/contact");
const journalRoutes = require("./routes/journal");
const adminRoutes = require("./routes/admin");
const JournalPost = require("./models/JournalPost");
const { backfillPhoneKeys } = require("./utils/customers");
const { mailStatus, verifyMail } = require("./utils/mailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Render sits behind a proxy — needed for correct client IPs in rate limiting
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN
      ? process.env.ALLOWED_ORIGIN.split(",")
      : true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Public forms need very little; admin gets its own roomier limit so normal
// panel use never trips it (login has a stricter limiter in routes/admin.js)
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/quote", formLimiter, quoteRoutes);
app.use("/api/contact", formLimiter, contactRoutes);
app.use("/api/journal", adminLimiter, journalRoutes);
app.use("/api/admin", adminLimiter, adminRoutes);

// Central error handler (multer errors land here too)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "MulterError") {
    return res.status(400).json({
      error:
        err.code === "LIMIT_FILE_SIZE"
          ? "That file is too large — 8MB maximum."
          : "That upload could not be read.",
    });
  }
  res.status(500).json({ error: "Something went wrong." });
});

/** First run only: load the original journal articles into MongoDB. */
async function seedJournal() {
  try {
    if ((await JournalPost.estimatedDocumentCount()) > 0) return;
    const seed = require("./data/journal-seed.json");
    await JournalPost.insertMany(seed.map((post) => ({ ...post, published: true })));
    console.log(`Journal seeded with ${seed.length} articles`);
  } catch (err) {
    console.error("Journal seed failed:", err.message);
  }
}

/** Records saved before phoneKey existed still need one to sort and match on. */
async function backfillCustomers() {
  try {
    const filled = await backfillPhoneKeys();
    if (filled) console.log(`Phone numbers indexed for ${filled} customers`);
  } catch (err) {
    console.error("Customer phone backfill failed:", err.message);
  }
}

/**
 * Says plainly, at boot, whether quote notifications will actually arrive —
 * a wrong password used to show up only as silence.
 */
async function reportMail() {
  const status = mailStatus();
  if (!status.configured) {
    console.warn(
      "EMAIL OFF — set SMTP_USER and SMTP_PASS (Gmail needs an App Password). " +
        "Quote requests are still stored and visible in the admin panel."
    );
    return;
  }
  const { ok, error } = await verifyMail();
  console.log(
    ok
      ? `Email ready: sending as ${status.user} → ${status.notify}`
      : `EMAIL BROKEN — ${status.host}:${status.port} as ${status.user} refused the login: ${error}`
  );
}

connectDb().then(async () => {
  await seedJournal();
  await backfillCustomers();
  app.listen(PORT, () => console.log(`alterique API listening on :${PORT}`));
  // After listen, so a slow SMTP handshake never delays the health check
  reportMail();
});
