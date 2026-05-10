import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardPaste, Database, Sparkles } from 'lucide-react'
import type { Review } from '../types/review'
import { analyzeReviewWithAI } from '../utils/aiAnalysis'
import { parse2gisReviews } from '../utils/parse2gisReviews'
import { saveImportedReviews } from '../utils/storage'

const sample = `Алия
★★★★★
Товар пришёл быстро, упаковка была целой, качество хорошее, но цвет немного отличался от фото. Было бы полезно добавить реальные фотографии товара на сайт.

Марат
3 из 5
Заказ ждал 35 минут, хотя в приложении было указано 15 минут. Персонал был вежливый, но хотелось бы видеть более точное время ожидания.`

export function ImportPage() {
  const [productName, setProductName] = useState('2ГИС импорт')
  const [rawText, setRawText] = useState(sample)
  const [isImporting, setIsImporting] = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  const parsed = useMemo(() => parse2gisReviews(rawText), [rawText])

  const importReviews = async () => {
    if (!productName.trim() || parsed.length === 0) return

    setIsImporting(true)
    const analyzedReviews: Review[] = []

    for (const parsedReview of parsed) {
      const analysis = await analyzeReviewWithAI(parsedReview.text)
      analyzedReviews.push({
        id: crypto.randomUUID(),
        customerName: parsedReview.customerName,
        productName: productName.trim(),
        rating: parsedReview.rating,
        text: parsedReview.text,
        score: analysis.score,
        level: analysis.level,
        coupon: analysis.coupon,
        discount: analysis.discount,
        criteria: analysis.criteria,
        topics: analysis.topics,
        createdAt: new Date().toISOString(),
        source: '2gis-import',
      })
    }

    saveImportedReviews(analyzedReviews)
    setImportedCount(analyzedReviews.length)
    setIsImporting(false)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
            2ГИС importer
          </span>
          <h1 className="mt-7 text-5xl font-black uppercase leading-none md:text-7xl">Вставь отзывы сюда</h1>
          <p className="mt-5 text-base font-bold leading-7 text-black/65">
            Скопируйте отзывы из 2ГИС и вставьте текстом. FeedPay распарсит блоки, поставит rating, запустит AI-score и добавит всё в dashboard.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              ['Безопаснее скрейпинга', 'Не обходим CORS и не зависим от HTML 2ГИС'],
              ['AI оценка', 'Каждый импортированный отзыв проходит тот же scoring'],
              ['Dashboard ready', 'Темы, купоны и статистика появляются сразу'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[1.5rem] bg-white p-4">
                <p className="font-black uppercase">{title}</p>
                <p className="text-sm font-semibold text-black/55">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border-2 border-black bg-white p-5 text-black shadow-[10px_10px_0_#000] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-black/45">Paste parser</p>
              <h2 className="mt-1 text-3xl font-black uppercase leading-none">Импорт отзывов</h2>
            </div>
            <span className="grid size-14 place-items-center rounded-2xl bg-[#0038FF] text-white">
              <ClipboardPaste className="size-7" />
            </span>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black uppercase">Товар, услуга или филиал</span>
              <input
                className="rounded-[1.35rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold outline-none transition focus:bg-white focus:shadow-[5px_5px_0_#000]"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="Например: кофейня на Абая"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black uppercase">Отзывы из 2ГИС</span>
              <textarea
                className="min-h-72 resize-y rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold leading-7 outline-none transition focus:bg-white focus:shadow-[5px_5px_0_#000]"
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                placeholder="Вставьте сюда несколько отзывов, разделяя их пустой строкой"
              />
            </label>

            <div className="rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black uppercase">Найдено отзывов</span>
                <span className="rounded-full bg-[#CCFF00] px-3 py-1 text-sm font-black">{parsed.length}</span>
              </div>
              <div className="mt-3 grid gap-2">
                {parsed.slice(0, 3).map((review, index) => (
                  <p key={`${review.customerName}-${index}`} className="truncate text-sm font-bold text-black/60">
                    {review.customerName} · {review.rating}/5 · {review.text}
                  </p>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={importReviews}
              disabled={isImporting || parsed.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {isImporting ? 'AI анализирует импорт...' : 'Импортировать в dashboard'}
              <Sparkles className="size-5" />
            </button>

            {importedCount > 0 && (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#CCFF00] px-6 py-4 text-sm font-black uppercase text-black shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5"
              >
                {importedCount} отзывов добавлено
                <ArrowRight className="size-5" />
              </Link>
            )}

            <div className="flex items-center gap-2 text-xs font-bold text-black/45">
              <Database className="size-4" />
              Данные сохраняются в localStorage текущего браузера.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
