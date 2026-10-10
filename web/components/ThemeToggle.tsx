"use client";
import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "./Icons";

type Theme = "light" | "dark";

/**
 * Bascule clair/sombre (préférence système par défaut, clair sans JavaScript). Le thème initial est posé avant le rendu par le script inline
 * du layout (pas de flash) ; plusieurs boutons (rail, barre mobile) restent synchronisés via data-theme.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
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
