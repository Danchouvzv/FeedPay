import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, Gift, MessageSquareText, RefreshCcw, Star, Target, Trash2, TrendingUp } from 'lucide-react'
import { ReviewCard } from '../components/ReviewCard'
import { StatCard } from '../components/StatCard'
import { clearReviews, getReviews, resetDemoReviews } from '../utils/storage'
import { topicKeywords } from '../utils/analyzeReview'
import { getActionItems, getDuplicateGroups, getPipelineMetrics } from '../utils/intelligence'
import type { ReviewLevel } from '../types/review'

const levelOrder: ReviewLevel[] = ['Слабый отзыв', 'Средний отзыв', 'Полезный отзыв', 'Очень полезный отзыв']

export function DashboardPage() {
  const [reviews, setReviews] = useState(() => getReviews())

  const stats = useMemo(() => {
    const total = reviews.length
    const avgRating = total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0
    const avgScore = total ? reviews.reduce((sum, review) => sum + review.score, 0) / total : 0
    const coupons = reviews.filter((review) => review.coupon).length
    return { total, avgRating, avgScore, coupons }
  }, [reviews])

  const levelData = levelOrder.map((level) => ({
    name: level.replace(' отзыв', ''),
    value: reviews.filter((review) => review.level === level).length,
  }))

  const dayData = Object.values(
    reviews.reduce<Record<string, { date: string; count: number }>>((acc, review) => {
      const date = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(review.createdAt))
      acc[date] = acc[date] ?? { date, count: 0 }
      acc[date].count += 1
      return acc
    }, {}),
  ).reverse()

  const topicData = topicKeywords
    .map((topic) => ({
      topic,
      count: reviews.filter((review) => review.topics.includes(topic) || review.text.toLowerCase().includes(topic)).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
  const actions = getActionItems(reviews)
  const duplicateGroups = getDuplicateGroups(reviews)
  const pipelineMetrics = getPipelineMetrics(reviews)

  const refreshDemo = () => {
    resetDemoReviews()
    setReviews(getReviews())
  }

  const clear = () => {
    clearReviews()
    setReviews([])
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
              Business dashboard
            </span>
            <h1 className="mt-6 text-5xl font-black uppercase leading-none md:text-7xl">Отзывы, купоны и темы</h1>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-black/65">
              Панель показывает, насколько отзывы полезны, какие бонусы выданы и какие темы чаще всего повторяются.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={refreshDemo}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-5 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5"
            >
              <RefreshCcw className="size-4" />
              Demo reviews
            </button>
            <Link
              to="/import"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-5 py-4 text-sm font-black uppercase text-black shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5"
            >
              Import 2ГИС
            </Link>
            <Link
              to="/pipeline"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-5 py-4 text-sm font-black uppercase text-black shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5"
            >
              Pipeline
            </Link>
            <button
              onClick={clear}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-5 py-4 text-sm font-black uppercase text-black shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5"
            >
              <Trash2 className="size-4" />
              Clear data
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Всего отзывов" value={stats.total} caption="С учётом demo и новых отзывов" icon={MessageSquareText} />
        <StatCard title="Средний рейтинг" value={stats.avgRating.toFixed(1)} caption="Оценка клиентов от 1 до 5" icon={Star} />
        <StatCard title="Средняя полезность" value={`${Math.round(stats.avgScore)}/100`} caption="Качество обратной связи" icon={Target} />
        <StatCard title="Выдано купонов" value={stats.coupons} caption="FEED3, FEED5 и FEED10" icon={Gift} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2.5rem] border-2 border-black bg-white p-5 text-black shadow-[10px_10px_0_#000]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-black/45">AI action board</p>
              <h2 className="mt-1 text-2xl font-black uppercase">Что чинить первым</h2>
            </div>
            <Link to="/pipeline" className="rounded-full bg-[#0038FF] px-4 py-2 text-xs font-black uppercase text-white">
              full pipeline
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {actions.length ? (
              actions.slice(0, 3).map((item) => (
                <div key={item.topic} className="rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-black uppercase">{item.title}</h3>
                    <span className="rounded-full bg-[#CCFF00] px-3 py-1 text-xs font-black">{item.priority}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-black/55">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="rounded-[1.5rem] bg-[#F8F9FA] p-4 text-sm font-bold text-black/55">Action items появятся после отзывов.</p>
            )}
          </div>
        </article>

        <article className="rounded-[2.5rem] border-2 border-black bg-[#0038FF] p-5 text-white shadow-[10px_10px_0_#000]">
          <p className="text-xs font-black uppercase text-white/50">Pipeline health</p>
          <h2 className="mt-1 text-2xl font-black uppercase">Automation loop</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniMetric label="AI ready" value={`${pipelineMetrics.automationRate}%`} />
            <MiniMetric label="Imported" value={pipelineMetrics.imported} />
            <MiniMetric label="Duplicates" value={duplicateGroups.length} />
            <MiniMetric label="Urgent" value={pipelineMetrics.urgent} />
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <ChartCard title="Распределение полезности" icon={BarChart3}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={levelData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000022" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#111' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#111' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0038FF" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Отзывы по дням" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dayData.length ? dayData : [{ date: 'Сегодня', count: 0 }]}>
              <defs>
                <linearGradient id="reviewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0038FF" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#0038FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000022" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fontWeight: 700, fill: '#111' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#111' }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#0038FF" fill="url(#reviewsGradient)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[2.5rem] border-2 border-black bg-white p-5 text-black shadow-[10px_10px_0_#000]">
          <h2 className="text-2xl font-black uppercase">Частые темы</h2>
          <div className="mt-5 space-y-3">
            {topicData.length ? (
              topicData.map((item) => (
                <div key={item.topic} className="flex items-center justify-between rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] px-4 py-3">
                  <span className="font-black uppercase">{item.topic}</span>
                  <span className="rounded-full bg-[#CCFF00] px-3 py-1 text-sm font-black text-black">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="rounded-[1.5rem] bg-[#F8F9FA] p-4 text-sm font-bold text-black/55">Тем пока нет. Добавьте demo reviews или новый отзыв.</p>
            )}
          </div>
        </article>

        <article>
          <div className="mb-4 flex items-center justify-between rounded-full border border-white/35 bg-white/15 px-5 py-3 text-white backdrop-blur">
            <h2 className="text-xl font-black uppercase">Последние отзывы</h2>
            <span className="text-sm font-black">{reviews.length} записей</span>
          </div>
          <div className="grid gap-4">
            {reviews.length ? reviews.map((review) => <ReviewCard key={review.id} review={review} />) : <EmptyDashboard />}
          </div>
        </article>
      </section>
    </main>
  )
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/25 bg-white/10 p-4">
      <p className="text-xs font-black uppercase text-white/50">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  )
}

function ChartCard({ title, icon: Icon, children }: { title: string; icon: typeof BarChart3; children: React.ReactNode }) {
  return (
    <article className="rounded-[2.5rem] border-2 border-black bg-white p-5 text-black shadow-[10px_10px_0_#000]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase">{title}</h2>
        <span className="grid size-11 place-items-center rounded-2xl border-2 border-black bg-[#CCFF00]">
          <Icon className="size-5" />
        </span>
      </div>
      <div className="mt-5 h-72">{children}</div>
    </article>
  )
}

function EmptyDashboard() {
  return (
    <div className="rounded-[2.5rem] border-2 border-dashed border-black bg-white p-8 text-center text-black shadow-[7px_7px_0_#000]">
      <p className="text-lg font-black uppercase">Данных пока нет</p>
      <p className="mt-2 text-sm font-bold text-black/55">Нажмите “Demo reviews” или оставьте первый отзыв через форму.</p>
    </div>
  )
}
