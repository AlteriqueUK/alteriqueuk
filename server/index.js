require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDb = require("./config/db");
const quoteRoutes = require("./routes/quote");
const contactRoutes = require("./routes/contact");

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
app.use(express.json({ limit: "100kb" }));

app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20, // per IP per window — quote/contact forms need very little
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/quote", quoteRoutes);
app.use("/api/contact", contactRoutes);

// Central error handler (multer errors land here too)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.name === "MulterError" ? 400 : 500;
  res.status(status).json({ error: "Something went wrong." });
});

connectDb().then(() => {
  app.listen(PORT, () => console.log(`alterique API listening on :${PORT}`));
});
