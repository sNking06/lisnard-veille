import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_TITLE } from "@/lib/site";

/** En-tête collant de la colonne : bandeau d'avertissement permanent, titre de page, onglets éventuels. */
export default function ColumnHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="col-head">
      <p className="notice" role="note">
        <span className="ai-tag" aria-hidden="true">IA</span>
        <span>Veille indépendante, analyse générée par IA, peut contenir des erreurs.</span>
      </p>
      <div className="col-title">
        <Link href="/" className="col-brand" aria-label={`${SITE_TITLE}, accueil`}>
          <span className="mark" aria-hidden="true">VL</span>
        </Link>
        <h1 id="titre">{title}</h1>
      </div>
      {children}
    </div>
  );
}
