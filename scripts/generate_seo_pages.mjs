import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = join(root, "android-app", "app", "src", "main", "assets", "www");
const siteOrigin = "https://psyetica.app";

const locales = {
  it: {
    path: "/", htmlLang: "it", hreflang: "it", dir: "ltr", ogLocale: "it_IT",
    title: "Codice deontologico degli psicologi italiani | PsyEtica",
    description: "Studia il Codice Deontologico degli Psicologi Italiani articolo per articolo, con testo ufficiale, commenti, casi, glossario e flashcard per l’Esame di Stato.",
    eyebrow: "Codice deontologico · Psicologi · Italia",
    heading: "Il Codice deontologico degli psicologi italiani",
    lead: "Consulta i 42 articoli del Codice vigente in Italia, con spiegazioni per clausole, esempi di possibili infrazioni, fonti e strumenti di ripasso.",
    loading: "Caricamento della biblioteca…", skip: "Vai al contenuto", language: "Lingua", theme: "Tema scuro",
    support: "Sostieni", articles: "Articoli", flashcards: "Flashcard", info: "Info", navigation: "Navigazione principale", close: "Chiudi",
    country: "Italia", subject: "Codice Deontologico degli Psicologi Italiani"
  },
  en: {
    path: "/en/", htmlLang: "en-GB", hreflang: "en-GB", dir: "ltr", ogLocale: "en_GB",
    title: "Code of Ethics for Psychologists in Italy | PsyEtica",
    description: "Study the Italian Psychologists’ Code of Ethics article by article, with the official Italian text, UK English commentary, cases, a glossary and State Examination flashcards.",
    eyebrow: "Professional ethics · Psychologists · Italy",
    heading: "The Code of Ethics for psychologists in Italy",
    lead: "Read all 42 provisions governing psychologists in Italy, with clause-by-clause explanations, possible infringement examples, sources and revision tools.",
    loading: "Loading the library…", skip: "Skip to content", language: "Language", theme: "Dark mode",
    support: "Support", articles: "Articles", flashcards: "Flashcards", info: "About", navigation: "Primary navigation", close: "Close",
    country: "Italy", subject: "Italian Psychologists’ Code of Ethics"
  },
  es: {
    path: "/es/", htmlLang: "es", hreflang: "es", dir: "ltr", ogLocale: "es_ES",
    title: "Código deontológico de los psicólogos en Italia | PsyEtica",
    description: "Estudia el Código deontológico de los psicólogos de Italia artículo por artículo, con texto oficial italiano, comentarios, casos, glosario y tarjetas de repaso.",
    eyebrow: "Código deontológico · Psicólogos · Italia",
    heading: "El Código deontológico de los psicólogos en Italia",
    lead: "Consulta los 42 artículos vigentes para los psicólogos en Italia, con explicaciones por cláusulas, ejemplos de posibles infracciones, fuentes y herramientas de estudio.",
    loading: "Cargando la biblioteca…", skip: "Ir al contenido", language: "Idioma", theme: "Modo oscuro",
    support: "Apoyar", articles: "Artículos", flashcards: "Tarjetas", info: "Info", navigation: "Navegación principal", close: "Cerrar",
    country: "Italia", subject: "Código deontológico de los psicólogos italianos"
  },
  ro: {
    path: "/ro/", htmlLang: "ro", hreflang: "ro", dir: "ltr", ogLocale: "ro_RO",
    title: "Codul deontologic al psihologilor din Italia | PsyEtica",
    description: "Studiază Codul deontologic al psihologilor din Italia articol cu articol, cu textul oficial italian, comentarii, cazuri, glosar și fișe de recapitulare.",
    eyebrow: "Cod deontologic · Psihologi · Italia",
    heading: "Codul deontologic al psihologilor din Italia",
    lead: "Consultă cele 42 de articole aplicabile psihologilor din Italia, cu explicații pe clauze, exemple de posibile abateri, surse și instrumente de studiu.",
    loading: "Se încarcă biblioteca…", skip: "Mergi la conținut", language: "Limbă", theme: "Mod întunecat",
    support: "Susține", articles: "Articole", flashcards: "Fișe", info: "Info", navigation: "Navigare principală", close: "Închide",
    country: "Italia", subject: "Codul deontologic al psihologilor italieni"
  },
  sq: {
    path: "/sq/", htmlLang: "sq", hreflang: "sq", dir: "ltr", ogLocale: "sq_AL",
    title: "Kodi deontologjik i psikologëve në Itali | PsyEtica",
    description: "Studio Kodin deontologjik të psikologëve në Itali nen pas neni, me tekstin zyrtar italisht, komente, raste, fjalor dhe kartela përsëritjeje.",
    eyebrow: "Kodi deontologjik · Psikologët · Itali",
    heading: "Kodi deontologjik i psikologëve në Itali",
    lead: "Lexo 42 nenet në fuqi për psikologët në Itali, me shpjegime sipas klauzolave, shembuj shkeljesh të mundshme, burime dhe mjete studimi.",
    loading: "Po ngarkohet biblioteka…", skip: "Kalo te përmbajtja", language: "Gjuha", theme: "Modaliteti i errët",
    support: "Mbështet", articles: "Nenet", flashcards: "Kartela", info: "Info", navigation: "Navigimi kryesor", close: "Mbyll",
    country: "Italia", subject: "Kodi deontologjik i psikologëve italianë"
  },
  ar: {
    path: "/ar/", htmlLang: "ar-EG", hreflang: "ar", dir: "rtl", ogLocale: "ar_EG",
    title: "مدونة أخلاقيات الأخصائيين النفسيين في إيطاليا | PsyEtica",
    description: "ادرس مدونة أخلاقيات الأخصائيين النفسيين في إيطاليا مادةً مادة، مع النص الإيطالي الرسمي وشروح وحالات ومصطلحات وبطاقات مراجعة.",
    eyebrow: "أخلاقيات المهنة · الأخصائيون النفسيون · إيطاليا",
    heading: "مدونة أخلاقيات الأخصائيين النفسيين في إيطاليا",
    lead: "اقرأ المواد الـ42 السارية على الأخصائيين النفسيين في إيطاليا، مع شرح لكل بند وأمثلة لمخالفات محتملة ومصادر وأدوات للمذاكرة.",
    loading: "جاري تحميل المكتبة…", skip: "انتقل إلى المحتوى", language: "اللغة", theme: "الوضع الداكن",
    support: "ادعم", articles: "المواد", flashcards: "بطاقات", info: "معلومات", navigation: "التنقل الرئيسي", close: "إغلاق",
    country: "إيطاليا", subject: "مدونة أخلاقيات الأخصائيين النفسيين الإيطاليين"
  },
  fa: {
    path: "/fa/", htmlLang: "fa-IR", hreflang: "fa", dir: "rtl", ogLocale: "fa_IR",
    title: "آیین‌نامه اخلاق حرفه‌ای روان‌شناسان در ایتالیا | PsyEtica",
    description: "آیین‌نامه اخلاق حرفه‌ای روان‌شناسان در ایتالیا را ماده‌به‌ماده با متن رسمی ایتالیایی، توضیحات، پرونده‌ها، واژه‌نامه و فلش‌کارت مطالعه کنید.",
    eyebrow: "اخلاق حرفه‌ای · روان‌شناسان · ایتالیا",
    heading: "آیین‌نامه اخلاق حرفه‌ای روان‌شناسان در ایتالیا",
    lead: "هر ۴۲ ماده لازم‌الاجرا برای روان‌شناسان در ایتالیا را همراه با شرح بندها، نمونه تخلف احتمالی، منابع و ابزارهای مرور بخوانید.",
    loading: "در حال بارگذاری کتابخانه…", skip: "رفتن به محتوا", language: "زبان", theme: "حالت تیره",
    support: "حمایت", articles: "مواد", flashcards: "فلش‌کارت", info: "درباره", navigation: "پیمایش اصلی", close: "بستن",
    country: "ایتالیا", subject: "آیین‌نامه اخلاق حرفه‌ای روان‌شناسان ایتالیا"
  }
};

