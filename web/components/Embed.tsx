"use client";
import { useEffect, useRef, useState } from "react";

// Lecteurs officiels (iframes X / TikTok) affichés d'emblée, sans lecture automatique :
// aucun paramètre autoplay, l'utilisateur appuie sur lecture. Montage différé (IntersectionObserver
// + loading="lazy") pour ne pas alourdir la page ; hauteur réservée pour éviter les sauts de mise en page.
export default function Embed({ type, id, lien }: { type: "x" | "tiktok"; id: string; lien: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setVisible(true); io.disconnect(); }
    }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || loaded) return;
    const t = setTimeout(() => setFailed(true), 15000);
    return () => clearTimeout(t);
  }, [visible, loaded]);

  const nom = type === "x" ? "X" : "TikTok";
  const src = type === "x"
    ? `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(id)}&dnt=true&lang=fr&theme=${theme}`
    : `https://www.tiktok.com/embed/v2/${encodeURIComponent(id)}`;

  return (
    <div className="embed-wrap">
      <div ref={box} className={`embed embed-${type}`}>
        {visible && !failed && (
          <iframe
            key={src}
            src={src}
            title={`Lecteur officiel ${nom}`}
            loading="lazy"
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
        {(!visible || (!loaded && !failed)) && <span className="embed-ph" aria-hidden="true">Chargement du lecteur {nom}…</span>}
        {failed && (
          <p className="embed-fail">
            Le lecteur {nom} n’a pas pu se charger. <a href={lien} target="_blank" rel="noopener noreferrer">Voir la publication d’origine</a>
          </p>
        )}
      </div>
      <a className="embed-orig" href={lien} target="_blank" rel="noopener noreferrer">Voir la publication d’origine sur {nom}</a>
    </div>
  );
}
