import { Link } from 'react-router-dom'
import { ArrowRight, Coffee, Import, QrCode, Workflow } from 'lucide-react'

export function CaseDemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
        <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
          Public case demo
        </span>
        <h1 className="mt-6 text-5xl font-black uppercase leading-none md:text-7xl">Кейс: кофейня с отзывами из 2ГИС</h1>
        <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-black/65">
          Этот сценарий показывает партнёрам полный цикл: QR-кампания, импорт репутации, AI-score, dashboard, задачи менеджера и погашение купона.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <CaseStep icon={QrCode} title="1. QR на кассе" text="Создаём кампанию для филиала и печатаем QR." to="/campaigns" />
        <CaseStep icon={Import} title="2. Импорт 2ГИС" text="Подтягиваем существующие отзывы через Apify." to="/import" />
        <CaseStep icon={Workflow} title="3. Pipeline" text="AI превращает отзывы в risk matrix и action board." to="/pipeline" />
        <CaseStep icon={Coffee} title="4. Pilot ops" text="Кассир гасит купон, менеджер закрывает задачи." to="/redeem" />
      </section>

      <section className="mt-8 rounded-[2.5rem] border-2 border-black bg-white p-6 text-black shadow-[10px_10px_0_#000]">
        <h2 className="text-4xl font-black uppercase leading-none">Что показать партнёру за 3 минуты</h2>
        <div className="mt-6 grid gap-3">
          {[
            'Открыть landing и объяснить: платим за полезность, не за позитив.',
            'Создать QR campaign для кофейни.',
            'Импортировать отзывы 2ГИС через Apify.',
            'Показать dashboard: темы, риски, action board.',
            'Создать manager tasks из pipeline.',
            'Погасить FEED10 в cashier mode.',
          ].map((item) => (
            <p key={item} className="rounded-[1.5rem] bg-[#F8F9FA] p-4 text-sm font-black">{item}</p>
          ))}
        </div>
      </section>
    </main>
  )
}

function CaseStep({ icon: Icon, title, text, to }: { icon: typeof QrCode; title: string; text: string; to: string }) {
  return (
    <Link to={to} className="rounded-[2rem] border-2 border-black bg-white p-5 text-black shadow-[7px_7px_0_#000] transition hover:-translate-y-0.5">
      <span className="grid size-12 place-items-center rounded-2xl border-2 border-black bg-[#CCFF00]">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-black uppercase">{title}</h2>
      <p className="mt-2 text-sm font-bold text-black/55">{text}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase text-[#0038FF]">
        Open
        <ArrowRight className="size-4" />
      </span>
    </Link>
  )
}
