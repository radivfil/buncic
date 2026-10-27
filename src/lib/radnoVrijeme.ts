/*
  Radno vrijeme svake lokacije živi u postavke.json (lokacija.radnoVrijeme[]): prvi redak je glavno
  radno vrijeme, ostali su dodatni (svadbe, recepcija, nedjelja...). Redak s poljem "shema" ulazi i u
  schema.org openingHoursSpecification te lokacije.
*/
import type { CollectionEntry } from 'astro:content';

type Lokacija = CollectionEntry<'postavke'>['data']['lokacije'][number];
export type RedakRadnogVremena = Lokacija['radnoVrijeme'][number];

/** "Ponedjeljak - nedjelja: 8-22h" */
export const tekstRetka = (r: RedakRadnogVremena) => `${r.dani}: ${r.vrijeme}`;

/** Glavno radno vrijeme lokacije (prvi redak) */
export const glavnoRadnoVrijeme = (l: Lokacija) => l.radnoVrijeme[0];

export const shemaRadnogVremena = (l: Lokacija) =>
  l.radnoVrijeme
    .filter((r) => r.shema)
    .map((r) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: r.shema!.dani, opens: r.shema!.od, closes: r.shema!.do }));
