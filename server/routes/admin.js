const express = require("express");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const QuoteRequest = require("../models/QuoteRequest");
const ContactMessage = require("../models/ContactMessage");
const Customer = require("../models/Customer");
const JournalPost = require("../models/JournalPost");
const { login, requireAdmin } = require("../utils/adminAuth");
const { photoUrl, photoUrls, uploadPhoto, r2Configured } = require("../config/r2");
const { findDuplicate, mergeDuplicates } = require("../utils/customers");
const { withImageUrl, withImageUrls } = require("../utils/journalImage");
const { mailStatus, sendTestEmail } = require("../utils/mailer");

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

// --- Email notifications ---

/** What the panel needs to say whether quote emails will arrive. */
router.get("/mail", (req, res) => {
  res.json(mailStatus());
});

/** Sends a real notification down the same path a quote request takes. */
router.post("/mail/test", async (req, res) => {
  try {
    const { to } = await sendTestEmail();
    res.json({ ok: true, to });
  } catch (err) {
    // 502: the API is fine, the mail server turned us away
    res.status(502).json({ error: err.message });
  }
});

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

/** Sorted by phone number, so the same person's records sit side by side. */
router.get("/customers", async (req, res, next) => {
  try {
    res.json(
      await Customer.find().sort({ phoneKey: 1, name: 1 }).limit(1000).lean()
    );
  } catch (err) {
    next(err);
  }
});

/** 409 with the record already on file, so the panel can offer to open it. */
function duplicateResponse(res, duplicate) {
  return res.status(409).json({
    error: `${duplicate.customer.name} is already on the list with that ${duplicate.matchedOn}.`,
    duplicateId: String(duplicate.customer._id),
  });
}

router.post("/customers", async (req, res, next) => {
  try {
    const fields = customerFields(req.body);
    if (!fields.name) return res.status(400).json({ error: "Name is required." });
    const duplicate = await findDuplicate(fields);
    if (duplicate) return duplicateResponse(res, duplicate);
    res.status(201).json(await Customer.create(fields));
  } catch (err) {
    next(err);
  }
});

/** Folds every set of records belonging to one person into a single entry. */
router.post("/customers/merge-duplicates", async (req, res, next) => {
  try {
    res.json(await mergeDuplicates());
  } catch (err) {
    next(err);
  }
});

router.put("/customers/:id", async (req, res, next) => {
  try {
    const fields = customerFields(req.body);
    const duplicate = await findDuplicate(fields, req.params.id);
    if (duplicate) return duplicateResponse(res, duplicate);
    const customer = await Customer.findByIdAndUpdate(req.params.id, fields, {
      new: true,
      runValidators: true,
    });
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

const MAX_IMAGE_MB = 8;

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: MAX_IMAGE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

/**
 * Picture upload for an article — multipart, one image, stored in R2.
 * Returns the object key to save on the post and a link to preview it with.
 */
router.post("/journal/image", uploadImage.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Choose a JPG or PNG picture." });
    }
    if (!r2Configured) {
      return res.status(503).json({
        error:
          "Picture storage isn't set up — add the R2 environment variables to upload images.",
      });
    }
    const key = await uploadPhoto(req.file, "journal");
    res.status(201).json({ key, src: await photoUrl(key) });
  } catch (err) {
    next(err);
  }
});

router.get("/journal", async (req, res, next) => {
  try {
    res.json(await withImageUrls(await JournalPost.find().sort({ date: -1 }).lean()));
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
    const post = await JournalPost.create(fields);
    res.status(201).json(await withImageUrl(post.toObject()));
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
    ).lean();
    if (!post) return res.status(404).json({ error: "Not found." });
    res.json(await withImageUrl(post));
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
