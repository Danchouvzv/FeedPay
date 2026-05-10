# FeedPay

FeedPay is a web platform for businesses that want fewer empty reviews and more useful customer feedback.

The idea is simple: after a purchase, a customer opens a review form, writes feedback, FeedPay evaluates how useful and constructive the review is, and then gives a coupon if the review is good enough. The business gets a dashboard with analytics, recurring topics, ratings, issued coupons, and imported reviews.

## Why FeedPay Exists

Most reviews are too short to help a business make decisions:

> “Норм”

FeedPay rewards feedback that contains context, details, problems, and suggestions:

> “Заказ ждал 35 минут, хотя в приложении было указано 15 минут. Персонал был вежливый, но хотелось бы видеть более точное время ожидания.”

Negative reviews can score highly if they are detailed and constructive. The goal is not to buy positive reviews, but to motivate feedback that helps improve service, products, delivery, packaging, support, and customer experience.

## Core Flow

1. Customer opens the review page.
2. Customer enters name, product/service, rating, and review text.
3. FeedPay analyzes the review from 0 to 100.
4. If the score is high enough, FeedPay issues a coupon.
5. Business sees all reviews and analytics in the dashboard.

## Scoring Logic

Reviews are evaluated by five criteria:

- Length: 20 points
- Concrete details: 25 points
- Constructiveness: 25 points
- Clarity: 10 points
- Anti-spam and uniqueness: 20 points

Coupon rules:

- `0-39`: no coupon
- `40-59`: `FEED3`
- `60-79`: `FEED5`
- `80-100`: `FEED10`

The app supports two scoring modes:

- Local deterministic scoring for fast demo and offline MVP usage.
- OpenAI-powered scoring through the local backend endpoint `/api/analyze`.

If OpenAI is not configured or unavailable, FeedPay automatically falls back to local scoring.

## Pages

- `/` — landing page explaining the platform.
- `/review` — customer review form.
- `/analysis` — review score, criteria breakdown, feedback, and coupon action.
- `/coupon` — generated coupon with QR code.
- `/dashboard` — business analytics dashboard.
- `/import` — import reviews from pasted text or from 2GIS through Apify.
- `/pipeline` — FeedPay Intelligence Engine: ingest, normalize, trust layer, AI score, action routing, and growth loop.

## Business Dashboard

The dashboard shows:

- Total reviews
- Average rating
- Average usefulness score
- Issued coupons
- Distribution by usefulness level
- Reviews over time
- Frequent topics such as delivery, packaging, price, quality, personnel, service, app, product, and returns
- Latest reviews with rating, score, coupon, source, and topics
- AI action board with suggested business priorities
- Pipeline health metrics such as imported reviews, duplicate groups, urgent items, and automation rate

## Intelligence Pipeline

FeedPay includes a technical pipeline that turns raw reviews into business actions:

1. Ingest reviews from manual form, pasted text, 2GIS/Apify, and future webhooks.
2. Normalize data into one `Review` structure.
3. Detect duplicate or low-trust review patterns.
4. Score review quality with OpenAI or local fallback.
5. Extract topics and calculate risk per business area.
6. Generate prioritized action items for operators and managers.

The pipeline is implemented in:

```text
src/utils/intelligence.ts
src/pages/PipelinePage.tsx
```

## 2GIS Import

FeedPay can import reviews in two ways.

Manual paste mode:

- Copy reviews from 2GIS.
- Paste them into `/import`.
- FeedPay parses review blocks, detects rating and author when possible, scores the reviews, and saves them to the dashboard.

Apify mode:

- Paste a 2GIS place URL into `/import`.
- FeedPay backend calls Apify.
- Apify returns place data with nested `reviews[]`.
- FeedPay flattens those reviews, scores them, and saves them to the dashboard.

Default Apify Actor:

```bash
zen-studio/2gis-places-scraper-api
```

Direct browser scraping is intentionally avoided because public pages can block cross-origin requests and change markup. Apify acts as the scraping layer.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- lucide-react
- qrcode.react
- motion
- Express backend for AI and Apify proxy endpoints
- localStorage as MVP storage

## Local Development

Install dependencies:

```bash
npm install
```

Run frontend only:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Frontend-only mode works for local scoring and manual demo data, but API features such as OpenAI and Apify require the backend.

## Run With Backend

Create `.env`:

```bash
cp .env.example .env
```

Set environment variables:

```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4.1-mini
APIFY_TOKEN=apify_api_your-token-here
APIFY_2GIS_ACTOR=zen-studio/2gis-places-scraper-api
PORT=8787
```

Run frontend and backend together:

```bash
npm run dev:full
```

This starts:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8787`

API health check:

```bash
curl http://localhost:8787/api/health
```

## Scripts

```bash
npm run dev       # Vite frontend only
npm run api       # Express API only
npm run dev:full  # frontend + API
npm run build     # TypeScript + production build
npm run lint      # ESLint
```

## MVP Storage

FeedPay currently stores reviews in browser `localStorage`.

The storage layer is isolated in:

```text
src/utils/storage.ts
```

This makes it easier to replace localStorage later with Firebase, Supabase, PostgreSQL, or another backend.

## Notes

- `.env` is ignored by git.
- Do not commit OpenAI or Apify tokens.
- The current app is designed as a presentation-ready MVP, not a production billing or coupon redemption system.
- For production, add authentication, business accounts, persistent database storage, coupon redemption tracking, rate limiting, and stricter review fraud detection.
