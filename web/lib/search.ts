/** Normalisation pour la recherche : minuscules, sans accents, apostrophes unifiées. */
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘`]/g, "'").toLowerCase();
