/*
  Pojedinačne fotografije stranica: src/content/slike/slike.json (popis mjesta: docs/popis-slika.md).
  Komponente traže sliku po id-u, pa se fotografija mijenja samo u podatkovnoj datoteci.
*/
import { getEntry } from 'astro:content';

export async function slika(id: string) {
  const unos = await getEntry('slike', id);
  if (!unos) throw new Error(`[slike] u src/content/slike/slike.json nema unosa "${id}"`);
  return unos.data;
}
