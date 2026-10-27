/*
  Linkovi iz podataka o lokacijama (postavke.json): karta, telefon, e-mail.
  Jedno mjesto za generiranje, da podnožje, Kontakt, naslovnica i stranice lokacija budu usklađeni.
*/
import type { CollectionEntry } from 'astro:content';

type Lokacija = CollectionEntry<'postavke'>['data']['lokacije'][number];

const pretraga = (upit: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(upit)}`;

/**
 * Link na kartu za lokaciju. Redom: postojeći Google Maps link (kartaUrl), postojeće koordinate,
 * pretraga po adresi s poštanskim brojem (adresaKarta). Koordinate se nikad ne izmišljaju.
 */
export const kartaHref = (l: Lokacija) =>
  l.kartaUrl ?? (l.koordinate ? pretraga(l.koordinate.join(',')) : pretraga(l.adresaKarta ?? l.adresa));

export const kartaAria = (l: Lokacija) => `Otvori adresu ${l.adresa} u kartama`;

const NBSP = String.fromCharCode(0x00a0);

/** "01 2753 947" ili "+385 1 2781-133" -> "tel:+38512753947" (E.164, bez razmaka, crtica i zagrada) */
export const telHref = (broj: string) => {
  let b = broj.replace(/[^\d+]/g, '');
  if (b.startsWith('00')) b = `+${b.slice(2)}`;
  else if (b.startsWith('0')) b = `+385${b.slice(1)}`;
  return `tel:${b}`;
};

// Pozivni brojevi u Hrvatskoj: Zagreb je jednoznamenkast (1), ostali (mobilne mreže 9x, županije 2x-5x) dvoznamenkasti
const pozivniBroj = (b: string) => (b.startsWith('1') ? '1' : b.slice(0, 2));

/**
 * Jedinstven prikaz telefona na cijelom sajtu: "+385 1 2753-947", "+385 91 4450-654".
 * Ulaz u bilo kojem obliku ("01 2753 947", "+385 1 2781-133", "+38512781133").
 * Razmaci su nerazdvojivi (NBSP), pa se broj ne lomi; razmak = false daje obične razmake (meta opis, schema.org).
 * Broj koji ne počinje s 0, 00 ili +385 vraća se nepromijenjen (ne pogađa se pozivni broj).
 */
export const formatTelefona = (broj: string, { nbsp = true } = {}) => {
  const e164 = telHref(broj).slice(4);
  if (!e164.startsWith('+385')) return broj;
  const nacionalni = e164.slice(4);
  const pozivni = pozivniBroj(nacionalni);
  const pretplatnik = nacionalni.slice(pozivni.length);
  if (pretplatnik.length < 6) return broj;
  const r = nbsp ? NBSP : ' ';
  return `+385${r}${pozivni}${r}${pretplatnik.slice(0, -3)}-${pretplatnik.slice(-3)}`;
};

/**
 * Svakom <a href="tel:..."> dodaje data-event="tel-click" i data-location (klet, ribarska, barba, uprava)
 * prema broju iz postavke.json, da se klikovi kasnije mogu brojati. Poziva je middleware, pa vrijedi
 * i za brojeve upisane u Markdown sadržaj. Samo atributi, bez analitike.
 */
export function oznaciTelLinkove(html: string, lokacijaPoBroju: Map<string, string>) {
  return html.replace(/<a\b([^>]*?)\shref="tel:([^"]+)"([^>]*)>/g, (cijeli, prije: string, broj: string, poslije: string) => {
    if (/data-event=/.test(cijeli)) return cijeli;
    const lokacija = lokacijaPoBroju.get(telHref(broj));
    return `<a${prije} href="tel:${broj}"${poslije} data-event="tel-click"${lokacija ? ` data-location="${lokacija}"` : ''}>`;
  });
}

export const mapaLokacijaPoBroju = (lokacije: Lokacija[]) =>
  new Map(lokacije.flatMap((l) => l.telefoni.map((t) => [telHref(t), l.oznaka] as [string, string])));
