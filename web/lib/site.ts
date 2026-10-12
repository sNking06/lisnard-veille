import type { Source } from "./types";

export const REPO = "https://github.com/sNking06/lisnard-veille";
export const SITE_TITLE = "Publications officielles, résumées et analysées";
export const ISSUE_URL = `${REPO}/issues/new?labels=erreur`;

export const NETWORKS: Record<Source, { label: string; long: string }> = {
  x: { label: "X", long: "Publication X" },
  tiktok: { label: "TikTok", long: "Vidéo TikTok" },
  youtube: { label: "YouTube", long: "Vidéo YouTube" },
  site: { label: "Site", long: "Article du site Nouvelle Énergie" },
};

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" });
export const fmtDate = (d: string) => DATE_FMT.format(new Date(d));

export const CONTACT_EMAIL = "snking@mail.grokbot.com";
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contact")}`;
