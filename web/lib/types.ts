export type Verdict = "faisable" | "faisable_sous_conditions" | "difficilement_faisable";
export interface Proposition {
  texte: string; cout: string; cadre_juridique: string; competence: string; precedents: string;
  verdict: Verdict; conditions: string[]; fiabilite?: "haute" | "moyenne" | "faible"; doutes?: string;
}
export interface Analyse {
  id: string; date: string; source: "x" | "tiktok" | "site"; lien: string; titre?: string; statut: "ok" | "degraded";
  integration?: { type: "x" | "tiktok" | "none"; id: string };
  resume: string; base_du_resume?: string; citations?: string[]; analyse_realisee?: boolean;
  propositions: Proposition[]; sources: { titre: string; url: string; consulte_le?: string }[];
  avertissement: string; genere_le?: string; genere_par?: string; notes?: string;
}
export const VERDICTS: Record<Verdict, { label: string; symbole: string }> = {
  faisable: { label: "Faisable", symbole: "●●●" },
  faisable_sous_conditions: { label: "Faisable sous conditions", symbole: "●●○" },
  difficilement_faisable: { label: "Difficilement faisable", symbole: "●○○" },
};
