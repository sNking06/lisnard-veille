import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_TITLE } from "@/lib/site";
import StickyOffset from "./StickyOffset";

/** En-tête collant de la colonne : bandeau permanent (IA, non-affiliation), titre de page, onglets éventuels. */
export default function ColumnHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="col-head">
      <p className="notice" role="note">
        <span className="ai-tag" aria-hidden="true">IA</span>
        <span className="notice-text">
          Veille indépendante, analyse générée par IA, peut contenir des erreurs.{" "}
          <strong>
            Site indépendant, non affilié à David Lisnard ni à Nouvelle Énergie — ce n&apos;est PAS le site officiel
            de la campagne ni du mouvement.
          </strong>
        </span>
      </p>
      <div className="col-title">
        <Link href="/" className="col-brand" aria-label={`${SITE_TITLE}, accueil`}>
          <span className="mark" aria-hidden="true">VL</span>
        </Link>
        <h1 id="titre">{title}</h1>
      </div>
      {children}
      <StickyOffset />
    </div>
  );
}
