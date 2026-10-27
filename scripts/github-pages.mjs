// Dorada builda za GitHub Pages (stranica se poslužuje pod /ime-repozitorija/).
// Astro sam dodaje base na svoje resurse (_astro, slike, fontove); ova skripta
// dopisuje base na ručno pisane interne linkove. noindex dodaje layout prema src/siteMode.mjs.
// Pokretanje: astro build --site https://korisnik.github.io --base /buncic && node scripts/github-pages.mjs /buncic
import fs from 'node:fs';
import path from 'node:path';

const baza = (process.argv[2] ?? '').replace(/\/$/, '');
if (!baza.startsWith('/')) throw new Error('Navedi base, npr. node scripts/github-pages.mjs /buncic');

const html = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? html(p) : e.name.endsWith('.html') ? [p] : [];
  });

// "/" ili "/nešto", ali ne "//cdn" niti putanje koje već imaju base
const interno = new RegExp(`\\b(href|src|action)="(/(?!/|${baza.slice(1)}(?:/|"))[^"]*)"`, 'g');

let ukupno = 0;
for (const f of html('dist')) {
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(interno, (_, a, v) => (ukupno++, `${a}="${baza}${v}"`));
  fs.writeFileSync(f, s);
}
console.log(`GitHub Pages: ${ukupno} internih putanja prepravljeno.`);
