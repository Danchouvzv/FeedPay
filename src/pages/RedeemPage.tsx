import { useState } from 'react'
import { CheckCircle2, ScanLine, XCircle } from 'lucide-react'
import type { CouponRedemption } from '../types/review'
import { getRedemptions, saveRedemption } from '../utils/storage'

function discountFromCode(code: string) {
  if (code === 'FEED3') return 3
  if (code === 'FEED5') return 5
  if (code === 'FEED10') return 10
  return 0
}

export function RedeemPage() {
  const [code, setCode] = useState('FEED10')
  const [customerName, setCustomerName] = useState('Клиент')
  const [redemptions, setRedemptions] = useState(() => getRedemptions())
  const [message, setMessage] = useState('')

  const redeem = () => {
    const normalized = code.trim().toUpperCase()
    const discount = discountFromCode(normalized)
    const redemption: CouponRedemption = {
      id: crypto.randomUUID(),
      code: normalized,
      customerName: customerName.trim() || 'Клиент',
      discount,
      status: discount > 0 ? 'redeemed' : 'rejected',
      redeemedAt: new Date().toISOString(),
      note: discount > 0 ? 'Купон погашен на кассе' : 'Неизвестный промокод',
    }
    saveRedemption(redemption)
    setRedemptions(getRedemptions())
    setMessage(discount > 0 ? `Скидка ${discount}% применена` : 'Код не найден')
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
            Cashier mode
          </span>
          <h1 className="mt-7 text-5xl font-black uppercase leading-none md:text-7xl">Погашение купонов</h1>
          <p className="mt-5 text-base font-bold leading-7 text-black/65">
            Кассир вводит или сканирует промокод, FeedPay отмечает купон как использованный. Это закрывает loop между отзывом и реальной покупкой.
          </p>
        </div>
        <div className="rounded-[2.5rem] border-2 border-black bg-white p-6 text-black shadow-[10px_10px_0_#000]">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-black uppercase">Промокод</span>
              <input className="rounded-[1.35rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 text-2xl font-black uppercase outline-none" value={code} onChange={(event) => setCode(event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-black uppercase">Клиент</span>
              <input className="rounded-[1.35rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold outline-none" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
            </label>
            <button onClick={redeem} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5">
              <ScanLine className="size-5" />
              Погасить купон
            </button>
            {message && <p className="rounded-[1.5rem] border-2 border-black bg-[#CCFF00] p-4 text-center font-black uppercase">{message}</p>}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4">
        {redemptions.map((item) => (
          <article key={item.id} className="flex flex-col gap-3 rounded-[2rem] border-2 border-black bg-white p-5 text-black shadow-[7px_7px_0_#000] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-black uppercase">{item.code} · {item.discount}%</p>
              <p className="text-sm font-bold text-black/55">{item.customerName} · {item.note}</p>
            </div>
            {item.status === 'redeemed' ? <CheckCircle2 className="size-8 text-emerald-600" /> : <XCircle className="size-8 text-rose-600" />}
          </article>
        ))}
      </section>
    </main>
  )
}
