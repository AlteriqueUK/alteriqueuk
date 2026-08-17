const express = require("express");
const multer = require("multer");
const QuoteRequest = require("../models/QuoteRequest");
const { uploadPhoto } = require("../config/r2");
const { notifyBusiness, confirmCustomer } = require("../utils/mailer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 6, fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    cb(null, file.mimetype.startsWith("image/")),
});

router.post("/", upload.array("photos", 6), async (req, res, next) => {
  try {
    const { service, description, name, phone, email } = req.body;

    if (!service || !description || !name || (!phone && !email)) {
      return res.status(400).json({
        error: "Service, description, name and a phone or email are required.",
      });
    }

    const photoKeys = (
      await Promise.all((req.files || []).map(uploadPhoto))
    ).filter(Boolean);

    const quote = await QuoteRequest.create({
      service,
      description,
      name,
      phone,
      email,
      photoKeys,
    });

    // Notifications are fire-and-forget — the quote is already stored
    notifyBusiness(
      `New quote request — ${service}`,
      [
        `Service: ${service}`,
        `Name: ${name}`,
        `Phone: ${phone || "—"}`,
        `Email: ${email || "—"}`,
        `Photos: ${photoKeys.length}`,
        "",
        description,
      ].join("\n")
    );
    confirmCustomer(
      email,
      "Your quote request — alterique",
      `Hello ${name},\n\nThank you for your quote request. We've received your details${
        photoKeys.length ? " and photographs" : ""
      } and will reply with a considered quote, usually the same day.\n\nalterique\n29 Queens Rd, London E17 8PY\n07887 255558`
    );

    res.status(201).json({ id: quote._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
