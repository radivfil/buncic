# Fotografije: stanje i popis snimanja

> **ZAMIJENITI PRIJE LAUNCHA.** Nijedna fotografija na stranici nije profesionalna.
> Sve su snimke mobitelom klijenta, preuzete s postojeće stranice buncic.hr ili iz
> Web Archivea stare stranice (2015.-2022.). Stock fotografije tuđih prostora
> namjerno nisu korištene: na demo stranici za vlasnika imanja izgledale bi kao
> tuđe imanje i narušile povjerenje.

## Registar (src/assets/images)

Oznake stanja: **P** = privremeno, upotrebljivo za demo · **Z** = zamijeniti obavezno (niska rezolucija ili loše svjetlo)

| Datoteka | Px | Izvor | Stanje | Gdje se koristi |
| --- | --- | --- | --- | --- |
| pocetna/hero-mladenci-sjenica.jpg | 960×720 | buncic.hr | **Z** (hero, mekan na velikim ekranima) | Početna, hero |
| pocetna/klet-zgrada.jpg | 1600×901 | buncic.hr | P | Početna, Kontakt |
| vjencanja/prvi-ples.jpg | 960×720 | buncic.hr | **Z** (hero) | Vjenčanja, hero |
| vjencanja/ples-oblak.jpg | 960×720 | buncic.hr | Z | Vjenčanja, galerija |
| vjencanja/vatromet-ples.jpg | 1362×1081 | buncic.hr | P | Vjenčanja |
| vjencanja/cvjetno-stablo.jpg | 1336×2008 | buncic.hr | P | Vjenčanja, pismo mladencima |
| vjencanja/love-stol.jpg | 2000×1500 | buncic.hr | P | Vjenčanja, galerija |
| vjencanja/obred-vani.jpg | 2000×1500 | buncic.hr | P | Vjenčanja, galerija |
| vjencanja/dugi-stol.jpg | 960×540 | buncic.hr | Z | Vjenčanja, galerija |
| dvorane/grede-svjetla.jpg | 2400×1350* | arhiva | P | Odabir dvorane |
| dvorane/velika-dvorana.jpg | 2400×1800* | arhiva | P | Odabir dvorane, Proslave |
| dvorane/svijecnjaci.jpg | 2400×1350* | arhiva | P | Vjenčanja, traka preko cijele širine |
| dvorane/drveni-stupovi.jpg | 2000×1440* | arhiva | P (boce na stolovima) | Vjenčanja, galerija |
| restoran/podrum-svodovi.jpg | 1500×1125 | buncic.hr | P (topla korekcija boja, izvorno plavi LED) | Restoran hero, Odabir dvorane |
| restoran/kamin.jpg | 1500×1125 | buncic.hr | P (topla korekcija, izvorno ljubičasti LED) | Restoran |
| restoran/blagovaonica.jpg, terasa.jpg | 1500×1125 | buncic.hr | P | Restoran |
| hrana/hladna-plata.jpg, slatki-stol.jpg, kolaci.jpg | 2400×1350* | arhiva | P | Catering, Proslave |
| catering/finger-food.jpg | 1080×635 | Instagram objava (obrezan tekst) | P | Catering hero |
| catering/terasa-buffet.jpg | 1500×1125 | buncic.hr | P | Catering |
| proslave/sala-postavljena.jpg | 1500×1125 | buncic.hr | P | Proslave hero |
| proslave/sala-nova.jpg | 960×720 | buncic.hr | Z | Proslave |
| imanje/* (6 fotografija) | 1920-2400* | arhiva | P | Smještaj, Proslave, Početna |
| smjestaj/konji.jpg | 960×640 | buncic.hr | Z | Smještaj |
| smjestaj/igraliste.jpg | 2000×1125 | buncic.hr | P | Smještaj |
| koliba/* (5 fotografija) | ~960×640 | arhiva 2015. | **Z** (jedine fotografije kolibe) | Ribarska koliba |
| novosti/* | razno | buncic.hr (plakati) | P | Novosti |

\* Nominalna rezolucija: snimke mobitelom povećane na 2560 px na staroj stranici, pa nisu stvarno oštre.

Fotografije s ljubičastim / plavim LED svjetlom uklonjene su (dvorana s crvenom rasvjetom) ili toplo korigirane (podrum, kamin).

## Što klijent mora dostaviti (profesionalno snimanje)

Minimalno 2400 px širine, prirodno ili toplo scensko svjetlo, **bez ljubičaste i plave LED rasvjete**, bez boca i ambalaže na stolovima.

1. **Dvorane**: svaka dvorana iz najmanje 3 kuta, prazna i postavljena (okrugli stolovi, dugi stolovi), plus jedna "prazan prostor" snimka za prikaz kapaciteta.
2. **Hero kadrovi**: 2-3 širokokutne atmosferske snimke (imanje u zlatnom satu, dvorana u večernjem svjetlu, terasa kolibe na jezeru).
3. **Detalji stolova**: postavljen stol, cvjetni aranžman, stol s rasporedom sjedenja (escort cards), torta, slatki stol.
4. **Hrana**: 6-10 jela iz jelovnika (Juha "Klet Bunčić", Juneći file "Sveti Martin", Sablja "Veseli lovac", ražanj, fiš paprikaš, plata "Jezero"), svaka zasebno i u kadru s ljudskom rukom.
5. **Sobe**: svaki tip sobe (1, 2, 3, 4 kreveta, depandansa) i kupaonica. **Trenutno ne postoji nijedna upotrebljiva fotografija soba.**
6. **Exterijer / dvorište**: pročelje Kleti, sjenice, bunar, voćnjak, igralište, konji, stara drvena kuća.
7. **Ribarska koliba**: jezero, terasa, unutrašnjost, igralište, ražanj.
8. **Vjenčanja (uz dopuštenje mladenaca)**: 10-15 najboljih fotografija od vjenčanih fotografa koji su radili na imanju.

## Kako zamijeniti

Nova fotografija ide u istu mapu pod istim imenom (ili se promijeni putanja u `src/content/**` / stranici). Astro sam generira AVIF/WebP u svim veličinama; nije potrebna ručna optimizacija. Nakon zamjene obrisati komentar `ZAMIJENITI PRIJE LAUNCHA` u pripadnoj datoteci.
