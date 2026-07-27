// src/data/reviews.ts
export interface Review {
  name: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  { name: 'Patricia, Blantyre', rating: 5, text: 'One Drop changed my skin completely. The pimples and spots are gone!' },
  { name: 'James, Lilongwe',    rating: 5, text: 'I was skeptical at first but the results after two weeks were undeniable.' },
  { name: 'Ruth, Mzuzu',        rating: 4, text: 'Great product, gentle on my skin and smells amazing too.' },
];