import { Copy, Gift } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

type CouponCardProps = {
  coupon: string
  discount: number
  onCopy?: () => void
}

export function CouponCard({ coupon, discount, onCopy }: CouponCardProps) {
  return (
    <article className="overflow-hidden rounded-[2.5rem] border-2 border-black bg-white text-black shadow-[10px_10px_0_#000]">
      <div className="bg-[#CCFF00] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-black/55">FeedPay coupon</p>
            <h2 className="mt-2 text-6xl font-black leading-none">-{discount}%</h2>
          </div>
          <span className="grid size-16 place-items-center rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_#000]">
            <Gift className="size-8 text-[#0038FF]" />
          </span>
        </div>
      </div>
      <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-xs font-black uppercase text-black/45">Промокод</p>
          <div className="mt-3 rounded-[1.5rem] border-2 border-dashed border-black bg-[#F8F9FA] px-5 py-4 text-center text-3xl font-black text-black sm:text-4xl">
            {coupon}
          </div>
          <p className="mt-4 text-sm font-bold leading-6 text-black/60">Покажите этот купон при следующей покупке. Действует 7 дней.</p>
          <button
            type="button"
            onClick={onCopy}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-5 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5 sm:w-auto"
          >
            <Copy className="size-4" />
            Скопировать промокод
          </button>
        </div>
        <div className="mx-auto rounded-[1.5rem] border-2 border-black bg-white p-3 shadow-[5px_5px_0_#000]">
          <QRCodeSVG value={coupon} size={132} />
        </div>
      </div>
    </article>
  )
}
