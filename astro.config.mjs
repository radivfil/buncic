// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Statički build za Cloudflare Pages (build naredba: npm run build, izlaz: dist)
export default defineConfig({
  site: 'https://buncic.hr',
  trailingSlash: 'ignore',
  // CSS se ugrađuje u HTML: nema zasebnog render-blocking zahtjeva (bolji FCP/LCP na mobitelu)
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap({ i18n: undefined, filter: (url) => !url.includes('/404') })],
});
