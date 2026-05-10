import type { ReviewAnalysis, ReviewLevel } from '../types/review'
import { generateCoupon, getDiscount } from './coupon'

const detailKeywords = [
  'доставка',
  'упаковка',
  'качество',
  'цена',
  'сервис',
  'обслуживание',
  'персонал',
  'время',
  'товар',
  'приложение',
  'заказ',
  'возврат',
  'проблема',
  'удобно',
  'быстро',
  'медленно',
  'цвет',
  'фото',
]

const constructivePhrases = [
  'было бы лучше',
  'можно улучшить',
  'советую',
  'предлагаю',
  'хотелось бы',
  'нужно добавить',
  'проблема',
  'если бы',
  'добавить',
  'исправить',
  'улучшить',
]

const genericWords = ['норм', 'круто', 'плохо', 'супер', 'ужас', 'ок', 'хорошо']

export const topicKeywords = [
  'доставка',
  'упаковка',
  'цена',
  'качество',
  'персонал',
  'обслуживание',
  'скорость',
  'приложение',
  'товар',
  'возврат',
]

function getLevel(score: number): ReviewLevel {
  if (score < 40) return 'Слабый отзыв'
  if (score < 60) return 'Средний отзыв'
  if (score < 80) return 'Полезный отзыв'
  return 'Очень полезный отзыв'
}

function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function hasRepeatingNoise(text: string, words: string[]) {
  const repeatedChars = /(.)\1{5,}/u.test(text.toLowerCase())
  const mostCommonCount = Math.max(
    0,
    ...Object.values(
      words.reduce<Record<string, number>>((acc, word) => {
        acc[word] = (acc[word] ?? 0) + 1
        return acc
      }, {}),
    ),
  )
  return repeatedChars || (words.length > 4 && mostCommonCount / words.length > 0.45)
}

export function analyzeReview(text: string): ReviewAnalysis {
  const normalized = text.trim().toLowerCase()
  const words = wordsOf(normalized)
  const charCount = normalized.length
  const uniqueWords = new Set(words)
  const matchedDetails = detailKeywords.filter((keyword) => normalized.includes(keyword))
  const matchedConstructive = constructivePhrases.filter((phrase) => normalized.includes(phrase))
  const topics = topicKeywords.filter((topic) => normalized.includes(topic))
  const genericOnly =
    words.length <= 3 && words.every((word) => genericWords.some((generic) => word.includes(generic)))
  const spammy = hasRepeatingNoise(normalized, words)

  let length = 5
  if (charCount >= 20 && charCount < 60) length = 10
  if (charCount >= 60 && charCount < 150) length = 15
  if (charCount >= 150) length = 20

  let details = Math.min(25, matchedDetails.length * 5)
  if (matchedDetails.length >= 3 && charCount > 80) details = Math.min(25, details + 5)

  let constructive = Math.min(25, matchedConstructive.length * 9)
  if (/[?]/u.test(text) || normalized.includes('но')) constructive = Math.min(25, constructive + 4)
  if (matchedDetails.length >= 2 && /лучше|полезно|хотелось|добавить|точн|исправ/u.test(normalized)) {
    constructive = Math.min(25, constructive + 6)
  }

  let clarity = 10
  if (words.length < 5) clarity = 5
  if (uniqueWords.size < Math.max(2, words.length * 0.45)) clarity -= 3
  if (spammy) clarity -= 4
  clarity = Math.max(0, Math.min(10, clarity))

  let antiSpam = 20
  if (charCount < 20) antiSpam = 8
  if (genericOnly) antiSpam = 4
  if (spammy) antiSpam = Math.min(antiSpam, 6)
  if (uniqueWords.size < Math.max(2, words.length * 0.4)) antiSpam = Math.min(antiSpam, 10)

  if (genericOnly) {
    details = Math.min(details, 3)
    constructive = Math.min(constructive, 2)
    clarity = Math.min(clarity, 5)
  }

  let score = Math.round(length + details + constructive + clarity + antiSpam)
  if (charCount < 20) score = Math.min(score, 25)
  score = Math.max(0, Math.min(100, score))

  const level = getLevel(score)
  const discount = getDiscount(score)
  const coupon = generateCoupon(score)

  let feedback = 'Добавьте конкретные детали: что произошло, где возникла проблема и что можно улучшить.'
  if (score >= 80) {
    feedback = 'Ваш отзыв содержит конкретные детали, контекст и предложение по улучшению.'
  } else if (score >= 60) {
    feedback = 'Отзыв полезный: есть детали и понятный опыт клиента. Для большего бонуса добавьте предложение по улучшению.'
  } else if (score >= 40) {
    feedback = 'Отзыв понятный, но ему не хватает конкретики, сроков, фактов или рекомендаций.'
  }

  return {
    score,
    level,
    criteria: { length, details, constructive, clarity, antiSpam },
    feedback,
    topics,
    discount,
    coupon,
    provider: 'local',
  }
}
