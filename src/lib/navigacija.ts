/*
  Jedan izvor navigacije: src/content/navigacija/navigacija.json.
  glavna: stavke zaglavlja i mobilnog izbornika (s mjestom padajućeg izbornika "Ponuda");
  stranice: redoslijed stranica ponude za padajući izbornik, mobilni izbornik i stupac "Stranice" u podnožju.
*/
import { getEntries, getEntry } from 'astro:content';

export async function navigacija() {
  const nav = (await getEntry('navigacija', 'ponuda'))!.data;
  const iPonuda = nav.glavna.findIndex((s) => s.izbornik);
  return {
    // stavke glavne navigacije prije i poslije padajućeg izbornika "Ponuda"
    glavnaPrije: nav.glavna.slice(0, iPonuda),
    ponuda: nav.glavna[iPonuda],
    glavnaPoslije: nav.glavna.slice(iPonuda + 1),
    stranice: await getEntries(nav.stranice),
    podnozjeDodatno: nav.podnozjeDodatno,
  };
}

/**
 * Mjesto stavke u izbornicima: prva stranica (Vjenčanja) zauzima cijeli prvi stupac,
 * ostale se redom pune po stupcima, tri po stupcu.
 */
export const mjestoUIzborniku = (i: number) => ({ stupac: i === 0 ? 0 : Math.floor((i - 1) / 3) + 1, red: i === 0 ? 0 : ((i - 1) % 3) + 1 });
