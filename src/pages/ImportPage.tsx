import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardPaste, Database, Link2, Sparkles } from 'lucide-react'
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

async function readResponsePayload(response: Response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text) as { error?: string; reviews?: Array<{ customerName: string; rating: number; text: string; date?: string | null; placeName?: string | null }> }
  } catch {
    return { error: text }
  }
}

export function ImportPage() {
  const [productName, setProductName] = useState('2ГИС импорт')
  const [placeUrl, setPlaceUrl] = useState('')
  const [maxReviews, setMaxReviews] = useState(50)
  const [rawText, setRawText] = useState(sample)
  const [isImporting, setIsImporting] = useState(false)
  const [isScraping, setIsScraping] = useState(false)
  const [error, setError] = useState('')
  const [importedCount, setImportedCount] = useState(0)
  const parsed = useMemo(() => parse2gisReviews(rawText), [rawText])

  const analyzeAndSave = async (
    reviews: Array<{ customerName: string; rating: number; text: string; date?: string | null; placeName?: string | null }>,
    source: '2gis-import' | '2gis-apify',
  ) => {
    if (!productName.trim() || reviews.length === 0) return 0

    const analyzedReviews: Review[] = []

    for (const parsedReview of reviews) {
      const analysis = await analyzeReviewWithAI(parsedReview.text)
      analyzedReviews.push({
        id: crypto.randomUUID(),
        customerName: parsedReview.customerName,
        productName: parsedReview.placeName?.trim() || productName.trim(),
        rating: parsedReview.rating,
        text: parsedReview.text,
        score: analysis.score,
        level: analysis.level,
        coupon: analysis.coupon,
        discount: analysis.discount,
        criteria: analysis.criteria,
        topics: analysis.topics,
        createdAt: parsedReview.date ? new Date(parsedReview.date).toISOString() : new Date().toISOString(),
        source,
      })
    }

    saveImportedReviews(analyzedReviews)
    setImportedCount(analyzedReviews.length)
    return analyzedReviews.length
  }

  const importReviews = async () => {
    if (!productName.trim() || parsed.length === 0) return

    setIsImporting(true)
    setError('')
    await analyzeAndSave(parsed, '2gis-import')
    setIsImporting(false)
  }

  const scrapeWithApify = async () => {
    if (!placeUrl.trim()) return

    setIsScraping(true)
    setError('')

    try {
      const response = await fetch('/api/import/2gis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: placeUrl.trim(), maxReviews }),
      })

      const payload = await readResponsePayload(response)
      if (!response.ok) throw new Error(payload?.error ?? 'FeedPay API недоступен. Запустите проект через npm run dev:full.')
      if (!payload?.reviews?.length) throw new Error('Apify не вернул отзывы по этой ссылке. Проверьте URL 2ГИС или увеличьте лимит отзывов.')

      await analyzeAndSave(payload.reviews, '2gis-apify')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не удалось импортировать через Apify')
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
            2ГИС importer
          </span>
          <h1 className="mt-7 text-5xl font-black uppercase leading-none md:text-7xl">Импорт 2ГИС</h1>
          <p className="mt-5 text-base font-bold leading-7 text-black/65">
            Вставьте ссылку заведения 2ГИС и запустите Apify scraper или скопируйте отзывы текстом. FeedPay поставит AI-score и добавит всё в dashboard.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              ['Apify scraper', 'Запускаем Actor zen-studio/2gis-places-scraper-api на backend'],
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

            <div className="rounded-[1.5rem] border-2 border-black bg-[#CCFF00] p-4">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full border-2 border-black bg-white">
                  <Link2 className="size-5" />
                </span>
                <div>
                  <p className="font-black uppercase">Парсинг по ссылке 2ГИС</p>
                  <p className="text-sm font-bold text-black/55">Нужен `APIFY_TOKEN` в `.env`. Actor вернёт place + reviews.</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_120px]">
                <input
                  className="rounded-[1.35rem] border-2 border-black bg-white px-4 py-3 font-bold outline-none transition focus:shadow-[5px_5px_0_#000]"
                  value={placeUrl}
                  onChange={(event) => setPlaceUrl(event.target.value)}
                  placeholder="https://2gis.ru/.../firm/..."
                />
                <input
                  className="rounded-[1.35rem] border-2 border-black bg-white px-4 py-3 font-bold outline-none transition focus:shadow-[5px_5px_0_#000]"
                  type="number"
                  min={1}
                  max={500}
                  value={maxReviews}
                  onChange={(event) => setMaxReviews(Number(event.target.value))}
                  aria-label="Максимум отзывов"
                />
              </div>
              <button
                type="button"
                onClick={scrapeWithApify}
                disabled={isScraping || !placeUrl.trim()}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isScraping ? 'Apify парсит 2ГИС...' : 'Запустить Apify scraper'}
                <Sparkles className="size-5" />
              </button>
            </div>

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

            {error && <p className="rounded-[1.5rem] border-2 border-black bg-rose-100 p-4 text-sm font-black text-rose-800">{error}</p>}

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
