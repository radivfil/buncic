import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/*
  Sav urednički sadržaj živi u src/content i strukturiran je tako da ga
  Decap CMS ili Keystatic mogu uređivati bez promjene koda:
  - novosti/*.md      -> objave (Novosti i događanja)
  - ponuda/*.md       -> po jedna datoteka za svaku stavku izbornika "Ponuda"
  - postavke/*.json   -> kontakti, lokacije, radno vrijeme, podaci o tvrtki
  - dvorane/*.json    -> dvorane: naziv, opis, kapacitet i slike (jedini izvor za kartice, klizač,
                         preglednik slika i budući chatbot; vidi OdabirDvorane)
  - paketi/*.json     -> okvirni paketi i cijene
  - recenzije/*.json  -> iskustva mladenaca
  - faq/*.json        -> česta pitanja
  - navigacija/*.json -> redoslijed stranica ponude (izbornici i podnožje)
  - stranice/*.json   -> tekstovi naslovnice i stranice Vjenčanja (hero, uvod, kroz godinu, klizač...)
  - sekcije/*.json    -> samostalne sekcije stranica (jedna datoteka = jedna sekcija), npr.
                         sobe na Smještaju, "Za obitelji, vrtiće i škole" na Izletima, "Ljubav, žene i vino" na Proslavama
  - slike/slike.json  -> pojedinačne fotografije koje nisu dio nekog drugog unosa (hero naslovnice, fotografije uz
                         tekst, zadana slika za dijeljenje); zamjena = nova datoteka u src/assets/images/ + putanja ovdje
  Popis svih mjesta za fotografije: docs/popis-slika.md
*/

const novosti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/novosti' }),
  schema: ({ image }) =>
    z.object({
      naslov: z.string(),
      datum: z.coerce.date(),
      sazetak: z.string().max(200),
      naslovnica: image(),
      naslovnicaAlt: z.string(),
      kategorija: z.enum(['Vjenčanja', 'Catering', 'Događanja', 'Blagdani']),
      istaknuto: z.boolean().default(false),
    }),
});

const ponuda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ponuda' }),
  schema: ({ image }) =>
    z.object({
      naslov: z.string(),
      nazivIzbornik: z.string(),
      opisIzbornik: z.string().max(60),
      redoslijed: z.number(),
      seoNaslov: z.string().max(60),
      seoOpis: z.string().max(160),
      naslovnica: image().optional(),
      naslovnicaAlt: z.string().optional(),
      uvod: z.string(),
      galerija: z
        .array(z.object({ slika: image(), alt: z.string() }))
        .default([]),
    }),
});

const postavke = defineCollection({
  loader: file('./src/content/postavke/postavke.json'),
  schema: z.object({
    naziv: z.string(),
    slogan: z.string(),
    email: z.string(),
    telefon: z.string(),
    mobitel: z.string(),
    adresa: z.string(),
    /** Društvene mreže (dno podnožja): ikona = naziv SVG datoteke u src/assets/drustvene/; nova mreža = novi element + SVG */
    drustveneMreze: z.array(z.object({ naziv: z.string(), url: z.url(), ikona: z.string(), oznaka: z.string() })),
    tvrtka: z.object({
      naziv: z.string(),
      vlasnica: z.string(),
      oib: z.string(),
      pdv: z.string(),
      iban: z.string(),
    }),
    lokacije: z.array(
      z.object({
        naziv: z.string(),
        /** Kratka oznaka lokacije za data-location na tel: linkovima (klet, ribarska, barba, uprava) */
        oznaka: z.string(),
        adresa: z.string(),
        /** Adresa s poštanskim brojem, samo za link na kartu (kad nema kartaUrl ni koordinata) */
        adresaKarta: z.string().optional(),
        /** Postojeći Google Maps link za lokaciju; ima prednost pred koordinatama i adresom */
        kartaUrl: z.string().optional(),
        telefoni: z.array(z.string()),
        email: z.string().optional(),
        /**
         * Radno vrijeme lokacije, redak po redak; prvi redak je glavno radno vrijeme.
         * shema (engleski nazivi dana, od, do) = redak ulazi u schema.org openingHoursSpecification.
         * Vidi lib/radnoVrijeme.ts i RedakRadnogVremena.astro.
         */
        radnoVrijeme: z.array(
          z.object({
            dani: z.string(),
            vrijeme: z.string(),
            shema: z.object({ dani: z.array(z.string()), od: z.string(), do: z.string() }).optional(),
          }),
        ),
        koordinate: z.tuple([z.number(), z.number()]).optional(),
        /** false = lokacija se prikazuje samo u podnožju, ne i u popisu "Gdje smo" na stranici Kontakt */
        naKontaktu: z.boolean().default(true),
        /** Interna bilješka (npr. TODO: potvrditi s vlasnikom); ne prikazuje se */
        napomena: z.string().optional(),
      }),
    ),
  }),
});

