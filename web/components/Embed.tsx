"use client";
import { useEffect, useRef, useState } from "react";

// Lecteurs officiels uniquement, chargés au clic (aucun script tiers avant consentement de l'utilisateur).
export default function Embed({ type, id, lien }: { type: "x" | "tiktok"; id: string; lien: string }) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!on || !ref.current) return;
    const s = document.createElement("script");
    s.async = true;
    if (type === "x") {
      s.src = "https://platform.twitter.com/widgets.js";
      s.onload = () => (window as any).twttr?.widgets?.load(ref.current);
    } else {
      s.src = "https://www.tiktok.com/embed.js";
    }
    document.body.appendChild(s);
  }, [on, type]);
  if (!on) {
    return (
      <div className="embed-gate">
        <button type="button" className="btn btn-quiet embed-btn" onClick={() => setOn(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M5 3.5v9l7-4.5z" fill="currentColor" />
          </svg>
          <span>Afficher le lecteur officiel {type === "x" ? "X" : "TikTok"}</span>
        </button>
        <span className="embed-note">Charge un contenu tiers ({type === "x" ? "x.com" : "tiktok.com"}) au clic uniquement.</span>
      </div>
    );
  }
  return (
    <div ref={ref} className="embed">
      {type === "x" ? (
        <blockquote className="twitter-tweet" data-dnt="true"><a href={lien.replace("x.com", "twitter.com")}>Publication X</a></blockquote>
      ) : (
        <blockquote className="tiktok-embed" cite={lien} data-video-id={id} style={{ maxWidth: 605, minWidth: 325 }}>
          <section><a href={lien}>Vidéo TikTok</a></section>
        </blockquote>
      )}
    </div>
  );
}
