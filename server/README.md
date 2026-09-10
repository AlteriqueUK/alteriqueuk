# alterique API

Express backend for the alterique website — handles quote requests (with photo
uploads to Cloudflare R2) and contact form messages, stored in MongoDB Atlas.

## Endpoints

| Method | Path                 | Purpose                                        |
| ------ | -------------------- | ---------------------------------------------- |
| GET    | `/health`            | Health check (used by Render)                  |
| POST   | `/api/quote`         | Quote request — multipart, up to 6 photos ≤8MB |
| POST   | `/api/contact`       | Contact form message — JSON                    |
| GET    | `/api/journal`       | Published articles (consumed by the website)   |
| GET    | `/api/journal/:slug` | One published article                          |

Both form POST routes are rate-limited (20 requests / 15 min / IP).

### Admin (`/api/admin`, Bearer token from `POST /api/admin/login`)

| Method | Path                          | Purpose                                        |
| ------ | ----------------------------- | ---------------------------------------------- |
| GET    | `/quotes` `/messages`         | Submissions, newest first                      |
| GET    | `/customers`                  | Customer list, ordered by phone number         |
| POST   | `/customers`                  | Add — 409 if that person is already on file    |
| PUT    | `/customers/:id`              | Edit — 409 if it would clash with another      |
| POST   | `/customers/merge-duplicates` | Fold older duplicates into one record each     |
| GET    | `/journal`                    | All articles, published or not                 |
| POST   | `/journal/image`              | Article picture — multipart, one image ≤8MB   |
| POST   | `/journal` `PUT /journal/:id` | Create / edit an article                       |
| GET    | `/mail`                       | Whether email is set up, and what went wrong   |
| POST   | `/mail/test`                  | Send a real test notification                  |

## No duplicate customers

Customers are matched on their phone number in canonical form (`utils/phone.js`
— "+44 7887 255558", "0044 7887 255558" and "07887 255558" are all the same
person) or on their email address. Nothing that matches an existing record can
be added, whether it comes from the admin panel or from a quote request; a
quote from someone already on file tops up any detail that was missing instead
of making a second entry.

Records that predate this, or that were entered before the rule existed, show
up in the panel with a *duplicate* tag and a **Merge duplicates** button. A
merge keeps the oldest record — including its "Added" date — fills in whatever
is blank on it from the newer ones, joins the comments, and deletes the spares.

## Journal pictures

Pictures uploaded in the admin panel are stored in the same R2 bucket as
garment photos, under `journal/`, and the article keeps the object key rather
than a URL. Links are resolved fresh on every read, so a presigned link can
never go stale in the database — and setting `R2_PUBLIC_URL` later upgrades
every existing article to the public URL automatically.

The website loads these through `next/image`, so the bucket's hostname must be
allowed in `next.config.mjs`. `*.r2.dev` and the R2 S3 endpoint are already
listed; for a custom bucket domain, set `NEXT_PUBLIC_IMAGE_HOSTNAME` on the
frontend host.

## Local development

```bash
cd server
npm install
cp .env.example .env   # every variable is listed and explained there
npm run dev
```

R2 and SMTP settings are optional — without them, photos are skipped and
emails aren't sent, but every submission is still stored in MongoDB. The API
says which of them are on when it starts up.

## Deploying to Render (free tier)

1. Push this repo to GitHub.
2. Render → New → Web Service → connect the repo.
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. Add the environment variables from `.env.example`.
5. After deploy, set `NEXT_PUBLIC_API_URL=https://<your-service>.onrender.com`
   on the frontend host and redeploy the site.

Note: free-tier services sleep after inactivity — the first request after a
quiet period takes ~30s. The quote form shows a "Sending…" state to cover this.

## Email notifications

Quote requests and contact messages are emailed to **alteriqueforuk@gmail.com**
(override with `NOTIFY_EMAIL`). Any SMTP provider works — name one in
`MAIL_PROVIDER` and its host, port and username are filled in for you, so
usually only the API key is left to set.

| `MAIL_PROVIDER` | Also set                                    | Free tier    |
| --------------- | ------------------------------------------- | ------------ |
| `resend`        | `SMTP_PASS` = API key — **nothing else**    | 3,000/month  |
| `brevo`         | `SMTP_PASS`, `SMTP_USER`, `MAIL_FROM`       | 300/day      |
| `sendgrid`      | `SMTP_PASS` = API key, `MAIL_FROM`          | 100/day      |
| `postmark`      | `SMTP_PASS` = server token, `MAIL_FROM`     | 100/month    |
| `mailgun`       | `SMTP_PASS`, `SMTP_USER` = postmaster@…     | trial        |
| `zoho` `outlook` `gmail` | `SMTP_PASS`, `SMTP_USER`           | mailbox      |

Anything else: `MAIL_PROVIDER=smtp` plus `SMTP_HOST` and `SMTP_PORT`.

**Recommended — Resend.** Two variables and it works:

```
MAIL_PROVIDER=resend
SMTP_PASS=re_xxxxxxxxxxxx
```

It sends from `onboarding@resend.dev`, Resend's sandbox sender, which delivers
to the address the Resend account was opened with — so open the account with
alteriqueforuk@gmail.com and there is no domain to verify. Later, verify
alterique.co.uk with Resend and set `MAIL_FROM=alterique <hello@alterique.co.uk>`
to send from your own domain.

Two things every third party has in common: `SMTP_PASS` is an API key rather
than a password, and `MAIL_FROM` must be an address you have verified with
them — they will not send from an address you do not own. The API refuses to
start sending with a half-finished setup and names the missing piece instead.

**To check it works:** open the admin panel, Quotations tab, and press
*Send test email*. It sends a real notification down the same path a quote
request takes and shows the mail server's own words if it fails. The API also
prints the verdict on startup:

```
Email ready via resend: sending as alterique <onboarding@resend.dev> → alteriqueforuk@gmail.com
EMAIL BROKEN — resend (smtp.resend.com:587) turned us away: Invalid login: 535 …
EMAIL OFF (sendgrid) — MAIL_FROM is not set — sendgrid needs a sender address …
```

A failed email never loses an enquiry — it is written to MongoDB first and is
always readable in the admin panel.

## Cloudflare R2 setup

1. Cloudflare dashboard → R2 → Create bucket (e.g. `alterique-quotes`, keep it private).
2. R2 → Manage API tokens → Create token with *Object Read & Write* on that bucket.
3. Copy Account ID, Access Key ID and Secret into the env vars.
