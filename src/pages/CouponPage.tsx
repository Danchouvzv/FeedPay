import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, Home, PartyPopper } from 'lucide-react'
import { CouponCard } from '../components/CouponCard'
import type { Review } from '../types/review'
import { getReviews } from '../utils/storage'

export function CouponPage() {
  const location = useLocation()
  const [copied, setCopied] = useState(false)
  const fallbackReview = getReviews().find((review) => review.coupon)
  const review = (location.state as { review?: Review } | null)?.review ?? fallbackReview

  if (!review?.coupon) return <Navigate to="/review" replace />

  const copyCoupon = async () => {
    await navigator.clipboard.writeText(review.coupon ?? '')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <span className="grid size-16 place-items-center rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_#000]">
            <PartyPopper className="size-8 text-[#0038FF]" />
          </span>
          <p className="mt-7 text-xs font-black uppercase text-black/55">Купон выдан</p>
          <h1 className="mt-2 text-5xl font-black uppercase leading-none md:text-7xl">Отзыв полезный</h1>
          <p className="mt-5 text-base font-bold leading-7 text-black/65">
            Бизнес получил качественную обратную связь, а вы получили бонус за конструктивный вклад.
          </p>
          {copied && <p className="mt-5 rounded-full border-2 border-black bg-white px-4 py-3 text-center text-sm font-black uppercase shadow-[4px_4px_0_#000]">Промокод скопирован</p>}
        </div>

        <div>
          <CouponCard coupon={review.coupon} discount={review.discount} onCopy={copyCoupon} />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-6 py-4 text-sm font-black uppercase text-black shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5"
            >
              <Home className="size-5" />
              Главная
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5"
            >
              Dashboard
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
