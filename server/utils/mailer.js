const nodemailer = require("nodemailer");

/**
 * Email notifications. If SMTP env vars are missing, emails are skipped
 * (the submission is still stored in MongoDB — nothing is ever lost).
 */

const configured =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = configured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

async function send(to, subject, text) {
  if (!transporter || !to) return;
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  } catch (err) {
    // Never fail the request because email failed — it's stored in the DB
    console.error("Mail send failed:", err.message);
  }
}

async function notifyBusiness(subject, text) {
  return send(process.env.NOTIFY_EMAIL, subject, text);
}

async function confirmCustomer(email, subject, text) {
  return send(email, subject, text);
}

module.exports = { notifyBusiness, confirmCustomer };
