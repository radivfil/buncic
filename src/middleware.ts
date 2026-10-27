import { defineMiddleware } from 'astro:middleware';
import { getEntry } from 'astro:content';
import { tipografijaHtml } from './lib/tipografija';
import { mapaLokacijaPoBroju, oznaciTelLinkove } from './lib/kontakt';

// Obrada svake HTML stranice: tipografija (crtice uz NBSP, lib/tipografija.ts) i
// data-event/data-location na tel: linkovima (lib/kontakt.ts).
// Radi i u devu i pri statičkom buildu, pa vrijedi za sav sadržaj, iz koje god datoteke dolazi.
export const onRequest = defineMiddleware(async (_kontekst, next) => {
  const odgovor = await next();
  if (!odgovor.headers.get('content-type')?.includes('text/html')) return odgovor;
  const lokacije = (await getEntry('postavke', 'opce'))!.data.lokacije;
  const html = oznaciTelLinkove(tipografijaHtml(await odgovor.text()), mapaLokacijaPoBroju(lokacije));
  const zaglavlja = new Headers(odgovor.headers);
  zaglavlja.delete('content-length');
  return new Response(html, { status: odgovor.status, statusText: odgovor.statusText, headers: zaglavlja });
});
