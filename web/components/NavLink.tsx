"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const path = usePathname();
  const current = path === href || path === `${href}/` || path === `${href}.html`;
  return <Link href={href} aria-current={current ? "page" : undefined}>{children}</Link>;
}