const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const alternateLinks = Object.values(locales)
  .map(locale => `  <link rel="alternate" hreflang="${locale.hreflang}" href="${siteOrigin}${locale.path}">`)
  .concat(`  <link rel="alternate" hreflang="x-default" href="${siteOrigin}/">`)
  .join("\n");

const localeLinks = Object.entries(locales)
  .map(([code, locale]) => `<a href="${siteOrigin}${locale.path}" lang="${locale.htmlLang}" hreflang="${locale.hreflang}" data-seo-language="${code}">${escapeHtml({ it: "Italiano", en: "English", es: "Español", ro: "Română", sq: "Shqip", ar: "العربية", fa: "فارسی" }[code])}</a>`)
  .join("");

function structuredData(locale) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteOrigin}/#website`,
        url: `${siteOrigin}/`,
        name: "PsyEtica",
        alternateName: "PsyEtica – Codice Deontologico Psicologi",
        inLanguage: Object.values(locales).map(item => item.htmlLang)
      },
      {
        "@type": "WebApplication",
        "@id": `${siteOrigin}${locale.path}#app`,
        url: `${siteOrigin}${locale.path}`,
        name: "PsyEtica",
        description: locale.description,
        applicationCategory: "EducationalApplication",
        applicationSubCategory: "Professional ethics learning application",
        operatingSystem: "Any",
        browserRequirements: "Requires a modern web browser",
        isAccessibleForFree: true,
        inLanguage: locale.htmlLang,
        about: {
          "@type": "Thing",
          name: locale.subject,
          spatialCoverage: { "@type": "Country", name: locale.country }
        },
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }
      }
    ]
  }).replaceAll("<", "\\u003c");
}

