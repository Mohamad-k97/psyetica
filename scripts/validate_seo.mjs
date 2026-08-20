import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const webRoot = join(root, "android-app", "app", "src", "main", "assets", "www");
const pages = [
  { code: "it", file: "index.html", path: "/", htmlLang: "it", dir: "ltr" },
  { code: "en", file: "en/index.html", path: "/en/", htmlLang: "en-GB", dir: "ltr" },
  { code: "es", file: "es/index.html", path: "/es/", htmlLang: "es", dir: "ltr" },
  { code: "ro", file: "ro/index.html", path: "/ro/", htmlLang: "ro", dir: "ltr" },
  { code: "sq", file: "sq/index.html", path: "/sq/", htmlLang: "sq", dir: "ltr" },
  { code: "ar", file: "ar/index.html", path: "/ar/", htmlLang: "ar-EG", dir: "rtl" },
  { code: "fa", file: "fa/index.html", path: "/fa/", htmlLang: "fa-IR", dir: "rtl" }
];

const assert = (condition, message) => { if (!condition) throw new Error(message); };

for (const page of pages) {
  const html = await readFile(join(webRoot, page.file), "utf8");
  assert(html.includes(`<html lang="${page.htmlLang}" dir="${page.dir}">`), `${page.file}: incorrect language or direction`);
  assert(html.includes(`<link rel="canonical" id="canonicalLink" href="https://psyetica.app${page.path}">`), `${page.file}: incorrect canonical`);
  assert((html.match(/rel="alternate" hreflang=/g) || []).length === 8, `${page.file}: incomplete hreflang cluster`);
  assert(html.includes('hreflang="x-default" href="https://psyetica.app/"'), `${page.file}: missing x-default`);
  assert(/<title>[^<]+\| PsyEtica<\/title>/.test(html), `${page.file}: weak or missing title`);
  assert(/<meta name="description"[^>]+content="[^"]{80,}"/.test(html), `${page.file}: missing description`);
  assert(/<h1>[^<]+<\/h1>/.test(html), `${page.file}: missing visible h1`);
  assert(html.includes('name="robots" content="index,follow'), `${page.file}: missing index directive`);
  assert(html.includes('class="seo-language-links"'), `${page.file}: missing crawlable language links`);
  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)?.[1];
  assert(jsonLd, `${page.file}: missing JSON-LD`);
  const graph = JSON.parse(jsonLd);
  assert(graph["@graph"]?.some(item => item["@type"] === "WebSite"), `${page.file}: missing WebSite schema`);
  assert(graph["@graph"]?.some(item => item["@type"] === "WebApplication"), `${page.file}: missing WebApplication schema`);
}

for (const relative of ["app.js", "styles.css", "manifest.webmanifest", "service-worker.js", "robots.txt", "sitemap.xml", "icons/icon-512.png"]) {
  await access(join(webRoot, relative));
}

const sitemap = await readFile(join(webRoot, "sitemap.xml"), "utf8");
assert((sitemap.match(/<url>/g) || []).length === pages.length, "sitemap.xml: incorrect URL count");
assert((sitemap.match(/hreflang="x-default"/g) || []).length === pages.length, "sitemap.xml: incomplete x-default alternates");
for (const page of pages) assert(sitemap.includes(`<loc>https://psyetica.app${page.path}</loc>`), `sitemap.xml: missing ${page.path}`);

const robots = await readFile(join(webRoot, "robots.txt"), "utf8");
assert(robots.includes("Sitemap: https://psyetica.app/sitemap.xml"), "robots.txt: sitemap not declared");

console.log(`SEO validated: ${pages.length} localized pages, reciprocal hreflang, JSON-LD, sitemap and robots.`);
