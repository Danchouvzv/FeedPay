import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Gift, PencilLine, Sparkles } from 'lucide-react'
import type { Review } from '../types/review'
import { ProgressBar } from '../components/ProgressBar'
import { getReviews } from '../utils/storage'

export function AnalysisPage() {
  const location = useLocation()
  const review = (location.state as { review?: Review } | null)?.review ?? getReviews()[0]

  if (!review) return <Navigate to="/review" replace />

  const criteria = [
    ['Длина отзыва', review.criteria.length, 20],
    ['Конкретика и детали', review.criteria.details, 25],
    ['Конструктивность', review.criteria.constructive, 25],
    ['Понятность', review.criteria.clarity, 10],
    ['Антиспам', review.criteria.antiSpam, 20],
  ] as const

  const feedback =
    review.score >= 80
      ? 'Ваш отзыв содержит конкретные детали и предложение по улучшению.'
      : review.score >= 60
        ? 'Ваш отзыв полезен для бизнеса: он даёт контекст и понятный опыт клиента.'
        : review.score >= 40
          ? 'Ваш отзыв принят, но следующий бонус может быть выше при большей детализации.'
          : 'Отзыв слишком короткий или общий. Добавьте факты, детали и предложение.'

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <Link to="/review" className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 px-4 py-2 text-sm font-black uppercase text-white transition hover:bg-white hover:text-[#0038FF]">
        <ArrowLeft className="size-4" />
        К форме отзыва
      </Link>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-black/55">Результат AI-анализа</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-8xl font-black leading-none">{review.score}</span>
                <span className="pb-3 text-2xl font-black text-black/55">/100</span>
              </div>
            </div>
            <span className="grid size-14 place-items-center rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_#000]">
              <Sparkles className="size-7 text-[#0038FF]" />
            </span>
          </div>
          <div className="mt-6 inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0_#000]">
            {review.level}
          </div>
          <p className="mt-6 text-base font-bold leading-7 text-black/70">{feedback}</p>
          <div className="mt-7 rounded-[2rem] border-2 border-black bg-white p-5">
            <p className="text-xs font-black uppercase text-black/45">Бонус</p>
            <p className="mt-2 text-4xl font-black">{review.coupon ? `-${review.discount}%` : '0%'}</p>
            <p className="mt-2 text-sm font-bold text-black/60">{review.coupon ? `Купон ${review.coupon} готов` : 'Бонус не выдан'}</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] border-2 border-black bg-white p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <p className="text-xs font-black uppercase text-black/45">Score breakdown</p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-none">Разбор по критериям</h1>
          <p className="mt-4 text-sm font-bold leading-6 text-black/60">Оценка выполняется локально и мгновенно: без внешнего API и ожидания backend.</p>
          <div className="mt-7 grid gap-5">
            {criteria.map(([label, value, max]) => (
              <ProgressBar key={label} label={label} value={value} max={max} />
            ))}
          </div>
          <div className="mt-7 rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] p-5 text-sm font-bold leading-6 text-black/65">
            {review.score >= 80
              ? 'Отзыв даёт бизнесу факты, контекст и направление для улучшений.'
              : review.score >= 40
                ? 'Для более высокого балла добавьте конкретные примеры, сроки, проблему и рекомендацию.'
                : 'Сейчас отзыв похож на короткую реакцию. Напишите, что именно понравилось или не понравилось и почему.'}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {review.coupon ? (
              <Link
                to="/coupon"
                state={{ review }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5"
              >
                Получить купон
                <Gift className="size-5" />
              </Link>
            ) : (
              <Link
                to="/review"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-black bg-[#CCFF00] px-6 py-4 text-sm font-black uppercase text-black shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5"
              >
                Улучшить отзыв
                <PencilLine className="size-5" />
              </Link>
            )}
            <Link to="/dashboard" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-6 py-4 text-sm font-black uppercase text-black shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5">
              Dashboard
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
