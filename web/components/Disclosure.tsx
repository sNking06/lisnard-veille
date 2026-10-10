"use client";
import { useState, type ReactNode } from "react";

/** Bouton dépliant accessible : le panneau est rendu côté serveur et seulement masqué (hidden). */
export default function Disclosure({ id, label, openLabel, children }: { id: string; label: string; openLabel: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="disclosure">
      <button type="button" className="btn disclosure-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span>{open ? openLabel : label}</span>
        <svg className="chev" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={id} className="disclosure-panel" hidden={!open}>{children}</div>
    </div>
  );
}
