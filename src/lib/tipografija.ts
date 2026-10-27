/*
  Hrvatska tipografija za gotov HTML (poziva je src/middleware.ts za svaku stranicu):
  - crtica (– ili —) se nerazdvojivim razmakom veže uz prethodnu (i sljedeću) riječ, pa nikad ne stoji na kraju reda;
  - raspon sa spojnicom između razmaka ("Ponedjeljak - subota", "7 - 22 h") dobiva NBSP s obje strane;
  - raspon s crticom između brojeva ("7 – 22") također s obje strane.
  Spojnice unutar riječi (npr. "e-mail") se ne pretvaraju; iza njih ide samo nevidljivi WJ. Mijenja se samo tekst između tagova;
  atributi, komentari i sadržaj <script>, <style>, <pre> i <textarea> ostaju netaknuti.
*/
const NBSP = String.fromCharCode(0x00a0);
// Iza spojnice/crtice preglednik smije prelomiti čak i ispred NBSP-a (Unicode UAX #14),
// pa u rasponima nevidljivi "word joiner" zabranjuje prijelom iza crtice.
const WJ = String.fromCharCode(0x2060);
// Cijeli <script>/<style>/<pre>/<textarea> blok (CSS sadrži npr. "width<64rem", pa se ne smije čitati kao tag),
// zatim komentar, zatim bilo koji tag. Sve između toga je tekst.
const neTekst = /<(script|style|pre|textarea)\b[\s\S]*?<\/\1\s*>|<!--[\s\S]*?-->|<[^>]*>/gi;

export function tipografijaTeksta(tekst: string): string {
  return tekst
    .replace(/(?<=\d)[ \t]+([–—])[ \t]+(?=\d)/g, `${NBSP}$1${WJ}${NBSP}`)
    // "prskalica – brinemo": crtica je vezana uz obje riječi, pa nikad ne stoji ni na kraju ni na početku reda
    .replace(/(?<=\S)[ \t\r\n]+([–—])[ \t\r\n]+(?=\S)/g, `${NBSP}$1${WJ}${NBSP}`)
    .replace(/(?<=\S)[ \t\r\n]+(?=[–—])/g, NBSP)
    .replace(/(?<=\S)[ \t]+-[ \t]+(?=\S)/g, `${NBSP}-${WJ}${NBSP}`)
    // telefon "+385 1 2781-133" (i upisan u Markdown) ostaje u jednom retku
    .replace(/(\+385)[ \t]+(\d{1,2})[ \t]+(?=\d)/g, `$1${NBSP}$2${NBSP}`)
    // broj i jedinica sata ("22 h", "13 sati") ostaju u istom retku
    .replace(/(?<=\d)[ \t]+(?=(?:h|sati)\b)/g, NBSP)
    // spojnica unutar riječi ili broja ("e-mail", "DJ-eve", "2781-133") ostaje ista, samo se red na njoj ne lomi
    .replace(/(?<=[\p{L}\d])-(?=[\p{L}\d])/gu, `-${WJ}`);
}

export function tipografijaHtml(html: string): string {
  let izlaz = '';
  let zadnji = 0;
  for (const m of html.matchAll(neTekst)) {
    izlaz += tipografijaTeksta(html.slice(zadnji, m.index)) + m[0];
    zadnji = m.index + m[0].length;
  }
  return izlaz + tipografijaTeksta(html.slice(zadnji));
}
