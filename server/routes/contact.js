const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const { notifyBusiness, notificationHtml } = require("../utils/mailer");

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
      "NEW Message",
      [`Name: ${name}`, `Phone: ${phone || "—"}`, `Email: ${email}`, "", message].join("\n"),
      {
        replyTo: email,
        html: notificationHtml("NEW Message", [
          ["Name", name],
          ["Phone", phone],
          ["Email", email],
          ["Message", message],
        ]),
      }
    );

    res.status(201).json({ id: saved._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
