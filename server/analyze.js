import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import OpenAI from 'openai'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    score: { type: 'number', minimum: 0, maximum: 100 },
    criteria: {
      type: 'object',
      additionalProperties: false,
      properties: {
        length: { type: 'number', minimum: 0, maximum: 20 },
        details: { type: 'number', minimum: 0, maximum: 25 },
        constructive: { type: 'number', minimum: 0, maximum: 25 },
        clarity: { type: 'number', minimum: 0, maximum: 10 },
        antiSpam: { type: 'number', minimum: 0, maximum: 20 },
      },
      required: ['length', 'details', 'constructive', 'clarity', 'antiSpam'],
    },
    feedback: { type: 'string' },
    topics: { type: 'array', items: { type: 'string' } },
  },
  required: ['score', 'criteria', 'feedback', 'topics'],
}

function getLevel(score) {
  if (score < 40) return 'Слабый отзыв'
  if (score < 60) return 'Средний отзыв'
  if (score < 80) return 'Полезный отзыв'
  return 'Очень полезный отзыв'
}

function getDiscount(score) {
  if (score < 40) return 0
  if (score < 60) return 3
  if (score < 80) return 5
  return 10
}

function getCoupon(score) {
  if (score < 40) return null
  if (score < 60) return 'FEED3'
  if (score < 80) return 'FEED5'
  return 'FEED10'
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, ai: Boolean(client), apify: Boolean(process.env.APIFY_TOKEN) })
})

function normalizeApifyReview(item, index) {
  const text =
    item.text ??
    item.reviewText ??
    item.comment ??
    item.content ??
    item.description ??
    item.review?.text ??
    item.review?.comment ??
    ''
  const customerName =
    item.authorName ??
    item.userName ??
    item.author ??
    item.name ??
    item.reviewerName ??
    item.user?.name ??
    `2ГИС клиент ${index + 1}`
  const rating = Number(item.rating ?? item.stars ?? item.reviewRating ?? item.review?.rating ?? 5)

  return {
    customerName: String(customerName).trim() || `2ГИС клиент ${index + 1}`,
    rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, Math.round(rating))) : 5,
    text: String(text).trim(),
    date: item.date ?? item.publishedAt ?? item.createdAt ?? item.reviewDate ?? null,
    businessReply: item.businessReply ?? item.reply ?? item.ownerResponse ?? null,
    raw: item,
  }
}

app.post('/api/import/2gis', async (request, response) => {
  const token = process.env.APIFY_TOKEN
  if (!token) {
    response.status(503).json({ error: 'APIFY_TOKEN is not configured' })
    return
  }

  const url = String(request.body?.url ?? '').trim()
  const maxReviews = Math.max(1, Math.min(500, Number(request.body?.maxReviews ?? 50)))

  if (!/^https?:\/\/(2gis\.[^/]+|go\.2gis\.com)\//i.test(url)) {
    response.status(400).json({ error: 'Valid 2GIS place URL is required' })
    return
  }

  const actor = process.env.APIFY_2GIS_ACTOR ?? 'zen-studio/2gis-reviews-scraper'
  const actorId = actor.replace('/', '~')
  const input = {
    startUrls: [url],
    maxPlaces: 1,
    maxReviews,
    proxyConfiguration: {
      useApifyProxy: true,
      apifyProxyGroups: ['RESIDENTIAL'],
    },
  }

  try {
    const apifyResponse = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    )

    if (!apifyResponse.ok) {
      const message = await apifyResponse.text()
      response.status(apifyResponse.status).json({ error: 'Apify actor failed', details: message.slice(0, 500) })
      return
    }

    const items = await apifyResponse.json()
    const reviews = (Array.isArray(items) ? items : [])
      .map(normalizeApifyReview)
      .filter((review) => review.text.length > 2)

    response.json({
      actor,
      count: reviews.length,
      reviews,
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: '2GIS import failed' })
  }
})

app.post('/api/analyze', async (request, response) => {
  if (!client) {
    response.status(503).json({ error: 'OPENAI_API_KEY is not configured' })
    return
  }

  const text = String(request.body?.text ?? '').trim()
  if (!text) {
    response.status(400).json({ error: 'Review text is required' })
    return
  }

  try {
    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'Ты оцениваешь клиентские отзывы для FeedPay. Верни строгий JSON по схеме. Негативный отзыв может быть высоким, если он подробный и конструктивный. Если текст короче 20 символов, score максимум 25. Темы выбирай из: доставка, упаковка, цена, качество, персонал, обслуживание, скорость, приложение, товар, возврат.',
        },
        {
          role: 'user',
          content: `Оцени отзыв по критериям: length 0-20, details 0-25, constructive 0-25, clarity 0-10, antiSpam 0-20. Отзыв: ${text}`,
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'feedpay_review_analysis',
          schema,
          strict: true,
        },
      },
    })

    const parsed = JSON.parse(result.output_text)
    const score = Math.max(0, Math.min(100, Math.round(parsed.score)))

    response.json({
      score,
      level: getLevel(score),
      criteria: parsed.criteria,
      feedback: parsed.feedback,
      topics: parsed.topics,
      discount: getDiscount(score),
      coupon: getCoupon(score),
      provider: 'openai',
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'AI analysis failed' })
  }
})

app.listen(port, () => {
  console.log(`FeedPay API listening on http://localhost:${port}`)
})
