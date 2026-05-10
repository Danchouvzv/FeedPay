import { Link } from 'react-router-dom'
import { ArrowRight, BrainCircuit, DatabaseZap, Filter, GitBranch, ShieldCheck, Sparkles, Target, Workflow } from 'lucide-react'
import { getReviews } from '../utils/storage'
import { getActionItems, getPipelineMetrics, getTopicHealth } from '../utils/intelligence'

const stages = [
  {
    icon: DatabaseZap,
    title: 'Ingest',
    text: 'Отзывы приходят из формы, ручного импорта, 2ГИС через Apify или будущих CRM/webhook источников.',
  },
  {
    icon: Filter,
    title: 'Normalize',
    text: 'FeedPay приводит автора, рейтинг, дату, источник, текст и филиал к единой структуре Review.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust layer',
    text: 'Дедупликация, антиспам, короткие отзывы и повторяющийся шум отделяются от полезной обратной связи.',
  },
  {
    icon: BrainCircuit,
    title: 'AI score',
    text: 'OpenAI или локальный fallback оценивают полезность, конкретику, конструктивность и темы.',
  },
  {
    icon: Target,
    title: 'Action routing',
    text: 'Темы превращаются в приоритетные бизнес-задачи: доставка, упаковка, сервис, возврат, приложение.',
  },
  {
    icon: GitBranch,
    title: 'Growth loop',
    text: 'Клиент получает купон, бизнес получает action board, а следующие отзывы становятся качественнее.',
  },
]

export function PipelinePage() {
  const reviews = getReviews()
  const metrics = getPipelineMetrics(reviews)
  const actions = getActionItems(reviews)
  const health = getTopicHealth(reviews)

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
              FeedPay Intelligence Engine
            </span>
            <h1 className="mt-6 text-5xl font-black uppercase leading-none md:text-7xl">Pipeline, который превращает отзывы в решения</h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-black/65">
              Это технический слой продукта: импорт, нормализация, trust scoring, AI-анализ, приоритизация проблем и action board для бизнеса.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Ingested" value={metrics.ingested} />
            <Metric label="Imported" value={metrics.imported} />
            <Metric label="AI ready" value={`${metrics.automationRate}%`} />
            <Metric label="Urgent" value={metrics.urgent} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map((stage, index) => (
          <article key={stage.title} className="rounded-[2rem] border-2 border-black bg-white p-5 text-black shadow-[7px_7px_0_#000]">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-12 place-items-center rounded-2xl border-2 border-black bg-[#CCFF00]">
                <stage.icon className="size-6" />
              </span>
              <span className="rounded-full bg-[#0038FF] px-3 py-1 text-xs font-black text-white">0{index + 1}</span>
            </div>
            <h2 className="mt-5 text-2xl font-black uppercase">{stage.title}</h2>
            <p className="mt-3 text-sm font-bold leading-6 text-black/60">{stage.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2.5rem] border-2 border-black bg-white p-6 text-black shadow-[10px_10px_0_#000]">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase">Priority action board</h2>
            <Workflow className="size-8 text-[#0038FF]" />
          </div>
          <div className="mt-6 grid gap-4">
            {actions.length ? (
              actions.map((item) => (
                <div key={item.topic} className="rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-black uppercase">{item.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${item.priority === 'High' ? 'bg-[#0038FF] text-white' : item.priority === 'Medium' ? 'bg-[#CCFF00] text-black' : 'bg-white text-black'}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-black/60">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="rounded-[1.5rem] bg-[#F8F9FA] p-4 text-sm font-bold text-black/55">Пока нет сигналов. Импортируйте отзывы или добавьте demo data.</p>
            )}
          </div>
        </article>

        <article className="rounded-[2.5rem] border-2 border-black bg-[#0038FF] p-6 text-white shadow-[10px_10px_0_#000]">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase">Topic risk matrix</h2>
            <Sparkles className="size-8 text-[#CCFF00]" />
          </div>
          <div className="mt-6 grid gap-4">
            {health.length ? (
              health.slice(0, 6).map((item) => (
                <div key={item.topic}>
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase">
                    <span>{item.topic}</span>
                    <span>{item.risk}/100</span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-[#CCFF00]" style={{ width: `${item.risk}%` }} />
                  </div>
                  <p className="mt-1 text-xs font-bold text-white/55">
                    {item.count} отзывов · рейтинг {item.avgRating.toFixed(1)} · score {Math.round(item.avgScore)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-[1.5rem] bg-white/10 p-4 text-sm font-bold text-white/65">Матрица появится после первых отзывов.</p>
            )}
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-[2.5rem] border-2 border-black bg-white p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">Почему это удобно бизнесу</h2>
            <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-black/60 md:text-base">
              Владелец не читает сотни отзывов вручную. FeedPay показывает, где болит, насколько это критично, какие темы растут, и какие действия дадут эффект быстрее всего.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to="/import" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#CCFF00] px-7 py-4 text-sm font-black uppercase text-black shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5">
              Импортировать отзывы
              <ArrowRight className="size-5" />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-7 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5">
              Смотреть dashboard
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border-2 border-black bg-white p-4 shadow-[5px_5px_0_#000]">
      <p className="text-xs font-black uppercase text-black/45">{label}</p>
      <p className="mt-1 text-4xl font-black">{value}</p>
    </div>
  )
}
