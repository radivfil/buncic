/*
  Dokumenti za preuzimanje (jelovnici, brošure): podaci su u src/content/dokumenti/dokumenti.json,
  datoteke u public/dokumenti/. Veličina se čita iz same datoteke pri buildu, pa se ne mora ručno upisivati.
*/
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection } from 'astro:content';

/** Veličina datoteke iz public/ u obliku "10,7 MB" (decimalni MB, jedna decimala) */
export function velicinaDatoteke(putanja: string): string {
  const bajtovi = statSync(join(process.cwd(), 'public', putanja)).size;
  return `${(bajtovi / 1_000_000).toLocaleString('hr-HR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${String.fromCharCode(0x00a0)}MB`;
}

/** Dokumenti jedne stranice (polje stranica = id iz ponuda/), s izračunatom veličinom */
export async function dokumentiStranice(stranica: string) {
  return (await getCollection('dokumenti'))
    .filter((d) => d.data.stranica.id === stranica)
    .map((d) => {
      const velicina = velicinaDatoteke(d.data.putanja);
      // Upisana veličina mora pratiti datoteku (npr. nakon kompresije); upozorenje u buildu
      if (d.data.velicina && d.data.velicina.replace(/\s/g, '') !== velicina.replace(/\s/g, '')) {
        console.warn(`[dokumenti] ${d.id}: u dokumenti.json piše ${d.data.velicina}, datoteka ima ${velicina}`);
      }
      return { ...d.data, id: d.id, velicina };
    });
}
