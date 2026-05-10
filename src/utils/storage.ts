import { demoReviews } from '../data/demoReviews'
import type { Review } from '../types/review'

const STORAGE_KEY = 'feedpay.reviews.v1'

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function getReviews(): Review[] {
  if (!canUseStorage()) return demoReviews

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoReviews))
    return demoReviews
  }

  try {
    return JSON.parse(raw) as Review[]
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoReviews))
    return demoReviews
  }
}

export function saveReviews(reviews: Review[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

export function saveReview(review: Review) {
  const reviews = getReviews()
  saveReviews([review, ...reviews])
}

export function saveImportedReviews(importedReviews: Review[]) {
  const reviews = getReviews()
  saveReviews([...importedReviews, ...reviews])
}

export function resetDemoReviews() {
  saveReviews(demoReviews)
}

export function clearReviews() {
  saveReviews([])
}
