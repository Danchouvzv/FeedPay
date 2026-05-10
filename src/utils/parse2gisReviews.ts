export type ParsedExternalReview = {
  customerName: string
  rating: number
  text: string
}

const ratingPatterns = [
  /(?:оценка|рейтинг)\s*[:-]?\s*([1-5])(?:[,.]0)?/i,
  /([1-5])\s*(?:из|\/)\s*5/i,
  /([1-5])\s*(?:звезд|звёзд|★)/i,
]

function extractRating(block: string) {
  for (const pattern of ratingPatterns) {
    const match = block.match(pattern)
    if (match?.[1]) return Number(match[1])
  }

  const stars = block.match(/★/g)?.length ?? 0
  if (stars >= 1 && stars <= 5) return stars

  return 5
}

function cleanLine(line: string) {
  return line
    .replace(/^\s*(отзыв|оценка|рейтинг)\s*[:-]\s*/i, '')
    .replace(/^\s*[1-5]\s*(?:из|\/)\s*5\s*/i, '')
    .replace(/★+/g, '')
    .trim()
}

export function parse2gisReviews(rawText: string): ParsedExternalReview[] {
  return rawText
    .split(/\n{2,}|-{3,}|={3,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      const rating = extractRating(block)
      const firstMeaningfulLine = lines.find((line) => !/^(оценка|рейтинг|\d\s*(?:из|\/)\s*5|★+)/i.test(line))
      const maybeName = firstMeaningfulLine && firstMeaningfulLine.length <= 36 ? firstMeaningfulLine : `Клиент ${index + 1}`
      const textLines = lines
        .filter((line) => line !== maybeName)
        .map(cleanLine)
        .filter((line) => line.length > 8 && !/^\d\s*(?:из|\/)\s*5$/i.test(line))

      const text = textLines.join(' ').trim() || cleanLine(block)

      return {
        customerName: maybeName,
        rating,
        text,
      }
    })
    .filter((review) => review.text.length > 2)
}
