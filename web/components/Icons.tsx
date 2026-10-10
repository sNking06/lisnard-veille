import type { ReactNode } from "react";
import type { Source } from "@/lib/types";

// Pictogrammes génériques au trait (aucun logo de réseau ni de marque).
function Svg({ size = 22, className, children }: { size?: number; className?: string; children: ReactNode }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

type P = { size?: number; className?: string };

export const IconHome = (p: P) => <Svg {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></Svg>;
export const IconSearch = (p: P) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Svg>;
export const IconDoc = (p: P) => <Svg {...p}><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Svg>;
export const IconScale = (p: P) => <Svg {...p}><path d="M12 4v16M8 20h8M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" /></Svg>;
export const IconCode = (p: P) => <Svg {...p}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></Svg>;
export const IconMoon = (p: P) => <Svg {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></Svg>;
export const IconSun = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
export const IconExternal = (p: P) => <Svg {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Svg>;
export const IconFlag = (p: P) => <Svg {...p}><path d="M5 21V4h11l-2 4 2 4H5" /></Svg>;

/** Avatar neutre : pictogramme du type de publication (bulle, vidéo, page web). */
export function NetIcon({ source, size = 20 }: { source: Source; size?: number }) {
  if (source === "x") return <Svg size={size}><path d="M4 5h16v11H9l-5 4z" /></Svg>;
  if (source === "tiktok") return <Svg size={size}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M10 8.5v7l6-3.5z" /></Svg>;
  return <Svg size={size}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></Svg>;
}
