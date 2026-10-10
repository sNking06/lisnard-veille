import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero hero-compact">
      <div className="container">
        <p className="kicker">Erreur 404</p>
        <h1>Page introuvable</h1>
        <p className="lede">Cette adresse ne correspond à aucune page du site.</p>
        <p className="hero-links"><Link href="/" className="btn btn-quiet">Retour au fil des publications</Link></p>
      </div>
    </section>
  );
}
