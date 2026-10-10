"use client";
import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "./Icons";

type Theme = "light" | "dark";

const THEME_COLOR: Record<Theme, string> = { dark: "#0f1450", light: "#fbfbfd" };

/**
 * Bascule clair/sombre (sombre par défaut, y compris sans JavaScript ; le choix enregistré prime). Le thème initial est posé avant le rendu
 * par le script inline du layout (pas de flash) ; plusieurs boutons (rail, barre mobile) restent synchronisés via data-theme, et la balise
 * theme-color suit le thème appliqué.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const t: Theme = root.dataset.theme === "light" ? "light" : "dark";
      setTheme(t);
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[t]);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const next: Theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* stockage indisponible */ }
  };

  return (
    <button type="button" className={className} onClick={toggle} aria-pressed={theme === null ? undefined : theme === "dark"}
      title="Basculer entre thème sombre et thème clair">
      <span className="nav-icon">
        <IconMoon className="i-moon" />
        <IconSun className="i-sun" />
      </span>
      <span className="nav-label">Thème<span className="sr-only"> sombre</span></span>
    </button>
  );
}
