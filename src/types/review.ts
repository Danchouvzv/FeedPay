export type ReviewLevel =
  | 'Слабый отзыв'
  | 'Средний отзыв'
  | 'Полезный отзыв'
  | 'Очень полезный отзыв'

export type ReviewCriteria = {
  length: number
  details: number
  constructive: number
  clarity: number
  antiSpam: number
}

export type ReviewAnalysis = {
  score: number
  level: ReviewLevel
  criteria: ReviewCriteria
  feedback: string
  topics: string[]
  discount: number
  coupon: string | null
  provider?: 'local' | 'openai'
}

export type Review = {
  id: string
  customerName: string
  productName: string
  rating: number
  text: string
  score: number
  level: ReviewLevel
  coupon: string | null
  discount: number
  criteria: ReviewCriteria
  topics: string[]
  createdAt: string
  source?: 'manual' | '2gis-import' | 'demo'
}
