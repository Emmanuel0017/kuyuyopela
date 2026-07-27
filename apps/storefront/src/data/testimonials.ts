// src/data/testimonials.ts
export interface Testimonial {
  name: string;
  loc: string;
  rating: number;
  note: string;
  before: string;
  after: string;
}

export const testimonials: Testimonial[] = [
  { name: 'Thandiwe', loc: 'Blantyre', rating: 5, note: 'After 1 bottle only', before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
  { name: 'Chisomo',  loc: 'Lilongwe', rating: 5, note: 'After 2 bottles',    before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
  { name: 'Memory',   loc: 'Mzimba',   rating: 4, note: 'After 1 bottle only', before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
  { name: 'Gift',     loc: 'Mzuzu',    rating: 5, note: 'After 2 bottles',    before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
  { name: 'Patricia', loc: 'Blantyre', rating: 5, note: 'After 3 bottles',    before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
  { name: 'Grace',    loc: 'Zomba',    rating: 5, note: 'After 2 bottles',    before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
  { name: 'Joseph',   loc: 'Mangochi', rating: 4, note: 'After 1 bottle only', before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
  { name: 'Ella',     loc: 'Kasungu',  rating: 5, note: 'After 2 bottles',    before: 'https://placehold.co/300x220/999/fff?text=Before', after: 'https://placehold.co/300x220/198754/fff?text=After' },
];