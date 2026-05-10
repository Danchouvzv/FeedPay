import type { Review } from '../types/review'
import { topicKeywords } from './analyzeReview'

export type ActionItem = {
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  topic: string
  impact: number
}

export function normalizeReviewText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getDuplicateGroups(reviews: Review[]) {
  const groups = reviews.reduce<Record<string, Review[]>>((acc, review) => {
    const key = normalizeReviewText(review.text).slice(0, 140)
    if (!key) return acc
    acc[key] = acc[key] ?? []
    acc[key].push(review)
    return acc
  }, {})

  return Object.values(groups).filter((group) => group.length > 1)
}

export function getTopicHealth(reviews: Review[]) {
  return topicKeywords
    .map((topic) => {
      const related = reviews.filter((review) => review.topics.includes(topic) || review.text.toLowerCase().includes(topic))
      const avgRating = related.length ? related.reduce((sum, review) => sum + review.rating, 0) / related.length : 0
      const avgScore = related.length ? related.reduce((sum, review) => sum + review.score, 0) / related.length : 0
      const negativeCount = related.filter((review) => review.rating <= 3).length
      const risk = related.length ? Math.round((negativeCount / related.length) * 60 + Math.max(0, 5 - avgRating) * 8 + Math.max(0, 70 - avgScore) * 0.25) : 0

      return {
        topic,
        count: related.length,
        avgRating,
        avgScore,
        negativeCount,
        risk: Math.max(0, Math.min(100, risk)),
      }
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.risk - a.risk || b.count - a.count)
}

export function getActionItems(reviews: Review[]): ActionItem[] {
  return getTopicHealth(reviews)
    .slice(0, 5)
    .map((item) => {
      const priority = item.risk >= 65 ? 'High' : item.risk >= 38 ? 'Medium' : 'Low'
      const titleByTopic: Record<string, string> = {
        доставка: 'Уточнить обещания по доставке',
        упаковка: 'Проверить упаковку и контроль качества',
        цена: 'Пояснить ценность и условия цены',
        качество: 'Разобрать повторяющиеся проблемы качества',
        персонал: 'Провести быстрый coaching персонала',
        обслуживание: 'Ускорить сервисный сценарий',
        скорость: 'Сократить время ожидания',
        приложение: 'Передать UX-сигналы продуктовой команде',
        товар: 'Обновить карточки и ожидания по товару',
        возврат: 'Упростить сценарий возврата',
      }

      return {
        title: titleByTopic[item.topic] ?? `Разобрать тему: ${item.topic}`,
        description: `${item.count} отзывов, средний рейтинг ${item.avgRating.toFixed(1)}, risk score ${item.risk}/100.`,
        priority,
        topic: item.topic,
        impact: item.risk,
      }
    })
}

export function getPipelineMetrics(reviews: Review[]) {
  const duplicates = getDuplicateGroups(reviews).reduce((sum, group) => sum + group.length - 1, 0)
  const imported = reviews.filter((review) => review.source === '2gis-apify' || review.source === '2gis-import').length
  const aiReady = reviews.filter((review) => review.score >= 40).length
  const urgent = getActionItems(reviews).filter((item) => item.priority === 'High').length

  return {
    ingested: reviews.length,
    imported,
    duplicates,
    aiReady,
    urgent,
    automationRate: reviews.length ? Math.round((aiReady / reviews.length) * 100) : 0,
  }
}
