import { animate, hover, inView, stagger } from 'motion';

/*
  Globalni sloj pokreta (Motion, motion.dev):
  - hero (tekst i zoom fotografije) animira CSS u global.css, da ne čeka JS
  - [data-reveal]          fade-in pri ulasku u viewport
  - [data-reveal-grupa]    djeca s [data-reveal] ulaze redom (stagger)
  - [data-kartica]         suptilan hover: slika se lagano približi, strelica pomakne
  Sve se isključuje uz prefers-reduced-motion.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const smanjeno = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function otkrivanje() {
  // Grupe: djeca ulaze redom
  document.querySelectorAll<HTMLElement>('[data-reveal-grupa]').forEach((grupa) => {
    const djeca = grupa.querySelectorAll<HTMLElement>(':scope [data-reveal]');
    djeca.forEach((d) => (d.dataset.uGrupi = ''));
    inView(
      grupa,
      () => {
        animate(djeca, { opacity: 1, y: 0 }, { duration: 0.8, delay: stagger(0.09), ease: EASE });
      },
      { amount: 0.15 },
    );
  });

  // Pojedinačni elementi
  document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-u-grupi])').forEach((el) => {
    inView(
      el,
      () => {
        animate(el, { opacity: 1, y: 0 }, { duration: 0.9, ease: EASE });
      },
      { amount: 0.2 },
    );
  });
}

function kartice() {
  hover('[data-kartica]', (kartica) => {
    const slika = kartica.querySelector('[data-kartica-slika]');
    const strelica = kartica.querySelector('[data-kartica-strelica]');
    if (slika) animate(slika, { scale: 1.045 }, { duration: 0.8, ease: EASE });
    if (strelica) animate(strelica, { x: 6 }, { type: 'spring', stiffness: 300, damping: 20 });
    return () => {
      if (slika) animate(slika, { scale: 1 }, { duration: 0.8, ease: EASE });
      if (strelica) animate(strelica, { x: 0 }, { type: 'spring', stiffness: 300, damping: 20 });
    };
  });
}

// Pokreće se kad se glavna nit oslobodi, da postavljanje promatrača ne
// konkurira prvom iscrtavanju (LCP) na sporijim mobitelima
const kadBudeSlobodno = (fn: () => void) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200);

if (!smanjeno) {
  kadBudeSlobodno(() => {
    otkrivanje();
    kartice();
  });
}
