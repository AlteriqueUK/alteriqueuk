const nodemailer = require("nodemailer");

/**
 * Email notifications for quote requests and contact messages.
 *
 * Any SMTP provider works. Pick one with MAIL_PROVIDER and its host, port and
 * username are filled in for you — usually all that is left is the API key in
 * SMTP_PASS. MAIL_PROVIDER=smtp (or an unknown name) means "I will set
 * SMTP_HOST and SMTP_PORT myself".
 *
 * Nothing here can lose a submission — it is stored in MongoDB before the
 * email is attempted, and a failure is recorded rather than thrown, so the
 * admin panel can show what went wrong instead of failing silently.
 */

const PROVIDERS = {
  // key            host                      port  fixed username / notes
  resend: {
    host: "smtp.resend.com",
    port: 587,
    user: "resend",
    // Resend's sandbox sender: works with no domain of your own, but only
    // delivers to the address the Resend account was opened with
    from: "alterique <onboarding@resend.dev>",
    pass: "the API key from resend.com/api-keys",
  },
  brevo: {
    host: "smtp-relay.brevo.com",
    port: 587,
    pass: "the SMTP key from Brevo → SMTP & API",
    note: "SMTP_USER is the login shown on that same page, not your email.",
  },
  sendgrid: {
    host: "smtp.sendgrid.net",
    port: 587,
    user: "apikey", // literally the word "apikey"
    pass: "the API key from SendGrid → Settings → API Keys",
  },
  mailgun: {
    host: "smtp.mailgun.org",
    port: 587,
    pass: "the SMTP password from the Mailgun domain page",
    note: "SMTP_USER is postmaster@your-domain.",
  },
  postmark: {
    host: "smtp.postmarkapp.com",
    port: 587,
    useTokenAsUser: true, // username and password are both the server token
    pass: "the Server API token",
  },
  zoho: { host: "smtp.zoho.eu", port: 465 },
  outlook: { host: "smtp.office365.com", port: 587 },
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    pass: "a 16-character App Password — Google rejects the account password",
  },
};

/** Where quote and contact notifications land. */
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "alteriqueforuk@gmail.com";

const PROVIDER = (process.env.MAIL_PROVIDER || "gmail").trim().toLowerCase();
const preset = PROVIDERS[PROVIDER];

const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST || (preset ? preset.host : "");
const SMTP_PORT = Number(process.env.SMTP_PORT || (preset ? preset.port : 587));
const SMTP_USER =
  process.env.SMTP_USER ||
  (preset && preset.user) ||
  (preset && preset.useTokenAsUser ? SMTP_PASS : "") ||
  "";

// Third-party senders only deliver from an address you have verified with
// them, so this cannot just be assumed the way it can with Gmail
const MAIL_FROM =
  process.env.MAIL_FROM ||
  (preset && preset.from) ||
  (SMTP_USER.includes("@") ? `alterique <${SMTP_USER}>` : "");

/** The one thing stopping email from working, in the order worth fixing. */
function configProblem() {
  if (!SMTP_PASS) {
    const what = preset && preset.pass ? preset.pass : "the SMTP password";
    return `SMTP_PASS is not set — it should be ${what}.`;
  }
  if (!SMTP_HOST) {
    return `MAIL_PROVIDER "${PROVIDER}" is not one I know (${Object.keys(PROVIDERS).join(", ")}) — set SMTP_HOST and SMTP_PORT yourself.`;
  }
  if (!SMTP_USER) {
    const note = preset && preset.note ? ` ${preset.note}` : "";
    return `SMTP_USER is not set.${note}`;
  }
  if (!MAIL_FROM) {
    return `MAIL_FROM is not set — ${PROVIDER} needs a sender address you have verified with them, e.g. "alterique <hello@alterique.co.uk>".`;
  }
  return null;
}

const problem = configProblem();
const configured = !problem;

const transporter = configured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 587 upgrades with STARTTLS instead
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

/** What happened last time, so the panel can report rather than guess. */
const state = { lastError: null, lastSentAt: null, verified: null };

async function send(to, subject, text, { html, replyTo } = {}) {
  if (!transporter) {
    state.lastError = problem;
    console.warn(`Mail skipped ("${subject}"): ${problem}`);
    return false;
  }
  if (!to) {
    state.lastError = "No recipient address to notify.";
    return false;
  }
  try {
    await transporter.sendMail({ from: MAIL_FROM, to, subject, text, html, replyTo });
    state.lastSentAt = new Date().toISOString();
    state.lastError = null;
    return true;
  } catch (err) {
    // Never fail the request because email failed — it's already in the DB
    state.lastError = err.message;
    console.error(`Mail send failed (to ${to}):`, err.message);
    return false;
  }
}

async function notifyBusiness(subject, text, options) {
  return send(NOTIFY_EMAIL, subject, text, options);
}

/** Signs in to the SMTP server without sending anything. */
async function verifyMail() {
  if (!transporter) {
    state.verified = false;
    state.lastError = problem;
    return { ok: false, error: problem };
  }
  try {
    await transporter.verify();
    state.verified = true;
    state.lastError = null;
    return { ok: true };
  } catch (err) {
    state.verified = false;
    state.lastError = err.message;
    return { ok: false, error: err.message };
  }
}

/**
 * Sends a real notification to the business address — the same path a quote
 * request takes, so if this arrives, quote emails will too.
 */
async function sendTestEmail() {
  const when = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const sent = await send(
    NOTIFY_EMAIL,
    "alterique — test notification",
    [
      `Test sent from the alterique admin panel at ${when}.`,
      "",
      `If you are reading this, quote requests and contact messages will reach you at ${NOTIFY_EMAIL}.`,
    ].join("\n"),
    {
      html: notificationHtml(
        "Test notification",
        [
          ["Sent", when],
          ["Goes to", NOTIFY_EMAIL],
          ["Sent as", MAIL_FROM],
          ["Sent via", `${PROVIDER} (${SMTP_HOST}:${SMTP_PORT})`],
        ],
        { footerNote: "Triggered from the admin panel" }
      ),
    }
  );
  if (!sent) throw new Error(state.lastError || "The email could not be sent.");
  return { to: NOTIFY_EMAIL };
}

/** Everything the admin panel needs to explain itself. Never the password. */
function mailStatus() {
  return {
    configured,
    problem,
    provider: PROVIDER,
    providers: Object.keys(PROVIDERS),
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER || null,
    from: MAIL_FROM || null,
    notify: NOTIFY_EMAIL,
    verified: state.verified,
    lastSentAt: state.lastSentAt,
    lastError: state.lastError,
  };
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

module.exports = {
  notifyBusiness,
  notificationHtml,
  mailStatus,
  verifyMail,
  sendTestEmail,
};
