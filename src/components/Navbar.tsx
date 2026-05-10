import { Link, NavLink } from 'react-router-dom'
import { BarChart3, Home, MessageSquareText } from 'lucide-react'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-xs font-black uppercase transition ${
    isActive ? 'bg-[#CCFF00] text-black' : 'text-white hover:bg-white hover:text-[#0038FF]'
  }`

export function Navbar() {
  return (
    <header className="fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-full border border-white/35 bg-white/15 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl md:top-5 md:w-[calc(100%-3rem)]">
      <div className="flex items-center justify-between gap-2">
        <Link to="/" className="flex min-w-0 items-center gap-1 rounded-full bg-white p-1 pr-3 shadow-lg">
          <div className="rounded-full bg-[#0038FF] px-3 py-2 text-xs font-black text-white md:text-sm">FEED</div>
          <div className="rounded-full border-2 border-black bg-[#CCFF00] px-3 py-2 text-xs font-black text-black md:text-sm">PAY</div>
        </Link>

        <nav className="hidden items-center rounded-full border border-white/25 bg-[#002AD0]/70 p-1 md:flex">
          <NavLink to="/review" className={navLinkClass}>
            Отзыв
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/import" className={navLinkClass}>
            Импорт
          </NavLink>
          <NavLink to="/pipeline" className={navLinkClass}>
            Pipeline
          </NavLink>
          <a href="/#how-it-works" className="rounded-full px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-white hover:text-[#0038FF]">
            Как работает
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link className="grid size-10 place-items-center rounded-full border border-white/35 text-white transition hover:bg-white hover:text-[#0038FF] md:hidden" to="/" aria-label="Главная">
            <Home className="size-5" />
          </Link>
          <Link className="grid size-10 place-items-center rounded-full border border-white/35 text-white transition hover:bg-white hover:text-[#0038FF] md:hidden" to="/dashboard" aria-label="Dashboard">
            <BarChart3 className="size-5" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#CCFF00] px-4 py-3 text-xs font-black uppercase text-black shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5"
            to="/review"
          >
            <MessageSquareText className="size-4" strokeWidth={4} />
            <span className="hidden sm:inline">Оставить отзыв</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
