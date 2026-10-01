import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/*
  Sav urednički sadržaj živi u src/content i strukturiran je tako da ga
  Decap CMS ili Keystatic mogu uređivati bez promjene koda:
  - novosti/*.md      -> objave (Novosti i događanja)
  - ponuda/*.md       -> po jedna datoteka za svaku stavku izbornika "Ponuda"
  - postavke/*.json   -> kontakti, lokacije, radno vrijeme, podaci o tvrtki
  - dvorane/*.json    -> dvorane s kapacitetima (koristi komponenta OdabirDvorane)
  - paketi/*.json     -> okvirni paketi i cijene
  - recenzije/*.json  -> iskustva mladenaca
  - faq/*.json        -> česta pitanja
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
    kartaUrl: z.string(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
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
        adresa: z.string(),
        telefoni: z.array(z.string()),
        email: z.string().optional(),
        radnoVrijeme: z.array(z.string()),
        koordinate: z.tuple([z.number(), z.number()]).optional(),
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
      min: z.number().int().positive(),
      max: z.number().int().positive(),
      konfiguracije: z.array(z.object({ tip: z.string(), gosti: z.number().int() })),
      slika: image(),
      alt: z.string(),
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

export const collections = { novosti, ponuda, postavke, dvorane, paketi, recenzije, faq };