// Polje potvrdeno: false označava primjer sadržaja koji klijent mora potvrditi.
// Na stranici se takav sadržaj prikazuje s oznakom Primjer (vidi DemoOznaka.astro).
const potvrda = {
  potvrdeno: z.boolean().default(false),
  napomena: z.string().optional(),
};

const dvorane = defineCollection({
  loader: file('./src/content/dvorane/dvorane.json'),
  schema: ({ image }) =>
    z.object({
      naziv: z.string(),
      opis: z.string(),
      /** Maksimalni broj gostiju; dvorana "odgovara" ako je broj gostiju <= kapacitet */
      kapacitet: z.number().int().positive(),
      /** Oznaka iznad kapaciteta, npr. "Kapacitet s okruglim stolovima"; bez nje se prikazuje samo "do N osoba" */
      oznakaKapaciteta: z.string().optional(),
      /** Fotografije za karticu i preglednik; prva je naslovna. Element bez src je placeholder (TODO-slika). */
      images: z.array(z.object({ src: image().optional(), alt: z.string() })).min(1),
      redoslijed: z.number(),
      ...potvrda,
    }),
});

const paketi = defineCollection({
  loader: file('./src/content/paketi/paketi.json'),
  schema: z.object({
    naziv: z.string(),
    cijenaOd: z.number().nullable(),
    jedinica: z.string(),
    istaknuto: z.boolean().default(false),
    stavke: z.array(z.string()),
    redoslijed: z.number(),
    ...potvrda,
  }),
});

const recenzije = defineCollection({
  loader: file('./src/content/recenzije/recenzije.json'),
  schema: z.object({
    citat: z.string(),
    imena: z.string(),
    datum: z.string(),
    dvorana: z.string().optional(),
    ...potvrda,
  }),
});

const faq = defineCollection({
  loader: file('./src/content/faq/faq.json'),
  schema: z.object({
    pitanje: z.string(),
    odgovor: z.string(),
    redoslijed: z.number(),
    ...potvrda,
  }),
});

// Samostalne sekcije: naslov (+ opcionalni istaknuti dio u kurzivu), odlomci, stavke s ikonom i fotografija.
// Svaka sekcija ima svoju komponentu, pa se uklanja brisanjem jednog importa.
const sekcije = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/sekcije' }),
  schema: ({ image }) =>
    z.object({
      /** Mali redak iznad naslova (npr. "Tradicija koja okuplja") */
      nadnaslov: z.string().optional(),
      naslov: z.string(),
      naslovIstaknuto: z.string().optional(),
      odlomci: z.array(z.string()).default([]),
      stavke: z
        .array(
          z.object({
            ikona: z.string().optional(),
            naslov: z.string(),
            opis: z.string().optional(),
            /** Oznaka za potvrdu uz stavku (DemoOznaka), npr. "Potvrditi kapacitet" */
            oznaka: z.string().optional(),
          }),
        )
        .default([]),
      slika: image().optional(),
      alt: z.string().optional(),
      /** Galerija sekcije (npr. fotografije soba u smjestaj-sobe.json); prazna = na stranici se prikazuje okvir TODO-slika */
      galerija: z.array(z.object({ slika: image(), alt: z.string() })).default([]),
      /** Samo proslave-dvorane.json: prikazati klizač "Koliko gostiju" iznad kartica dvorana (false = samo kartice) */
      prikaziKlizacGostiju: z.boolean().optional(),
    }),
});

