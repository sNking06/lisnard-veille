"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

const isCurrent = (path: string | null, href: string) =>
  path === href || path === `${href}/` || path === `${href}.html` || (href === "/" && path === "/index.html");

export default function NavLink({ href, className, title, children }: { href: string; className?: string; title?: string; children: ReactNode }) {
  const path = usePathname();
  return <Link href={href} className={className} title={title} aria-current={isCurrent(path, href) ? "page" : undefined}>{children}</Link>;
}

/** Lien « Recherche » : sur le fil, place directement le focus dans le champ ; ailleurs, ouvre le fil sur la recherche. */
export function SearchLink({ className, title, children }: { className?: string; title?: string; children: ReactNode }) {
  const path = usePathname();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isCurrent(path, "/")) return;
    const q = document.getElementById("q");
    if (!q) return;
    e.preventDefault();
    q.focus({ preventScroll: true });
    q.scrollIntoView({ block: "center" });
  };
  return <Link href="/#recherche" className={className} title={title} onClick={onClick}>{children}</Link>;
}
