// src/data/stores.ts
export interface Store {
  city: string;
  address: string;
  phone: string;
}

export const stores: Store[] = [
  { city: 'Blantyre',  address: 'Limbe, near Total Filling Station', phone: '0999 666 670' },
  { city: 'Lilongwe',  address: 'Area 47, Sector 4',                  phone: '0995 666 190' },
  { city: 'Mzuzu',     address: 'Katoto Township, Main Road',         phone: '0888 111 222' },
  { city: 'Zomba',     address: 'Zomba Market Area',                  phone: '0991 222 333' },
  { city: 'Mangochi',  address: 'Mangochi Boma',                      phone: '0997 444 555' },
];