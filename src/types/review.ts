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
  source?: 'manual' | '2gis-import' | '2gis-apify' | 'demo'
  campaignId?: string
}

export type Campaign = {
  id: string
  name: string
  branchName: string
  rewardRule: string
  qrUrl: string
  createdAt: string
  expiresAt: string
  couponLimit: number
  issuedCoupons: number
}

export type CouponRedemption = {
  id: string
  code: string
  customerName: string
  discount: number
  status: 'redeemed' | 'rejected'
  redeemedAt: string
  note: string
}

export type ManagerTask = {
  id: string
  title: string
  topic: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'open' | 'in_progress' | 'done'
  source: 'pipeline' | 'manual'
  createdAt: string
  description: string
}
