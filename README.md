# Obitelj Bunčić, demo stranica

Astro 7 + Tailwind 4 + Motion. Statički build za Cloudflare Pages.
Fontovi: Brygada 1918 (naslovi) + Work Sans (tekst). Svijetla i tamna tema (prekidač u headeru).

## Pokretanje

```
npm install
npm run dev       # razvoj
npm run build     # produkcijski build u dist/
npm run preview   # pregled builda
```

## Cloudflare Pages

- Build naredba: `npm run build`
- Izlazna mapa: `dist`
- Varijable okruženja (vidi `.env.example`): `PUBLIC_GA_ID`, `PUBLIC_GSC_VERIFIKACIJA`, `PUBLIC_DEMO_OZNAKE`

## Sadržaj (spremno za Decap / Keystatic)

| Mapa | Sadržaj |
| --- | --- |
| `src/content/ponuda/*.md` | šest stavki izbornika Ponuda (tekst, SEO, naslovnica, galerija) |
| `src/content/novosti/*.md` | objave za Novosti i događanja |
| `src/content/postavke/postavke.json` | kontakti, lokacije s koordinatama, radno vrijeme, podaci o tvrtki |
| `src/content/dvorane/dvorane.json` | dvorane s kapacitetima (modul "Koliko gostiju?") |
| `src/content/paketi/paketi.json` | okvirni paketi i cijene |
| `src/content/recenzije/recenzije.json` | iskustva mladenaca |
| `src/content/faq/faq.json` | česta pitanja |
| `src/assets/images/<sekcija>/` | fotografije s buncic.hr i iz arhive stare stranice (stanje: `FOTOGRAFIJE.md`) |

Svaki unos ima polje `potvrdeno`. Dok je `false`, stranica uz njega prikazuje oznaku "Primjer, potvrditi". Mjesta za stvarni sadržaj označena su s `[UNIJETI STVARNI SADRŽAJ]`. Za prezentaciju bez oznaka: `PUBLIC_DEMO_OZNAKE=false`.

Sheme su u `src/content.config.ts`.

## Placeholderi za produkciju

- Obrasci (`src/components/Obrazac.astro`): slanje je simulirano, spojiti na Cloudflare Pages Function ili Formspree.
- Chatbot (`src/components/Chatbot.astro`): sučelje gotovo, funkcija `posaljiPoruku()` čeka backend.
- Analitika (`src/components/Analitika.astro`): GA4 s Consent Mode v2, učitava se tek nakon privole.

## Lighthouse

Izvještaji (HTML) su u `lighthouse/`.

## Testovi

`.playwright-cli/responzivnost.js` (12 stranica x 9 širina, 320-1920 px), `.playwright-cli/interakcije.js`, `.playwright-cli/karta.js` (karta se učitava tek na klik) i `.playwright-cli/iscrtavanje.js` (stvarni FCP/LCP uz spori 4G i 4x CPU). `interakcije.js` pokrenuti u svježoj sesiji (`playwright-cli close` pa `open`), jer `responzivnost.js` ostavlja spremljenu privolu za kolačiće:

```
playwright-cli open --browser=msedge   # ili --browser=webkit (Safari engine)
playwright-cli run-code --filename=.playwright-cli/responzivnost.js
```