function htmlFor(code, locale) {
  const canonical = `${siteOrigin}${locale.path}`;
  const base = code === "it" ? "" : "  <base href=\"/\">\n";
  const alternateLocales = Object.values(locales)
    .filter(item => item.ogLocale !== locale.ogLocale)
    .map(item => `  <meta property="og:locale:alternate" content="${item.ogLocale}">`)
    .join("\n");
  return `<!doctype html>
<html lang="${locale.htmlLang}" dir="${locale.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${base}  <meta name="theme-color" content="#F4F8F7">
  <meta name="description" id="metaDescription" content="${escapeHtml(locale.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="PsyEtica">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="PsyEtica">
  <meta property="og:title" id="ogTitle" content="${escapeHtml(locale.title)}">
  <meta property="og:description" id="ogDescription" content="${escapeHtml(locale.description)}">
  <meta property="og:url" id="ogUrl" content="${canonical}">
  <meta property="og:image" content="${siteOrigin}/icons/icon-512.png">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:locale" id="ogLocale" content="${locale.ogLocale}">
${alternateLocales}
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" id="twitterTitle" content="${escapeHtml(locale.title)}">
  <meta name="twitter:description" id="twitterDescription" content="${escapeHtml(locale.description)}">
  <meta name="twitter:image" content="${siteOrigin}/icons/icon-512.png">
  <title>${escapeHtml(locale.title)}</title>
  <link rel="canonical" id="canonicalLink" href="${canonical}">
${alternateLinks}
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">
  <link rel="stylesheet" href="styles.css">
  <script type="application/ld+json">${structuredData(locale)}</script>
</head>
<body>
  <a class="skip-link" href="#main">${escapeHtml(locale.skip)}</a>
  <header class="topbar">
    <button class="brand" id="homeButton" type="button" aria-label="PsyEtica home">
      <span class="brand-mark" aria-hidden="true">Ψ</span>
      <span class="brand-name">PsyEtica</span>
    </button>
    <div class="top-actions">
      <label class="language-control" aria-label="${escapeHtml(locale.language)}">
        <span class="globe" aria-hidden="true">◎</span>
        <select id="languageSelect"></select>
      </label>
      <button class="icon-button" id="themeButton" type="button" aria-label="${escapeHtml(locale.theme)}"><span aria-hidden="true">◐</span></button>
      <button class="support-button" id="supportButton" type="button"><span aria-hidden="true">♥</span><span data-i18n="support">${escapeHtml(locale.support)}</span></button>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <section class="hero seo-intro">
      <p class="eyebrow">${escapeHtml(locale.eyebrow)}</p>
      <h1>${escapeHtml(locale.heading)}</h1>
      <p class="lead">${escapeHtml(locale.lead)}</p>
      <p class="small muted">${escapeHtml(locale.loading)}</p>
    </section>
  </main>

  <footer class="seo-footer">
    <nav class="seo-language-links" aria-label="${escapeHtml(locale.language)}">${localeLinks}</nav>
  </footer>

  <nav class="bottom-nav" id="bottomNav" aria-label="${escapeHtml(locale.navigation)}">
    <button type="button" data-screen="articles" class="active"><span class="nav-icon" aria-hidden="true">§</span><span data-i18n="articles">${escapeHtml(locale.articles)}</span></button>
    <button type="button" data-screen="flashcards"><span class="nav-icon" aria-hidden="true">▣</span><span data-i18n="flashcards">${escapeHtml(locale.flashcards)}</span></button>
    <button type="button" data-screen="about"><span class="nav-icon" aria-hidden="true">i</span><span data-i18n="about">${escapeHtml(locale.info)}</span></button>
  </nav>

  <div class="modal-backdrop" id="modalBackdrop" hidden>
    <section class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button class="modal-close" id="modalClose" type="button" aria-label="${escapeHtml(locale.close)}">×</button>
      <div id="modalContent"></div>
    </section>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script src="app.js"></script>
</body>
</html>
`;
}

for (const [code, locale] of Object.entries(locales)) {
  const output = code === "it" ? join(webRoot, "index.html") : join(webRoot, code, "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, htmlFor(code, locale), "utf8");
}

const sitemapAlternates = Object.values(locales)
  .map(locale => `    <xhtml:link rel="alternate" hreflang="${locale.hreflang}" href="${siteOrigin}${locale.path}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteOrigin}/"/>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.values(locales).map(locale => `  <url>
    <loc>${siteOrigin}${locale.path}</loc>
${sitemapAlternates}
  </url>`).join("\n")}
</urlset>
`;
await writeFile(join(webRoot, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(webRoot, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`, "utf8");

console.log(`Generated ${Object.keys(locales).length} localized entry pages, sitemap.xml and robots.txt.`);
