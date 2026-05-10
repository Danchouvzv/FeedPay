# FeedPay

**FeedPay** is a feedback intelligence platform that helps businesses get useful customer reviews instead of short, empty comments.

Customers receive coupons only when their review is detailed, constructive, and helpful. Businesses receive a dashboard that turns reviews into analytics, risk signals, and clear action items.

FeedPay is not just a “review form”. It is a loop:

```text
Customer feedback -> AI usefulness score -> coupon reward -> business insights -> service improvement
```

## The Problem

Businesses usually have enough ratings, but not enough useful feedback.

Typical reviews look like this:

```text
Норм
Супер
Плохо
Ужас
```

These reviews do not explain:

- what exactly happened
- which product or service failed
- whether the problem was delivery, packaging, price, staff, waiting time, app, return process, or quality
- what the business should improve first

As a result, business owners have ratings, but no operational intelligence.

## The FeedPay Solution

FeedPay motivates customers to write better feedback by rewarding quality, not positivity.

A negative review can receive a high score if it is detailed and constructive:

```text
Заказ ждал 35 минут, хотя в приложении было указано 15 минут.
Персонал был вежливый, но хотелось бы видеть более точное время ожидания.
```

That kind of review is valuable because it gives the business a concrete problem and a direction for improvement.

FeedPay analyzes each review and decides:

- how useful it is
- what topics it mentions
- whether it is spammy or too generic
- what coupon should be issued
- what business action should be prioritized

## What Makes FeedPay Unique

### 1. We reward useful feedback, not fake positivity

FeedPay does not push customers to write only good reviews. The system rewards constructive detail. This makes the platform healthier for both customers and businesses.

### 2. Review quality is scored automatically

Each review receives a score from `0` to `100`.

The score is based on:

- length
- concrete details
- constructiveness
- clarity
- anti-spam and uniqueness

This creates a measurable standard for “good feedback”.

### 3. Coupons become a controlled incentive

Coupons are issued only when the review has enough value.

```text
0-39    no coupon
40-59   FEED3
60-79   FEED5
80-100  FEED10
```

This helps businesses avoid paying for useless one-word reviews.

### 4. FeedPay turns reviews into business actions

The platform does not stop at collecting reviews. It groups feedback by topics, calculates risk, detects repeated problems, and creates action items for the business.

Example:

```text
Topic: доставка
Risk: high
Action: уточнить обещания по доставке и сократить разрыв между обещанным и реальным временем
```

### 5. It can import external reputation data

FeedPay can work not only with new reviews written inside the app, but also with existing public feedback.

Current import modes:

- manual pasted reviews
- 2GIS place URL through Apify

This makes FeedPay useful even for businesses that already have reviews on external platforms.

## Product Flow

### Customer Side

1. Customer opens the review page after a purchase.
2. Customer writes a review and selects a rating.
3. FeedPay analyzes the review.
4. Customer sees the usefulness score.
5. If the review is valuable, customer receives a coupon.

### Business Side

1. Business opens dashboard.
2. Dashboard shows review volume, average rating, average usefulness score, and issued coupons.
3. FeedPay highlights recurring topics and risky areas.
4. The intelligence pipeline creates suggested action items.
5. Business improves operations based on real customer signals.

## Platform Modules

### Landing Page

Explains the product and shows the core value proposition.

Route:

```text
/
```

### Review Form

Mobile-first customer form for submitting feedback.

Route:

```text
/review
```

### Review Analysis

Shows score, level, criteria breakdown, feedback, and coupon eligibility.

Route:

```text
/analysis
```

### Coupon Page

Shows issued coupon, discount, QR code, expiration text, and copy button.

Route:

```text
/coupon
```

### Business Dashboard

Shows:

- total reviews
- average rating
- average usefulness score
- issued coupons
- review distribution by usefulness
- reviews over time
- frequent topics
- latest reviews
- AI action board
- pipeline health metrics
- CSV export
- links to campaign builder, coupon redemption, manager tasks, and partner demo case

Route:

```text
/dashboard
```

### Import Center

Imports reviews from pasted text or from 2GIS through Apify.

Route:

```text
/import
```

### FeedPay Intelligence Engine

The technical pipeline that turns raw feedback into business decisions.

Route:

```text
/pipeline
```

### QR Campaign Builder

Creates review campaigns for branches and generates QR links that can be printed at checkout, on receipts, or on packaging.

Route:

```text
/campaigns
```

### Coupon Redemption

Cashier mode for redeeming issued coupons such as `FEED3`, `FEED5`, and `FEED10`.

Route:

```text
/redeem
```

### Manager Task Board

Turns pipeline action items into tasks with statuses:

```text
open -> in_progress -> done
```

Route:

```text
/tasks
```

### Partner Demo Case

A guided scenario for showing the product to partners using a coffee shop example.

Route:

