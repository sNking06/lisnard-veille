export type Verdict = "faisable" | "faisable_sous_conditions" | "difficilement_faisable";
export type Source = "x" | "tiktok" | "site" | "youtube";
export interface Proposition {
  texte: string; cout: string; cadre_juridique: string; competence: string; precedents: string;
  verdict: Verdict; conditions: string[]; fiabilite?: "haute" | "moyenne" | "faible"; doutes?: string;
}
export interface Analyse {
  id: string; date: string; source: Source; lien: string; titre?: string; statut: "ok" | "degraded";
  integration?: { type: "x" | "tiktok" | "youtube" | "none"; id: string };
  resume: string; base_du_resume?: string; citations?: string[]; analyse_realisee?: boolean; analyse_ia?: boolean;
  propositions: Proposition[]; sources: { titre: string; url: string; consulte_le?: string }[];
  avertissement: string; genere_le?: string; genere_par?: string; notes?: string;
}
/** Verdicts différenciés par la forme (points pleins/vides) et le libellé, jamais par une couleur. */
export const VERDICTS: Record<Verdict, { label: string; symbole: string; niveau: 1 | 2 | 3 }> = {
  faisable: { label: "Faisable", symbole: "●●●", niveau: 3 },
  faisable_sous_conditions: { label: "Faisable sous conditions", symbole: "●●○", niveau: 2 },
  difficilement_faisable: { label: "Difficilement faisable", symbole: "●○○", niveau: 1 },
};
