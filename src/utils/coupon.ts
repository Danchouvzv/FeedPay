export function generateCoupon(score: number): string | null {
  if (score < 40) return null
  if (score < 60) return 'FEED3'
  if (score < 80) return 'FEED5'
  return 'FEED10'
}

export function getDiscount(score: number): number {
  if (score < 40) return 0
  if (score < 60) return 3
  if (score < 80) return 5
  return 10
}