// Redoslijed stranica ponude: jedan izvor za padajući izbornik, mobilni izbornik i podnožje (lib/navigacija.ts)
const navigacija = defineCollection({
  loader: file('./src/content/navigacija/navigacija.json'),
  schema: z.object({
    /** Glavna navigacija (zaglavlje i mobilni izbornik), redom; izbornik: true = padajući izbornik "Ponuda" */
    glavna: z.array(z.object({ tekst: z.string(), href: z.string().optional(), izbornik: z.boolean().default(false) })),
    stranice: z.array(reference('ponuda')),
    /** Linkovi u stupcu "Stranice" u podnožju ispod stranica ponude */
    podnozjeDodatno: z.array(z.object({ tekst: z.string(), href: z.string() })),
  }),
});

// Tekstovi pojedinih stranica koji nisu u ponuda/*.md (jedan JSON po stranici, za budući urednički panel)
const stranicaPocetna = defineCollection({
  loader: file('./src/content/stranice/pocetna.json'),
  schema: z.object({
    hero: z.object({ nadnaslov: z.string(), naslov: z.string(), naslovIstaknuto: z.string(), podnaslov: z.string() }),
    uvod: z.object({
      naslov: z.string(),
      tekst: z.string(),
      brojke: z.array(z.object({ oznaka: z.string(), vrijednost: z.string() })),
      napomena: z.string().optional(),
    }),
    godina: z.object({
      naslov: z.string(),
      podnaslov: z.string(),
      dogadanja: z.array(z.object({ kada: z.string(), naslov: z.string(), opis: z.string() })),
    }),
    priroda: z.object({ naslov: z.string(), tekst: z.string(), poveznica: z.object({ tekst: z.string(), href: z.string() }) }),
    dolazak: z.object({ naslov: z.string(), tekst: z.string() }),
  }),
});

const stranicaVjencanja = defineCollection({
  loader: file('./src/content/stranice/vjencanja.json'),
  schema: z.object({
    heroPodnaslov: z.string(),
    ukljuceno: z.object({
      naslov: z.string(),
      skupine: z.array(z.object({ naslov: z.string(), ikona: z.string(), stavke: z.array(z.string()) })),
    }),
    odabir: z.object({ naslov: z.string(), podnaslov: z.string(), oznakaPrimjer: z.string(), napomenaSpajanje: z.string() }),
  }),
});

// Pojedinačne fotografije stranica (id = mjesto na stranici, npr. pocetna-hero); čita ih lib/slike.ts.
// stranica i mjesto su opis za urednika/panel, ne prikazuju se.
const slike = defineCollection({
  loader: file('./src/content/slike/slike.json'),
  schema: ({ image }) =>
    z.object({
      stranica: z.string(),
      mjesto: z.string(),
      /** Putanja relativna na ovu JSON datoteku, npr. ../../assets/images/pocetna/klet-zgrada.jpg */
      slika: image(),
      alt: z.string(),
      /** Interna bilješka (npr. ZAMIJENITI PRIJE LAUNCHA); ne prikazuje se */
      napomena: z.string().optional(),
    }),
});

// Dokumenti za preuzimanje (jelovnici, brošure): datoteka u public/dokumenti/, gumb na stranici iz polja stranica
const dokumenti = defineCollection({
  loader: file('./src/content/dokumenti/dokumenti.json'),
  schema: z.object({
    naziv: z.string(),
    /** Putanja od korijena stranice, npr. /dokumenti/a-la-carte-jelovnik.pdf (datoteka u public/) */
    putanja: z.string().startsWith('/dokumenti/'),
    /** id stranice iz ponuda/ na kojoj se prikazuje gumb */
    stranica: reference('ponuda'),
    tekstGumba: z.string(),
    /** Veličina za evidenciju (panel, chatbot), npr. "10,7 MB"; na stranici se prikazuje veličina izračunata iz datoteke */
    velicina: z.string().optional(),
    opis: z.string().optional(),
    /** Izvorna datoteka koju je dostavio klijent (samo za evidenciju) */
    izvor: z.string().optional(),
  }),
});

export const collections = { novosti, ponuda, postavke, dvorane, paketi, recenzije, faq, sekcije, stranicaPocetna, stranicaVjencanja, navigacija, dokumenti, slike };
