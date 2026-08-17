# alterique API

Express backend for the alterique website — handles quote requests (with photo
uploads to Cloudflare R2) and contact form messages, stored in MongoDB Atlas.

## Endpoints

| Method | Path           | Purpose                                        |
| ------ | -------------- | ---------------------------------------------- |
| GET    | `/health`      | Health check (used by Render)                  |
| POST   | `/api/quote`   | Quote request — multipart, up to 6 photos ≤8MB |
| POST   | `/api/contact` | Contact form message — JSON                    |

Both POST routes are rate-limited (20 requests / 15 min / IP).

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
