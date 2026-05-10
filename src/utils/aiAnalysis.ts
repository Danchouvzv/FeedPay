import type { ReviewAnalysis } from '../types/review'
import { analyzeReview } from './analyzeReview'

export async function analyzeReviewWithAI(text: string): Promise<ReviewAnalysis> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) throw new Error('AI endpoint unavailable')
    return (await response.json()) as ReviewAnalysis
  } catch {
    return analyzeReview(text)
  }
}
