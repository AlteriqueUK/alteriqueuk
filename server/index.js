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
  const status = err.name === "MulterError" ? 400 : 500;
  res.status(status).json({ error: "Something went wrong." });
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

connectDb().then(async () => {
  await seedJournal();
  app.listen(PORT, () => console.log(`alterique API listening on :${PORT}`));
});