```text
/case/coffee-shop
```

## Intelligence Pipeline

FeedPay is built around a technical pipeline:

```text
Ingest -> Normalize -> Trust Layer -> AI Score -> Topic Risk -> Action Routing -> Growth Loop
```

### 1. Ingest

Reviews can enter the system from:

- customer form
- pasted text
- 2GIS import through Apify
- future CRM/webhook/API integrations

### 2. Normalize

Different sources are converted into one internal `Review` structure:

```ts
{
  id: string
  customerName: string
  productName: string
  rating: number
  text: string
  score: number
  level: string
  coupon: string | null
  discount: number
  criteria: object
  topics: string[]
  createdAt: string
  source: string
}
```

### 3. Trust Layer

FeedPay detects:

- very short reviews
- generic reviews
- repeated text
- spam-like patterns
- duplicate review groups

### 4. AI Score

FeedPay supports two scoring modes:

- local deterministic scoring
- OpenAI scoring through backend endpoint

If OpenAI is unavailable, the app automatically falls back to local scoring.

### 5. Topic Risk

Reviews are grouped by operational themes:

- delivery
- packaging
- price
- quality
- personnel
- service
- speed
- app
- product
- returns

Each topic receives risk signals based on review count, rating, usefulness score, and negative review share.

### 6. Action Routing

FeedPay creates suggested action items, for example:

```text
High priority: сократить время ожидания
Reason: 12 reviews mention speed, average rating 3.1, risk score 72/100
```

This is the part that makes FeedPay more than a feedback collector.

## 2GIS and Apify Integration

FeedPay can import existing reviews from 2GIS using Apify.

Default Actor:

```text
zen-studio/2gis-places-scraper-api
```

How it works:

1. User pastes a 2GIS place URL.
2. FeedPay backend calls Apify.
3. Apify returns place data with nested `reviews[]`.
4. FeedPay flattens the reviews.
5. Each review is scored.
6. Results appear in dashboard and pipeline.

Direct browser scraping is avoided because public pages can block cross-origin requests and change markup. Apify is used as the scraping layer.

## Why Businesses Would Use This

FeedPay is useful for:

- cafes and restaurants
- online stores
- delivery services
- beauty salons
- clinics
- local service businesses
- apps and marketplaces
- any business that wants better feedback quality

Business value:

- more detailed reviews
- less spam
- controlled coupon incentives
- better understanding of customer pain points
- operational priorities from real feedback
- faster reaction to repeated issues
- import of existing external reputation data
- QR campaigns for physical locations
- coupon redemption loop for cashiers
- manager task board for operational follow-up
- CSV export for reporting

## Technical Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- lucide-react
- qrcode.react
- motion
- Express backend
- OpenAI API support
- Apify API support
- localStorage for MVP persistence

## Project Structure

```text
src/
  components/
  components/ui/
  pages/
  utils/
  types/
  data/
server/
  analyze.js
```

Important files:

```text
src/utils/analyzeReview.ts      local scoring algorithm
src/utils/aiAnalysis.ts         OpenAI endpoint fallback adapter
src/utils/intelligence.ts       pipeline metrics, risk, action items
src/utils/parse2gisReviews.ts   pasted review parser
src/utils/storage.ts            localStorage layer
src/utils/exportCsv.ts          CSV export
server/analyze.js               OpenAI + Apify backend endpoints
```

## Running Locally

Install dependencies:

```bash
npm install
```

Run frontend only:

```bash
npm run dev
```

Run frontend and backend:

```bash
npm run dev:full
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8787
```

## Environment Variables

Create `.env`:

```bash
cp .env.example .env
```

Example:

```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4.1-mini
APIFY_TOKEN=apify_api_your-token-here
APIFY_2GIS_ACTOR=zen-studio/2gis-places-scraper-api
PORT=8787
```

Health check:

```bash
curl http://localhost:8787/api/health
```

## Scripts

```bash
npm run dev       # frontend only
npm run api       # backend only
npm run dev:full  # frontend + backend
npm run build     # TypeScript and production build
npm run lint      # ESLint
```

## Current MVP Limitations

FeedPay is currently an MVP.

Current limitations:

- reviews are stored in browser `localStorage`
- no business authentication yet
- no real coupon redemption tracking yet
- coupon redemption is local MVP storage, not a production cashier system yet
- no multi-tenant business accounts yet
- no production database yet
- no payment or billing layer yet

## Production Roadmap

Next production-level steps:

- Supabase or Firebase backend
- business accounts and authentication
- separate customer and business workspaces
- persistent database
- QR campaign management
- coupon redemption tracking
- fraud detection
- webhooks and integrations
- scheduled 2GIS reputation sync
- export to CSV/Excel
- role-based access for managers and owners

## One-Line Pitch

**FeedPay helps businesses pay only for feedback that is actually useful, then turns that feedback into operational intelligence.**
