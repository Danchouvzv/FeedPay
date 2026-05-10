import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Clock3, MessageSquareText, Sparkles, Star } from 'lucide-react'
import { analyzeReview } from '../utils/analyzeReview'
import { saveReview } from '../utils/storage'
import type { Review } from '../types/review'

type FormErrors = Partial<Record<'customerName' | 'productName' | 'text', string>>

export function ReviewPage() {
  const navigate = useNavigate()
  const [customerName, setCustomerName] = useState('')
  const [productName, setProductName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!customerName.trim()) nextErrors.customerName = 'Введите имя клиента'
    if (!productName.trim()) nextErrors.productName = 'Введите название товара или услуги'
    if (!text.trim()) nextErrors.text = 'Напишите отзыв'
    else if (text.trim().length < 20) nextErrors.text = 'Добавьте больше деталей, чтобы получить бонус'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    const analysis = analyzeReview(text)
    const review: Review = {
      id: crypto.randomUUID(),
      customerName: customerName.trim(),
      productName: productName.trim(),
      rating,
      text: text.trim(),
      score: analysis.score,
      level: analysis.level,
      coupon: analysis.coupon,
      discount: analysis.discount,
      criteria: analysis.criteria,
      topics: analysis.topics,
      createdAt: new Date().toISOString(),
    }

    saveReview(review)
    navigate('/analysis', { state: { review } })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
            Review station
          </span>
          <h1 className="mt-7 text-5xl font-black uppercase leading-none md:text-7xl">Оставь отзыв. Получи бонус.</h1>
          <p className="mt-5 text-base font-bold leading-7 text-black/65">
            FeedPay ценит конкретику: доставка, упаковка, качество, время, проблема и предложение. Чем полезнее отзыв, тем выше купон.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              [MessageSquareText, 'Подробный текст', 'Не одно слово, а реальный опыт клиента'],
              [Clock3, 'Анализ до 5 секунд', 'Алгоритм работает локально без API'],
              [Sparkles, 'Авто-купон', 'FEED3, FEED5 или FEED10 по score'],
            ].map(([Icon, title, caption]) => {
              const CardIcon = Icon as typeof Sparkles
              return (
                <div key={title as string} className="flex items-center gap-3 rounded-[1.5rem] bg-white p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#0038FF] text-white">
                    <CardIcon className="size-5" />
                  </span>
                  <div>
                    <p className="font-black uppercase">{title as string}</p>
                    <p className="text-sm font-semibold text-black/55">{caption as string}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2.5rem] border-2 border-black bg-white p-5 text-black shadow-[10px_10px_0_#000] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-black/45">AI feedback form</p>
              <h2 className="mt-1 text-3xl font-black uppercase leading-none">Детали покупки</h2>
            </div>
            <span className="grid size-14 place-items-center rounded-2xl bg-[#0038FF] text-white">
              <Sparkles className="size-7" />
            </span>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black uppercase text-black">Имя клиента</span>
              <input
                className="rounded-[1.35rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold outline-none transition focus:bg-white focus:shadow-[5px_5px_0_#000]"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Например: Алия"
              />
              {errors.customerName && <ErrorText text={errors.customerName} />}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black uppercase text-black">Название товара или услуги</span>
              <input
                className="rounded-[1.35rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold outline-none transition focus:bg-white focus:shadow-[5px_5px_0_#000]"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="Например: доставка ужина"
              />
              {errors.productName && <ErrorText text={errors.productName} />}
            </label>

            <div>
              <span className="text-sm font-black uppercase text-black">Оценка</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`grid size-12 place-items-center rounded-2xl border-2 border-black transition hover:-translate-y-0.5 ${
                        value <= rating ? 'bg-[#CCFF00] shadow-[4px_4px_0_#000]' : 'bg-white'
                      }`}
                      aria-label={`${value} звезд`}
                    >
                      <Star className={`size-6 ${value <= rating ? 'fill-black text-black' : 'text-black/25'}`} />
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-black uppercase text-black">Текст отзыва</span>
              <textarea
                className="min-h-48 resize-y rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold leading-7 outline-none transition focus:bg-white focus:shadow-[5px_5px_0_#000]"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Например: доставка была быстрой, упаковка целая, но товар немного отличался по цвету от фото…"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
                <span className={text.trim().length < 20 ? 'text-amber-700' : 'text-black/55'}>
                  {text.trim().length < 20 ? 'Добавьте больше деталей, чтобы получить бонус' : `${text.trim().length} символов`}
                </span>
                <span className="text-black/45">AI-анализ без внешнего API</span>
              </div>
              {errors.text && <ErrorText text={errors.text} />}
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#000]"
            >
              Проверить отзыв
              <ArrowRight className="size-5" strokeWidth={4} />
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

function ErrorText({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-black text-rose-700">
      <AlertCircle className="size-4" />
      {text}
    </span>
  )
}
