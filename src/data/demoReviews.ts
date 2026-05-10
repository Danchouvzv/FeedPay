import type { Review } from '../types/review'
import { analyzeReview } from '../utils/analyzeReview'

const samples = [
  {
    customerName: 'Алия',
    productName: 'Кофе навынос',
    rating: 4,
    text: 'Норм',
    createdAt: '2026-05-06T09:30:00.000Z',
  },
  {
    customerName: 'Марат',
    productName: 'Беспроводные наушники',
    rating: 5,
    text: 'Товар хороший, доставка была быстрой, всё понравилось.',
    createdAt: '2026-05-07T11:20:00.000Z',
  },
  {
    customerName: 'Дина',
    productName: 'Платье из каталога',
    rating: 4,
    text: 'Товар пришёл быстро, упаковка была целой, качество хорошее, но цвет немного отличался от фото. Было бы полезно добавить реальные фотографии товара на сайт.',
    createdAt: '2026-05-08T15:45:00.000Z',
  },
  {
    customerName: 'Руслан',
    productName: 'Доставка ужина',
    rating: 3,
    text: 'Заказ ждал 35 минут, хотя в приложении было указано 15 минут. Персонал был вежливый, но хотелось бы видеть более точное время ожидания.',
    createdAt: '2026-05-09T18:10:00.000Z',
  },
]

export const demoReviews: Review[] = samples.map((sample, index) => {
  const analysis = analyzeReview(sample.text)

  return {
    id: `demo-${index + 1}`,
    customerName: sample.customerName,
    productName: sample.productName,
    rating: sample.rating,
    text: sample.text,
    score: analysis.score,
    level: analysis.level,
    coupon: analysis.coupon,
    discount: analysis.discount,
    criteria: analysis.criteria,
    topics: analysis.topics,
    createdAt: sample.createdAt,
  }
})
