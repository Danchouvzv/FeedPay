import type { ReviewLevel } from '../types/review'

const styles: Record<ReviewLevel, string> = {
  'Слабый отзыв': 'bg-rose-50 text-rose-700 ring-rose-200',
  'Средний отзыв': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Полезный отзыв': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Очень полезный отзыв': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export function ScoreBadge({ score, level }: { score: number; level: ReviewLevel }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles[level]}`}>
      {score}/100 · {level}
    </span>
  )
}
