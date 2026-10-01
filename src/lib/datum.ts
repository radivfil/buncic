const format = new Intl.DateTimeFormat('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' });

/** "26. ožujka 2026." preko Intl.DateTimeFormat (hrvatski genitiv mjeseca) */
export function formatirajDatum(d: Date): string {
  return format.format(d);
}
