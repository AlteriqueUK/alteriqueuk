const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const { notifyBusiness } = require("../utils/mailer");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, phone, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email and message are required." });
    }

    const saved = await ContactMessage.create({ name, phone, email, message });

    notifyBusiness(
      `New website message — ${name}`,
      [`Name: ${name}`, `Phone: ${phone || "—"}`, `Email: ${email}`, "", message].join("\n")
    );

    res.status(201).json({ id: saved._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
