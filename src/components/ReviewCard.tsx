import { Star } from 'lucide-react'
import type { Review } from '../types/review'
import { formatDate } from '../utils/format'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-[2rem] border-2 border-black bg-white p-5 text-black shadow-[7px_7px_0_#000]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black uppercase">{review.customerName}</h3>
            <span className="text-sm font-black text-black/30">/</span>
            <span className="text-sm font-bold text-black/60">{review.productName}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-black">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className={`size-4 ${index < review.rating ? 'fill-[#CCFF00] text-black' : 'text-black/20'}`} />
            ))}
            <span className="ml-2 text-sm font-bold text-black/45">{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border-2 border-black bg-[#CCFF00] px-3 py-1 text-xs font-black uppercase text-black">
          {review.score}/100
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-black/70">{review.text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {review.topics.map((topic) => (
          <span key={topic} className="rounded-full bg-[#F8F9FA] px-3 py-1 text-xs font-black uppercase text-black/60">
            {topic}
          </span>
        ))}
        {review.coupon && (
          <span className="rounded-full bg-[#0038FF] px-3 py-1 text-xs font-black uppercase text-white">
            {review.coupon} · {review.discount}%
          </span>
        )}
      </div>
    </article>
  )
}
