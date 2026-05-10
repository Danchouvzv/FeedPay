import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight, Calendar, Copy, QrCode } from 'lucide-react'
import type { Campaign } from '../types/review'
import { getCampaigns, saveCampaign } from '../utils/storage'

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(() => getCampaigns())
  const [name, setName] = useState('Бонус за полезный отзыв')
  const [branchName, setBranchName] = useState('Кофейня Абая')
  const [couponLimit, setCouponLimit] = useState(100)
  const previewUrl = useMemo(() => `${window.location.origin}/review?campaign=${encodeURIComponent(name)}`, [name])

  const createCampaign = () => {
    const campaign: Campaign = {
      id: crypto.randomUUID(),
      name: name.trim(),
      branchName: branchName.trim(),
      rewardRule: 'FEED3 / FEED5 / FEED10 по score отзыва',
      qrUrl: previewUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      couponLimit,
      issuedCoupons: 0,
    }
    saveCampaign(campaign)
    setCampaigns(getCampaigns())
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
          <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
            QR campaign builder
          </span>
          <h1 className="mt-7 text-5xl font-black uppercase leading-none md:text-7xl">Создай кампанию для отзывов</h1>
          <p className="mt-5 text-base font-bold leading-7 text-black/65">
            Бизнес создаёт QR-кампанию для филиала, печатает QR на кассе или упаковке, а FeedPay считает отзывы и купоны.
          </p>
        </div>

        <div className="rounded-[2.5rem] border-2 border-black bg-white p-6 text-black shadow-[10px_10px_0_#000]">
          <div className="grid gap-4">
            <Input label="Название кампании" value={name} onChange={setName} />
            <Input label="Филиал / точка" value={branchName} onChange={setBranchName} />
            <label className="grid gap-2">
              <span className="text-sm font-black uppercase">Лимит купонов</span>
              <input
                className="rounded-[1.35rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold outline-none"
                type="number"
                value={couponLimit}
                min={1}
                onChange={(event) => setCouponLimit(Number(event.target.value))}
              />
            </label>
            <div className="rounded-[2rem] border-2 border-black bg-[#F8F9FA] p-5">
              <div className="mx-auto w-fit rounded-[1.5rem] border-2 border-black bg-white p-3 shadow-[5px_5px_0_#000]">
                <QRCodeSVG value={previewUrl} size={150} />
              </div>
              <p className="mt-4 break-all text-center text-xs font-bold text-black/55">{previewUrl}</p>
            </div>
            <button onClick={createCampaign} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-6 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-0.5">
              Создать QR кампанию
              <QrCode className="size-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="rounded-[2rem] border-2 border-black bg-white p-5 text-black shadow-[7px_7px_0_#000]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black uppercase">{campaign.name}</h2>
                <p className="mt-1 text-sm font-bold text-black/55">{campaign.branchName}</p>
              </div>
              <Calendar className="size-6 text-[#0038FF]" />
            </div>
            <div className="mt-5 flex items-center justify-between rounded-[1.5rem] bg-[#F8F9FA] p-4">
              <span className="text-sm font-black uppercase">Купоны</span>
              <span className="font-black">{campaign.issuedCoupons}/{campaign.couponLimit}</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(campaign.qrUrl)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-[#CCFF00] px-5 py-3 text-xs font-black uppercase shadow-[4px_4px_0_#000]"
            >
              <Copy className="size-4" />
              Скопировать ссылку
            </button>
          </article>
        ))}
      </section>

      <div className="mt-8 flex justify-end">
        <Link to="/redeem" className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-6 py-4 text-sm font-black uppercase text-black shadow-[6px_6px_0_#000]">
          Перейти к redemption
          <ArrowRight className="size-5" />
        </Link>
      </div>
    </main>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black uppercase">{label}</span>
      <input className="rounded-[1.35rem] border-2 border-black bg-[#F8F9FA] px-4 py-3 font-bold outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
