import Link from "next/link";
import ColumnHeader from "@/components/ColumnHeader";

export default function NotFound() {
  return (
    <>
      <ColumnHeader title="Page introuvable" />
      <section className="intro" aria-label="Erreur 404">
        <p className="intro-kicker">Erreur 404</p>
        <p className="lede">Cette adresse ne correspond à aucune page du site.</p>
        <p className="intro-links"><Link href="/" className="btn btn-primary">Retour au fil des publications</Link></p>
      </section>
    </>
  );
}
