/*
  robots.txt prema načinu rada (src/siteMode.mjs).
  Preview: bez "Disallow: /" (pretraživač mora otvoriti stranicu da bi vidio noindex) i bez sitemapa.
  Production: dodaje se poveznica na sitemap.
*/
import type { APIRoute } from 'astro';
import { preview } from '../siteMode.mjs';

export const GET: APIRoute = ({ site }) => {
  const retci = ['User-agent: *', 'Allow: /'];
  if (!preview && site) retci.push('', `Sitemap: ${new URL('sitemap-index.xml', site)}`);
  return new Response(retci.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
