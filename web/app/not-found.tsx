import Link from "next/link";
import ColumnHeader from "@/components/ColumnHeader";

export default function NotFound() {
  return (
    <>
      <ColumnHeader title="Page introuvable" />
      <section className="intro" aria-labelledby="intro-titre">
        <p className="kicker">Erreur 404</p>
        <h2 id="intro-titre" className="display">Adresse inconnue</h2>
        <p className="lede">Cette adresse ne correspond à aucune page du site.</p>
        <p className="intro-links"><Link href="/" className="btn btn-primary">Retour au fil des publications</Link></p>
      </section>
    </>
  );
}
