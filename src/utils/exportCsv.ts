import type { Review } from '../types/review'

function escapeCsv(value: string | number | null | undefined) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

export function exportReviewsCsv(reviews: Review[]) {
  const headers = ['date', 'customer', 'product', 'rating', 'score', 'level', 'coupon', 'discount', 'topics', 'source', 'text']
  const rows = reviews.map((review) => [
    review.createdAt,
    review.customerName,
    review.productName,
    review.rating,
    review.score,
    review.level,
    review.coupon ?? '',
    review.discount,
    review.topics.join('; '),
    review.source ?? '',
    review.text,
  ])
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `feedpay-reviews-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
