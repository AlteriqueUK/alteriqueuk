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

async function send(to, subject, text, { html, replyTo } = {}) {
  if (!transporter || !to) return;
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
      replyTo,
    });
  } catch (err) {
    // Never fail the request because email failed — it's stored in the DB
    console.error("Mail send failed:", err.message);
  }
}

async function notifyBusiness(subject, text, options) {
  return send(process.env.NOTIFY_EMAIL, subject, text, options);
}

// --- HTML notification template (same approach as the Surrey Quays site) ---

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const cell = "padding:8px;border:1px solid #eee";

/**
 * rows: array of [label, value] pairs (falsy values are skipped)
 * links: optional array of { label, url } rendered as clickable links
 */
function notificationHtml(heading, rows, { links = [], footerNote = "" } = {}) {
  const tableRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="${cell};font-weight:600;width:35%">${esc(label)}</td><td style="${cell};white-space:pre-wrap">${esc(value)}</td></tr>`
    )
    .join("");

  const linkList = links.length
    ? `<p style="margin:20px 0 8px;font-weight:600;font-size:14px">Uploaded photos</p>` +
      links
        .map(
          (l, i) =>
            `<p style="margin:4px 0"><a href="${esc(l.url)}" style="color:#33534b;font-size:13px;word-break:break-all">${esc(l.label || `Photo ${i + 1}`)}</a></p>`
        )
        .join("")
    : "";

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#1f2723;padding:16px 20px;border-radius:8px 8px 0 0">
        <h1 style="color:#f4efe8;margin:0;font-size:18px;font-weight:500;letter-spacing:0.04em">alterique</h1>
        <p style="color:rgba(244,239,232,0.7);margin:4px 0 0;font-size:13px">${esc(heading)}</p>
      </div>
      <div style="border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;padding:24px">
        <h2 style="color:#33534b;margin:0 0 16px;font-size:16px">${esc(heading)}</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">${tableRows}</table>
        ${linkList}
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px;margin:0">
          Sent from the alterique website · 29 Queens Rd, London E17 8PY${footerNote ? ` · ${esc(footerNote)}` : ""}
        </p>
      </div>
    </div>
  `;
}

module.exports = { notifyBusiness, notificationHtml };
