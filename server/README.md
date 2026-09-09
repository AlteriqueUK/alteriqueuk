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
cp .env.example .env   # fill in MONGODB_URI at minimum
npm run dev
```

R2 and SMTP settings are optional — without them, photos are skipped and
emails aren't sent, but every submission is still stored in MongoDB.

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

## Cloudflare R2 setup

1. Cloudflare dashboard → R2 → Create bucket (e.g. `alterique-quotes`, keep it private).
2. R2 → Manage API tokens → Create token with *Object Read & Write* on that bucket.
3. Copy Account ID, Access Key ID and Secret into the env vars.
