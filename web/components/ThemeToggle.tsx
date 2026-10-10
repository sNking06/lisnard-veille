"use client";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** Bascule clair/sombre. Le thème initial est posé avant le rendu par le script inline du layout (pas de flash). */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try { if (localStorage.getItem("theme")) return; } catch { /* stockage indisponible */ }
      const t: Theme = e.matches ? "dark" : "light";
      root.dataset.theme = t;
      setTheme(t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* stockage indisponible */ }
    setTheme(next);
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-pressed={theme === null ? undefined : theme === "dark"}
      title="Basculer entre thème clair et thème sombre">
      <svg className="i-moon" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M16.5 12.3A7 7 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <svg className="i-sun" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 1.8v2.1M10 16.1v2.1M1.8 10h2.1M16.1 10h2.1M4.2 4.2l1.5 1.5M14.3 14.3l1.5 1.5M4.2 15.8l1.5-1.5M14.3 5.7l1.5-1.5"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="sr-only">Thème sombre</span>
    </button>
  );
}
