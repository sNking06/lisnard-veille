"use client";
import { useEffect } from "react";

/**
 * Publie la hauteur réelle de l'en-tête collant (--head-h) : le bandeau peut passer sur 2 ou 3 lignes
 * en petit écran, et les ancres comme le focus clavier ne doivent jamais se retrouver dessous.
 */
export default function StickyOffset() {
  useEffect(() => {
    const head = document.querySelector<HTMLElement>(".col-head");
    if (!head || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const set = () => root.style.setProperty("--head-h", `${Math.ceil(head.getBoundingClientRect().height)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(head);
    return () => { ro.disconnect(); root.style.removeProperty("--head-h"); };
  }, []);
  return null;
}
