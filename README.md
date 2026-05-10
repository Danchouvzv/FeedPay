# FeedPay

FeedPay is a React + TypeScript MVP for rewarding detailed customer feedback with coupons and business analytics.

## Features

- Mobile-first review form
- AI-ready review scoring from 0 to 100
- Coupon generation: `FEED3`, `FEED5`, `FEED10`
- Dashboard with charts, topics, coupons and latest reviews
- 2GIS-style pasted review importer at `/import`
- `localStorage` persistence for MVP mode

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Run With Real AI Analysis

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4.1-mini
```

Start frontend and API together:

```bash
npm run dev:full
```

If the API key is missing or the API is unavailable, FeedPay automatically falls back to the local deterministic scoring algorithm.

## 2GIS Import

Go to `/import`, paste copied reviews from 2GIS into the textarea, set the product/branch name, and click import. The app parses separate review blocks, runs scoring, and saves them to the dashboard.

Direct scraping is intentionally not used in the browser because public review pages can block cross-origin requests and may change markup or access rules.
