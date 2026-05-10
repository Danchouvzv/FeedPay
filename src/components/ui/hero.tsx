import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Gift,
  MessageSquareText,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react'

const ArrowGreenLeft = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-[#CCFF00] stroke-current"
    fill="none"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
)

const ArrowGreenRight = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-[#CCFF00] stroke-current"
    fill="none"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
)

const ArrowBlack = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-black stroke-current"
    fill="none"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
)

const CircularBadge = () => (
  <Link
    to="/review"
    className="relative flex size-28 rotate-12 cursor-pointer items-center justify-center rounded-full border-[3px] border-black/5 bg-[#CCFF00] shadow-xl transition-transform hover:scale-105 md:size-36"
  >
    <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path id="feedpayCirclePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
        <text className="text-[10px] font-black uppercase tracking-[0.18em]" fill="black">
          <textPath href="#feedpayCirclePath" startOffset="0%">
            ОСТАВИТЬ ОТЗЫВ • ПОЛУЧИТЬ БОНУС •
          </textPath>
        </text>
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <Gift className="size-10 text-black" strokeWidth={3.5} />
    </div>
  </Link>
)

const FloatingReviewCard = ({
  className,
  delay = 0,
  rotate,
  name,
  product,
  score,
  coupon,
}: {
  className: string
  delay?: number
  rotate: string
  name: string
  product: string
  score: string
  coupon: string
}) => (
  <motion.div
    animate={{ y: [0, -18, 0] }}
    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay }}
    className={`absolute z-30 pointer-events-auto ${className}`}
  >
    <div
      className={`flex aspect-[3/3.45] w-40 flex-col justify-between rounded-[2rem] border border-white/40 bg-white/20 p-5 text-white shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 md:w-52 ${rotate}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#CCFF00] px-2.5 py-1 text-[10px] font-black text-black">{score}</span>
          <MessageSquareText className="size-5 text-white/80" />
        </div>
        <p className="mt-5 text-sm font-black md:text-lg">{name}</p>
        <p className="mt-1 text-[10px] font-semibold text-white/75 md:text-xs">{product}</p>
      </div>
      <div className="rounded-2xl bg-white p-3 text-black">
        <p className="text-[10px] font-black uppercase text-black/50">Купон</p>
        <p className="text-xl font-black">{coupon}</p>
      </div>
    </div>
  </motion.div>
)

const FeaturePill = ({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) => (
  <div className="rounded-[2rem] border border-gray-100 bg-[#F8F9FA] p-7 text-center">
    <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#0038FF] text-white shadow-lg">
      <Icon className="size-7" />
    </div>
    <h3 className="mt-5 text-xl font-black uppercase leading-tight md:text-2xl">{title}</h3>
    <p className="mt-3 text-xs font-bold leading-5 text-black/60">{text}</p>
  </div>
)

const SectionEyebrow = ({ children }: { children: string }) => (
  <span className="inline-flex rounded-full border-2 border-black bg-[#CCFF00] px-4 py-2 text-xs font-black uppercase text-black shadow-[4px_4px_0_#000]">
    {children}
  </span>
)

const ReviewMiniCard = ({ score, title, text }: { score: string; title: string; text: string }) => (
  <div className="rounded-[2rem] border-2 border-black bg-white p-5 shadow-[8px_8px_0_#000]">
    <div className="flex items-center justify-between gap-3">
      <span className="rounded-full bg-[#0038FF] px-3 py-1 text-xs font-black text-white">{score}</span>
      <span className="rounded-full bg-[#CCFF00] px-3 py-1 text-xs font-black text-black">LIVE</span>
    </div>
    <h3 className="mt-5 text-xl font-black uppercase leading-tight">{title}</h3>
    <p className="mt-3 text-sm font-semibold leading-6 text-black/60">{text}</p>
  </div>
)

const ScoreRow = ({ label, value, max }: { label: string; value: number; max: number }) => (
  <div>
    <div className="mb-2 flex items-center justify-between text-xs font-black uppercase">
      <span>{label}</span>
      <span>
        {value}/{max}
      </span>
    </div>
    <div className="h-3 overflow-hidden rounded-full bg-black/10">
      <div className="h-full rounded-full bg-[#0038FF]" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  </div>
)

const CouponStep = ({ code, discount, label }: { code: string; discount: string; label: string }) => (
  <div className="relative rounded-[2rem] border-2 border-black bg-[#CCFF00] p-5 text-black shadow-[7px_7px_0_#000]">
    <p className="text-xs font-black uppercase text-black/55">{label}</p>
    <p className="mt-2 text-4xl font-black">{discount}</p>
    <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-center text-xl font-black">{code}</p>
  </div>
)

export const Component = () => {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0038FF] font-sans text-white selection:bg-[#CCFF00] selection:text-black">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <nav className="fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-full border border-white/35 bg-white/15 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl md:top-5 md:w-[calc(100%-3rem)]">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex min-w-0 items-center gap-1 rounded-full bg-white p-1 pr-3 shadow-lg">
            <div className="relative rounded-full bg-[#0038FF] px-3 py-2 text-xs font-black text-white md:text-sm">FEED</div>
            <div className="rounded-full border-2 border-black bg-[#CCFF00] px-3 py-2 text-xs font-black text-black md:text-sm">PAY</div>
          </Link>

          <div className="hidden items-center rounded-full border border-white/25 bg-[#002AD0]/70 p-1 md:flex">
            {[
              ['Как работает', '#how-it-works'],
              ['Score', '#score-engine'],
              ['Купоны', '#coupons'],
              ['Dashboard', '#dashboard-preview'],
            ].map(([item, href]) => (
              <a
                key={item}
                href={href}
                className="rounded-full px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#0038FF]"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden rounded-full border border-white/35 px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-white hover:text-[#0038FF] sm:inline-flex"
            >
              Dashboard
            </Link>
            <Link
              to="/review"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#CCFF00] px-4 py-3 text-xs font-black uppercase text-black shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] md:px-5"
            >
              Отзыв
              <ArrowRight className="size-4" strokeWidth={4} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-4 pb-28 pt-32 md:pb-44 md:pt-40">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {['AI-анализ до 5 секунд', 'localStorage MVP', 'купоны автоматически'].map((item) => (
            <span key={item} className="rounded-full border border-white/35 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
              {item}
            </span>
          ))}
        </div>

        <div className="relative z-10 mx-auto mb-16 mt-2 flex w-full max-w-6xl flex-col items-center justify-center text-center">
          <div className="relative z-10 flex w-full flex-col items-center space-y-2 md:space-y-4">
            <div className="relative z-30 flex w-full justify-start pl-[6%] md:pl-[18%]">
              <h1
                className="m-0 p-0 text-[clamp(4rem,12vw,160px)] font-black uppercase leading-[0.85] text-[#CCFF00]"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  letterSpacing: 0,
                  textShadow:
                    '1px 1px 0 #001A99, 2px 2px 0 #001A99, 3px 3px 0 #001A99, 4px 4px 0 #001A99, 5px 5px 0 #001A99, 6px 6px 0 #001A99, 7px 7px 0 #001A99, 8px 8px 0 #001A99, 9px 9px 0 #001A99, 10px 10px 0 #001A99, 11px 11px 0 #001A99, 12px 12px 0 #001A99',
                }}
              >
                FEED
              </h1>
            </div>

            <div className="relative z-20 flex w-full justify-center">
              <h1
                className="m-0 p-0 text-[clamp(4.8rem,15vw,220px)] font-black uppercase leading-[0.85] text-white"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  letterSpacing: 0,
                  textShadow:
                    '1px 1px 0 #001A99, 2px 2px 0 #001A99, 3px 3px 0 #001A99, 4px 4px 0 #001A99, 5px 5px 0 #001A99, 6px 6px 0 #001A99, 7px 7px 0 #001A99, 8px 8px 0 #001A99, 9px 9px 0 #001A99, 10px 10px 0 #001A99, 11px 11px 0 #001A99, 12px 12px 0 #001A99',
                }}
              >
                PAY
              </h1>
            </div>

            <div className="relative z-10 flex w-full justify-start pl-[12%] md:pl-[31%]">
              <h1
                className="m-0 p-0 text-[clamp(3.7rem,11vw,150px)] font-black uppercase leading-[0.85] text-white"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  letterSpacing: 0,
                  textShadow:
                    '1px 1px 0 #001A99, 2px 2px 0 #001A99, 3px 3px 0 #001A99, 4px 4px 0 #001A99, 5px 5px 0 #001A99, 6px 6px 0 #001A99, 7px 7px 0 #001A99, 8px 8px 0 #001A99, 9px 9px 0 #001A99, 10px 10px 0 #001A99',
                }}
              >
                BONUS
              </h1>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 h-full w-full">
            <FloatingReviewCard
              className="bottom-[3%] left-[2%] md:left-[15%]"
              rotate="rotate-[-12deg]"
              name="Очень полезный"
              product="цвет отличался от фото"
              score="84/100"
              coupon="FEED10"
            />

            <FloatingReviewCard
              className="right-[1%] top-[8%] md:right-[15%]"
              delay={1}
              rotate="rotate-[12deg]"
              name="Негативный, но ценный"
              product="ожидание 35 минут"
              score="78/100"
              coupon="FEED5"
            />

            <div className="absolute bottom-[-2%] left-[0%] z-20 size-24 md:left-[8%] md:size-32">
              <ArrowGreenLeft />
            </div>
            <div className="absolute right-[0%] top-[2%] z-20 size-24 md:right-[8%] md:size-32">
              <ArrowGreenRight />
            </div>
            <div className="pointer-events-auto absolute bottom-[-13%] right-[0%] z-40 md:right-[12%]">
              <CircularBadge />
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-3xl text-center">
          <p className="text-lg font-bold leading-8 text-white md:text-2xl">
            Бонусы за отзывы, которые помогают бизнесу расти. FeedPay оценивает подробность, конструктивность и выдаёт купон за полезную обратную связь.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/review"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#CCFF00] bg-[#CCFF00] px-7 py-4 text-sm font-black uppercase tracking-wide text-black shadow-xl transition hover:-translate-y-1 hover:bg-white"
            >
              Оставить отзыв
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#0038FF]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative z-20 mt-auto w-full rounded-t-[2.5rem] bg-white px-6 py-12 text-black shadow-[0_-20px_50px_rgba(0,0,0,0.2)] md:rounded-t-[3.5rem] md:px-10 md:py-16"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative">
            <FeaturePill icon={QrCode} title="Сканируй QR" text="Клиент попадает на форму отзыва сразу после покупки." />
            <div className="absolute -right-12 bottom-8 z-30 hidden size-16 md:block">
              <ArrowBlack />
            </div>
          </div>
          <div className="relative">
            <FeaturePill icon={Sparkles} title="AI-score отзыва" text="Алгоритм оценивает детали, конструктивность, понятность и антиспам." />
            <div className="absolute -right-12 bottom-8 z-30 hidden size-16 md:block">
              <ArrowBlack />
            </div>
          </div>
          <FeaturePill icon={BarChart3} title="Dashboard роста" text="Бизнес видит темы, score, купоны, рейтинг и повторяющиеся проблемы." />
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 rounded-[2rem] bg-[#F8F9FA] p-5 md:grid-cols-[1fr_1fr_auto] md:items-center md:p-6">
          <div>
            <h2 className="text-2xl font-black uppercase leading-tight md:text-3xl">Короткие отзывы больше не проходят</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-black/60">
              “Норм” получает низкий score. Подробный негативный отзыв может получить высокий бонус, если он помогает улучшить продукт.
            </p>
          </div>
          <div className="grid gap-2 text-sm font-bold">
            {['Больше качественных отзывов', 'Меньше спама', 'Купоны за конструктивность'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full bg-white px-4 py-3">
                <span className="grid size-6 place-items-center rounded-full bg-[#CCFF00]">
                  <Check className="size-4" strokeWidth={4} />
                </span>
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-[2rem] bg-[#0038FF] p-5 text-center text-white">
            <p className="text-xs font-black uppercase text-white/70">coupon</p>
            <p className="mt-1 text-4xl font-black">FEED10</p>
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-white px-6 pb-14 text-black md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[2.5rem] border-2 border-black bg-[#0038FF] p-6 text-white shadow-[10px_10px_0_#000] md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <SectionEyebrow>Problem / Solution</SectionEyebrow>
            <h2 className="mt-6 text-4xl font-black uppercase leading-none md:text-6xl">
              Отзывы должны приносить рост, а не шум
            </h2>
            <p className="mt-5 text-base font-bold leading-7 text-white/75">
              Большинство клиентов пишут одно слово. FeedPay превращает момент после покупки в понятный обмен: клиент даёт подробную обратную связь, бизнес выдаёт бонус и получает аналитику.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ReviewMiniCard score="12/100" title="Слабый сигнал" text="“Норм” не объясняет, что улучшить, поэтому бонус не выдаётся." />
            <ReviewMiniCard score="84/100" title="Ценный отзыв" text="Детали про доставку, упаковку, цвет и предложение дают бизнесу конкретные действия." />
          </div>
        </div>
      </section>

      <section id="score-engine" className="relative z-20 bg-white px-6 pb-14 text-black md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_0.95fr] md:items-center">
          <div className="rounded-[2.5rem] bg-[#F8F9FA] p-6 md:p-10">
            <SectionEyebrow>Scoring engine</SectionEyebrow>
            <h2 className="mt-6 text-4xl font-black uppercase leading-none md:text-6xl">Оценка 0-100 за секунды</h2>
            <p className="mt-5 text-sm font-bold leading-7 text-black/60 md:text-base">
              В MVP анализ работает локально: длина, конкретика, конструктивность, понятность и антиспам. Никакого ожидания внешнего API.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['< 40', 'без бонуса'],
                ['60+', 'полезный отзыв'],
                ['80+', 'FEED10'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-[1.5rem] border-2 border-black bg-white p-4 shadow-[5px_5px_0_#000]">
                  <p className="text-3xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase text-black/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 shadow-[10px_10px_0_#000]"
          >
            <div className="rounded-[2rem] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-black/50">AI-анализ</p>
                  <p className="mt-1 text-5xl font-black">84/100</p>
                </div>
                <Sparkles className="size-12 text-[#0038FF]" strokeWidth={3} />
              </div>
              <div className="mt-7 grid gap-4">
                <ScoreRow label="Длина" value={20} max={20} />
                <ScoreRow label="Детали" value={25} max={25} />
                <ScoreRow label="Конструктивность" value={22} max={25} />
                <ScoreRow label="Понятность" value={9} max={10} />
                <ScoreRow label="Антиспам" value={18} max={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="coupons" className="relative z-20 bg-[#0038FF] px-6 py-16 text-white md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-black uppercase">Coupon ladder</span>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none md:text-6xl">Бонус растёт вместе с качеством</h2>
            </div>
            <p className="max-w-md text-sm font-bold leading-7 text-white/75">
              Негативный отзыв тоже может получить высокий бонус, если он подробный и конструктивный.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <CouponStep code="FEED3" discount="3%" label="40-59 score" />
            <CouponStep code="FEED5" discount="5%" label="60-79 score" />
            <CouponStep code="FEED10" discount="10%" label="80-100 score" />
          </div>
        </div>
      </section>

      <section id="dashboard-preview" className="relative z-20 bg-white px-6 py-16 text-black md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <div>
            <SectionEyebrow>Business dashboard</SectionEyebrow>
            <h2 className="mt-6 text-4xl font-black uppercase leading-none md:text-6xl">Видно, что реально болит</h2>
            <p className="mt-5 text-sm font-bold leading-7 text-black/60 md:text-base">
              Dashboard собирает последние отзывы, средний рейтинг, полезность, купоны и частые темы: доставка, упаковка, цена, персонал, возврат.
            </p>
            <Link
              to="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5"
            >
              Открыть dashboard
              <ArrowRight className="size-4" strokeWidth={4} />
            </Link>
          </div>
          <div className="rounded-[2.5rem] border-2 border-black bg-[#F8F9FA] p-4 shadow-[10px_10px_0_#000] md:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [MessageSquareText, '128', 'отзывов'],
                [Star, '4.6', 'средний рейтинг'],
                [TrendingUp, '72', 'avg score'],
              ].map(([Icon, value, label]) => {
                const CardIcon = Icon as LucideIcon
                return (
                  <div key={label as string} className="rounded-[1.5rem] bg-white p-4">
                    <CardIcon className="size-5 text-[#0038FF]" />
                    <p className="mt-3 text-3xl font-black">{value as string}</p>
                    <p className="text-xs font-black uppercase text-black/45">{label as string}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 rounded-[2rem] bg-[#0038FF] p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black uppercase">Частые темы</p>
                <BarChart3 className="size-5" />
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ['доставка', '78%'],
                  ['упаковка', '54%'],
                  ['качество', '49%'],
                ].map(([topic, width]) => (
                  <div key={topic}>
                    <div className="mb-2 flex justify-between text-xs font-black uppercase">
                      <span>{topic}</span>
                      <span>{width}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/20">
                      <div className="h-full rounded-full bg-[#CCFF00]" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-white px-6 pb-16 text-black md:px-10">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 shadow-[10px_10px_0_#000] md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">Запусти demo за минуту</h2>
              <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-black/65 md:text-base">
                Оставьте отзыв, получите score и купон, затем откройте dashboard. Всё работает без backend и уже готово для презентации бизнес-кейса.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                to="/review"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-7 py-4 text-sm font-black uppercase text-black shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5"
              >
                Оставить отзыв
                <Target className="size-4" strokeWidth={4} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-7 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5"
              >
                Смотреть аналитику
                <ShieldCheck className="size-4" strokeWidth={4} />
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [Clock3, 'до 5 секунд', 'быстрый анализ'],
              [Gift, 'авто-купон', 'без ручной проверки'],
              [BarChart3, 'темы отзывов', 'для решений бизнеса'],
            ].map(([Icon, value, label]) => {
              const CardIcon = Icon as LucideIcon
              return (
                <div key={value as string} className="rounded-[1.5rem] bg-black p-5 text-white">
                  <CardIcon className="size-6 text-[#CCFF00]" />
                  <p className="mt-4 text-2xl font-black uppercase">{value as string}</p>
                  <p className="mt-1 text-xs font-black uppercase text-white/50">{label as string}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
