# alterique — website

Premium alterations, tailoring and garment care in Walthamstow, London.
Next.js frontend + Express API (`server/`) for quote requests.

## Stack

- **Frontend**: Next.js (App Router, JavaScript), Tailwind CSS v4, shadcn/ui
- **Backend**: Express on Render free tier (`server/` — see its README)
- **Database**: MongoDB Atlas · **Photo storage**: Cloudflare R2

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

The site works fully without the backend: the quote form falls back to
WhatsApp and the contact form to email until `NEXT_PUBLIC_API_URL` is set
(see `.env.example`).

## Where things live

| Path                     | What                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `lib/site-config.js`     | **All business details** — phone, address, hours, links     |
| `lib/data/`              | Services, journal articles, gallery, testimonials (content) |
| `lib/google-reviews.js`  | Live rating + review count from the Business Profile        |
| `components/`            | One file per section, grouped by page                       |
| `app/`                   | Pages, sitemap, robots, 404                                 |
| `server/`                | Express API (quote, contact, journal, admin), Render-ready  |

## Reviews

`lib/data/testimonials.js` holds real Google reviews, quoted word for word.
The ones marked `featured` cycle through the slider on the homepage — keep it
to four or five; it advances on its own every seven seconds, waits while
someone is reading it, and stays still for anyone who has asked for reduced
motion.

The rating and review count are hard-coded in `lib/site-config.js` and used
everywhere (hero, reviews section, structured data). To have them follow the
Business Profile instead, set two server-side environment variables:

| Variable                 | Where to get it                                           |
| ------------------------ | --------------------------------------------------------- |
| `GOOGLE_PLACES_API_KEY`  | Google Cloud console → Places API (New) → create a key   |
| `GOOGLE_PLACE_ID`        | Google's Place ID Finder, searching for the shop           |

The figures are then rechecked once a day. If either is missing, or the call
fails, the numbers in `lib/site-config.js` are used — nothing breaks, the site
just stops updating itself.

## Swapping in real photography

Every image renders through `components/shared/EditorialImage.jsx`. Drop the
client's photos into `public/images/` and add `src: "/images/<file>.jpg"` to
the matching image object in `lib/data/*` — placeholders disappear
automatically.

## Before launch (TODOs)

- Confirm domain and email address in `lib/site-config.js`
- Replace the wordmark with the client's logo SVG (`components/layout/Wordmark.jsx`)
  — "The Seasons" is Canva-licensed, so the logo must ship as SVG, not a webfont
- Client review of all placeholder copy (services, journal, privacy policy)
- Real photography via `lib/data/` + `public/images/`
- Deploy `server/` to Render, set `NEXT_PUBLIC_API_URL`
- Optional: `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` so the review count
  keeps itself up to date (see Reviews above)
- GA4 + Search Console + Microsoft Clarity behind a consent banner
