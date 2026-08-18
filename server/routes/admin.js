const express = require("express");
const rateLimit = require("express-rate-limit");
const QuoteRequest = require("../models/QuoteRequest");
const ContactMessage = require("../models/ContactMessage");
const Customer = require("../models/Customer");
const JournalPost = require("../models/JournalPost");
const { login, requireAdmin } = require("../utils/adminAuth");
const { photoUrls } = require("../config/r2");

const router = express.Router();

// --- Login (brute-force limited) ---

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  const token = login(email, password);
  if (!token) return res.status(401).json({ error: "Invalid email or password." });
  res.json({ token });
});

// Everything below requires a valid admin token
router.use(requireAdmin);

// --- Quotations ---

router.get("/quotes", async (req, res, next) => {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 }).limit(500).lean();
    const withUrls = await Promise.all(
      quotes.map(async (q) => ({ ...q, photoUrls: await photoUrls(q.photoKeys) }))
    );
    res.json(withUrls);
  } catch (err) {
    next(err);
  }
});

router.patch("/quotes/:id", async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!["new", "quoted", "accepted", "closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }
    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!quote) return res.status(404).json({ error: "Not found." });
    res.json(quote);
  } catch (err) {
    next(err);
  }
});

router.delete("/quotes/:id", async (req, res, next) => {
  try {
    await QuoteRequest.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Customer messages (contact form) ---

router.get("/messages", async (req, res, next) => {
  try {
    res.json(await ContactMessage.find().sort({ createdAt: -1 }).limit(500).lean());
  } catch (err) {
    next(err);
  }
});

router.delete("/messages/:id", async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Customer details ---

function customerFields(body) {
  const { name, email, phone, address, comment } = body || {};
  return { name, email, phone, address, comment };
}

router.get("/customers", async (req, res, next) => {
  try {
    res.json(await Customer.find().sort({ createdAt: -1 }).limit(1000).lean());
  } catch (err) {
    next(err);
  }
});

router.post("/customers", async (req, res, next) => {
  try {
    const fields = customerFields(req.body);
    if (!fields.name) return res.status(400).json({ error: "Name is required." });
    res.status(201).json(await Customer.create(fields));
  } catch (err) {
    next(err);
  }
});

router.put("/customers/:id", async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      customerFields(req.body),
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ error: "Not found." });
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

router.delete("/customers/:id", async (req, res, next) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Journal control ---

function journalFields(body) {
  const {
    slug,
    title,
    excerpt,
    category,
    date,
    readTime,
    image,
    relatedService,
    body: sections,
    published,
  } = body || {};
  return {
    slug,
    title,
    excerpt,
    category,
    date,
    readTime,
    image,
    relatedService,
    body: sections,
    published,
  };
}

router.get("/journal", async (req, res, next) => {
  try {
    res.json(await JournalPost.find().sort({ date: -1 }).lean());
  } catch (err) {
    next(err);
  }
});

router.post("/journal", async (req, res, next) => {
  try {
    const fields = journalFields(req.body);
    if (!fields.slug || !fields.title) {
      return res.status(400).json({ error: "Slug and title are required." });
    }
    res.status(201).json(await JournalPost.create(fields));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "That slug already exists." });
    }
    next(err);
  }
});

router.put("/journal/:id", async (req, res, next) => {
  try {
    const post = await JournalPost.findByIdAndUpdate(
      req.params.id,
      journalFields(req.body),
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ error: "Not found." });
    res.json(post);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "That slug already exists." });
    }
    next(err);
  }
});

router.delete("/journal/:id", async (req, res, next) => {
  try {
    await JournalPost.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
