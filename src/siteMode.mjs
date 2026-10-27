// @ts-check
/*
  Način rada stranice: JEDNA vrijednost za cijelu stranicu.
  - 'preview'    = probna verzija za vlasnika (GitHub Pages): noindex na svakoj stranici, bez sitemapa,
                   bez canonical / og:url i bez schema.org adresa na produkcijsku domenu.
  - 'production' = prava domena: bez noindexa, sitemap, canonical i og:url na buncic.hr.
  Koristi se u astro.config.mjs (sitemap), src/layouts/Osnovni.astro (head), src/pages/robots.txt.ts i schema.org.
  Prije lansiranja na buncic.hr promijeniti u 'production' (vidi docs/objava-i-povratak.md).
*/

/** @type {'preview' | 'production'} */
export const siteMode = 'preview';

export const preview = siteMode === 'preview';
