/** Export statique : le site est reconstruit à chaque nouvelle publication (workflow GitHub Actions / Vercel). */
export default {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
