import { demoReviews } from '../data/demoReviews'
import type { Campaign, CouponRedemption, ManagerTask, Review } from '../types/review'

const STORAGE_KEY = 'feedpay.reviews.v1'
const CAMPAIGNS_KEY = 'feedpay.campaigns.v1'
const REDEMPTIONS_KEY = 'feedpay.redemptions.v1'
const TASKS_KEY = 'feedpay.tasks.v1'

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

function readList<T>(key: string, fallback: T[]): T[] {
  if (!canUseStorage()) return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }

  try {
    return JSON.parse(raw) as T[]
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

function writeList<T>(key: string, items: T[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(key, JSON.stringify(items))
}

export function getCampaigns(): Campaign[] {
  return readList<Campaign>(CAMPAIGNS_KEY, [])
}

export function saveCampaign(campaign: Campaign) {
  writeList(CAMPAIGNS_KEY, [campaign, ...getCampaigns()])
}

export function getRedemptions(): CouponRedemption[] {
  return readList<CouponRedemption>(REDEMPTIONS_KEY, [])
}

export function saveRedemption(redemption: CouponRedemption) {
  writeList(REDEMPTIONS_KEY, [redemption, ...getRedemptions()])
}

export function getTasks(): ManagerTask[] {
  return readList<ManagerTask>(TASKS_KEY, [])
}

export function saveTasks(tasks: ManagerTask[]) {
  writeList(TASKS_KEY, tasks)
}

export function saveTask(task: ManagerTask) {
  writeList(TASKS_KEY, [task, ...getTasks()])
}
