const express = require("express");
const multer = require("multer");
const QuoteRequest = require("../models/QuoteRequest");
const Customer = require("../models/Customer");
const { uploadPhoto, photoUrls } = require("../config/r2");
const { findDuplicate } = require("../utils/customers");
const { notifyBusiness, notificationHtml } = require("../utils/mailer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 6, fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    cb(null, file.mimetype.startsWith("image/")),
});

async function addCustomerFromQuote({ name, email, phone }) {
  try {
    // One customer record per person — matched on the phone number however it
    // was typed, or on the email, so a repeat customer never lands twice
    const duplicate = await findDuplicate({ email, phone });
    if (duplicate) {
      // Fill in a detail we didn't have on file, but never overwrite one
      const patch = {};
      if (email && !duplicate.customer.email) patch.email = email;
      if (phone && !duplicate.customer.phone) patch.phone = phone;
      if (Object.keys(patch).length) {
        await Customer.findByIdAndUpdate(duplicate.customer._id, patch);
      }
      return;
    }
    await Customer.create({ name, email, phone, comment: "website" });
  } catch (err) {
    console.error("Customer auto-add failed:", err.message);
  }
}

router.post("/", upload.array("photos", 6), async (req, res, next) => {
  try {
    const { service, description, name, phone, email } = req.body;

    if (!service || !description || !name || (!phone && !email)) {
      return res.status(400).json({
        error: "Service, description, name and a phone or email are required.",
      });
    }

    const photoKeys = (
      await Promise.all((req.files || []).map((file) => uploadPhoto(file)))
    ).filter(Boolean);

    const quote = await QuoteRequest.create({
      service,
      description,
      name,
      phone,
      email,
      photoKeys,
    });

    // Customer list entry + notifications are fire-and-forget — the quote is
    // already stored, so none of these can lose it
    addCustomerFromQuote({ name, email, phone });

    photoUrls(photoKeys).then((urls) =>
      notifyBusiness(
        "Here is A New Quotation from Customer",
        [
          `Service: ${service}`,
          `Name: ${name}`,
          `Phone: ${phone || "—"}`,
          `Email: ${email || "—"}`,
          "",
          description,
          "",
          ...urls.map((u, i) => `Photo ${i + 1}: ${u}`),
        ].join("\n"),
        {
          replyTo: email || undefined,
          html: notificationHtml(
            "Here is A New Quotation from Customer",
            [
              ["Service", service],
              ["Name", name],
              ["Phone", phone],
              ["Email", email],
              ["Description", description],
            ],
            { links: urls.map((url, i) => ({ label: `Photo ${i + 1}`, url })) }
          ),
        }
      )
    );

    res.status(201).json({ id: quote._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
