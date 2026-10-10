"use client";
import { useEffect, useRef, useState } from "react";

// Lecteurs officiels (iframes X / TikTok) affichés d'emblée, sans lecture automatique.
// TikTok : player v1 compact (9:16, sans bandeau ni légende, autoplay=0).
// X : Tweet.html redimensionné à sa hauteur réelle via le message postMessage « twttr.private.resize ».
// Montage différé (IntersectionObserver + loading="lazy") ; message de repli après 15 s.
// Le lien vers l'original est porté une seule fois, par la barre d'actions du post (Card.tsx).
const TIKTOK_PARAMS =
  "autoplay=0&loop=0&music_info=0&description=0&rel=0&native_context_menu=0&closed_captions_display=0" +
  "&progress_bar=1&play_button=1&volume_control=1&fullscreen_button=1&timestamp=0";
const X_ORIGIN = "https://platform.twitter.com";
const X_INITIAL_HEIGHT = 200;

export default function Embed({ type, id }: { type: "x" | "tiktok"; id: string }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [height, setHeight] = useState(X_INITIAL_HEIGHT);

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

  // X : ajuste la hauteur de l'iframe à celle du tweet rendu (aucun vide, aucune barre de défilement).
  useEffect(() => {
    if (type !== "x") return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== X_ORIGIN || !frame.current || e.source !== frame.current.contentWindow) return;
      let data: unknown = e.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { return; }
      }
      const embed = (data as Record<string, unknown> | null)?.["twttr.embed"] as
        { method?: string; params?: Array<{ height?: number | string }> } | undefined;
      if (embed?.method !== "twttr.private.resize") return;
      const h = Math.ceil(Number(embed.params?.[0]?.height));
      if (Number.isFinite(h) && h > 0) { setHeight(h); setLoaded(true); }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [type]);

  const nom = type === "x" ? "X" : "TikTok";
  const sid = encodeURIComponent(id);
  const src = type === "x"
    ? `${X_ORIGIN}/embed/Tweet.html?id=${sid}&dnt=true&lang=fr&theme=${theme}&embedId=twitter-widget-${sid}`
    : `https://www.tiktok.com/player/v1/${sid}?${TIKTOK_PARAMS}`;

  return (
    <div className="embed-wrap">
      <div ref={box} className={`embed embed-${type}${failed ? " embed-failed" : ""}`}>
        {visible && !failed && (
          <iframe
            key={src}
            ref={frame}
            src={src}
            title={`Lecteur officiel ${nom}`}
            loading="lazy"
            scrolling="no"
            style={type === "x" ? { height: `${height}px` } : undefined}
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
            Le lecteur {nom} n’a pas pu se charger : utilisez le lien « Voir la publication d’origine » ci-dessous.
          </p>
        )}
      </div>
    </div>
  );
}
