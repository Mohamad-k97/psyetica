"use strict";

const LANGUAGES = [
  { code: "it", native: "Italiano", dir: "ltr", html: "it" },
  { code: "en", native: "English (UK)", dir: "ltr", html: "en-GB" },
  { code: "es", native: "Español", dir: "ltr", html: "es" },
  { code: "ro", native: "Română", dir: "ltr", html: "ro" },
  { code: "sq", native: "Shqip", dir: "ltr", html: "sq" },
  { code: "ar", native: "العربية (مصر)", dir: "rtl", html: "ar-EG" },
  { code: "fa", native: "فارسی (ایران)", dir: "rtl", html: "fa-IR" }
];

const SUPPORT_URL = "https://ko-fi.com/momo_casadei";
const LICENSE_URL = "https://github.com/Mohamad-k97/psyetica/blob/main/LICENSE";
const SITE_ORIGIN = "https://psyetica.app";

const SEO_META = {
  it: { path: "/", locale: "it_IT", title: "Codice deontologico degli psicologi italiani | PsyEtica", description: "Studia il Codice Deontologico degli Psicologi Italiani articolo per articolo, con testo ufficiale, commenti, casi, glossario e flashcard per l’Esame di Stato." },
  en: { path: "/en/", locale: "en_GB", title: "Code of Ethics for Psychologists in Italy | PsyEtica", description: "Study the Italian Psychologists’ Code of Ethics article by article, with the official Italian text, UK English commentary, cases, a glossary and State Examination flashcards." },
  es: { path: "/es/", locale: "es_ES", title: "Código deontológico de los psicólogos en Italia | PsyEtica", description: "Estudia el Código deontológico de los psicólogos de Italia artículo por artículo, con texto oficial italiano, comentarios, casos, glosario y tarjetas de repaso." },
  ro: { path: "/ro/", locale: "ro_RO", title: "Codul deontologic al psihologilor din Italia | PsyEtica", description: "Studiază Codul deontologic al psihologilor din Italia articol cu articol, cu textul oficial italian, comentarii, cazuri, glosar și fișe de recapitulare." },
  sq: { path: "/sq/", locale: "sq_AL", title: "Kodi deontologjik i psikologëve në Itali | PsyEtica", description: "Studio Kodin deontologjik të psikologëve në Itali nen pas neni, me tekstin zyrtar italisht, komente, raste, fjalor dhe kartela përsëritjeje." },
  ar: { path: "/ar/", locale: "ar_EG", title: "مدونة أخلاقيات الأخصائيين النفسيين في إيطاليا | PsyEtica", description: "ادرس مدونة أخلاقيات الأخصائيين النفسيين في إيطاليا مادةً مادة، مع النص الإيطالي الرسمي وشروح وحالات ومصطلحات وبطاقات مراجعة." },
  fa: { path: "/fa/", locale: "fa_IR", title: "آیین‌نامه اخلاق حرفه‌ای روان‌شناسان در ایتالیا | PsyEtica", description: "آیین‌نامه اخلاق حرفه‌ای روان‌شناسان در ایتالیا را ماده‌به‌ماده با متن رسمی ایتالیایی، توضیحات، پرونده‌ها، واژه‌نامه و فلش‌کارت مطالعه کنید." }
};

function languageFromLocation() {
  const pathMatch = location.pathname.match(/^\/(en|es|ro|sq|ar|fa)(?:\/|$)/i);
  if (pathMatch) return pathMatch[1].toLowerCase();
  const queryLanguage = new URLSearchParams(location.search).get("lang")?.toLowerCase();
  return LANGUAGES.some(language => language.code === queryLanguage) ? queryLanguage : null;
}

function syncLanguageUrl(code) {
  if (!["http:", "https:"].includes(location.protocol)) return;
  const path = SEO_META[code]?.path || SEO_META.it.path;
  if (location.pathname !== path || location.search || location.hash) history.replaceState({ language: code }, "", path);
}

const INFO_TRANSLATION_NOTE = {
  it: "Le traduzioni sono versioni editoriali per lo studio; in caso di dubbio prevale sempre il testo italiano.",
  en: "Translations are editorial study versions; where doubt arises, the Italian text always prevails.",
  es: "Las traducciones son versiones editoriales para el estudio; en caso de duda prevalece siempre el texto italiano.",
  ro: "Traducerile sunt versiuni editoriale pentru studiu; în caz de îndoială, textul italian prevalează întotdeauna.",
  sq: "Përkthimet janë versione redaksionale për studim; në rast dyshimi, teksti italisht ka gjithmonë përparësi.",
  ar: "الترجمات معمولة للمذاكرة؛ ولو فيه أي اختلاف، النص الإيطالي هو اللي يُعتدّ به.",
  fa: "ترجمه‌ها نسخه‌های تحریری برای مطالعه‌اند؛ در صورت تردید، متن ایتالیایی همیشه ملاک است."
};

const KO_FI_BODY = {
  it: "Se PsyEtica ti è utile, puoi sostenerne lo sviluppo su Ko-fi.",
  en: "If PsyEtica is useful to you, you can support its development on Ko-fi.",
  es: "Si PsyEtica te resulta útil, puedes apoyar su desarrollo en Ko-fi.",
  ro: "Dacă PsyEtica îți este utilă, poți susține dezvoltarea aplicației pe Ko-fi.",
  sq: "Nëse PsyEtica të ndihmon, mund ta mbështetësh zhvillimin e saj në Ko-fi.",
  ar: "لو PsyEtica فادك، تقدر تدعم تطويره على Ko-fi.",
  fa: "اگر PsyEtica برایتان مفید است، می‌توانید از توسعه آن در Ko-fi حمایت کنید."
};

const LEARNING_COPY = {
  en: {
    clause: "Clause", clauseNotes: [
      "This passage states one part of the professional duty and should be read together with the article’s key point.",
      "Apply it to the concrete facts, identifying the professional role, the service recipient and any third-party commissioning party.",
      "Before acting, check the relevant limits, foreseeable effects and connected provisions of the Code.",
      "A defensible decision should be proportionate, clearly explained where required, and documented."
    ],
    practice: ["Identify the people, roles and purpose of the service before applying this article.", "Compare the facts with the exact wording above and the article’s key point.", "Record the relevant information, reasoning, limits and any consultation or referral."],
    mistakes: ["Reading the article in isolation from the rest of the Code.", "Treating a permitted option as automatic, without assessing the concrete circumstances.", "Failing to explain or document a decision that affects another person."],
    scenario: core => `A psychologist acts in a way that conflicts with this article’s key rule — “${core}” — without checking the relevant facts or recording the reasons.`,
    analysis: n => `This may amount to a professional breach because Article ${n} requires the precise rule stated above. The final assessment always depends on the facts and on the other applicable provisions.`,
    caseNote: n => `This public decision is linked to Article ${n} for study. Open the cited source to check the established facts, the provisions actually applied and the outcome.`,
    connection: n => `Read this source together with Article ${n}; the source link is provided so that its current wording and scope can be checked directly.`,
    cards: ["What is the key rule in this article?", "Which wording should you remember?", "How should this article be applied in practice?", "Which text prevails if there is any doubt?"],
    apply: "Identify the roles and facts, apply the exact wording, check connected duties and document the reasoning.",
    prevailing: "The official Italian text shown above prevails; this English (UK) version is a study aid."
  },
  es: {
    clause: "Cláusula", clauseNotes: ["Este pasaje formula una parte del deber profesional y debe leerse junto con la idea central del artículo.", "Aplícalo a los hechos concretos, identificando la función profesional, el destinatario y, en su caso, el comitente.", "Antes de actuar, comprueba los límites pertinentes, los efectos previsibles y las demás normas relacionadas del Código.", "Una decisión defendible debe ser proporcionada, explicarse con claridad cuando proceda y quedar documentada."],
    practice: ["Identifica a las personas, sus funciones y la finalidad del servicio antes de aplicar este artículo.", "Compara los hechos con la redacción exacta anterior y con la idea central del artículo.", "Documenta la información pertinente, el razonamiento, los límites y cualquier consulta o derivación."],
    mistakes: ["Leer el artículo aisladamente del resto del Código.", "Tratar una posibilidad permitida como automática, sin valorar las circunstancias concretas.", "No explicar o documentar una decisión que afecta a otra persona."],
    scenario: core => `Un psicólogo actúa contra la regla central del artículo —«${core}»— sin comprobar los hechos pertinentes ni dejar constancia de sus razones.`,
    analysis: n => `La conducta puede constituir una infracción porque el artículo ${n} exige la regla precisa expuesta arriba. La valoración final depende siempre de los hechos y de las demás disposiciones aplicables.`,
    caseNote: n => `Esta decisión pública se vincula al artículo ${n} con fines de estudio. Abre la fuente para comprobar los hechos probados, las normas realmente aplicadas y el resultado.`,
    connection: n => `Lee esta fuente junto con el artículo ${n}; el enlace permite comprobar directamente su redacción vigente y su alcance.`,
    cards: ["¿Cuál es la regla central de este artículo?", "¿Qué formulación conviene recordar?", "¿Cómo se aplica este artículo en la práctica?", "¿Qué texto prevalece en caso de duda?"],
    apply: "Identifica funciones y hechos, aplica la redacción exacta, comprueba los deberes relacionados y documenta el razonamiento.",
    prevailing: "Prevalece el texto oficial italiano mostrado arriba; esta versión española sirve para el estudio."
  },
  ro: {
    clause: "Clauză", clauseNotes: ["Acest pasaj formulează o parte a obligației profesionale și se citește împreună cu ideea centrală a articolului.", "Aplică-l faptelor concrete, identificând rolul profesional, destinatarul serviciului și eventualul mandant.", "Înainte de a acționa, verifică limitele relevante, efectele previzibile și celelalte prevederi conexe ale Codului.", "O decizie justificabilă trebuie să fie proporțională, explicată clar când este cazul și documentată."],
    practice: ["Identifică persoanele, rolurile și scopul serviciului înainte de aplicarea articolului.", "Compară faptele cu formularea exactă de mai sus și cu ideea centrală.", "Documentează informațiile relevante, raționamentul, limitele și orice consultare sau trimitere."],
    mistakes: ["Citirea articolului separat de restul Codului.", "Tratarea unei opțiuni permise ca fiind automată, fără evaluarea situației concrete.", "Neexplicarea sau nedocumentarea unei decizii care afectează altă persoană."],
    scenario: core => `Un psiholog acționează contrar regulii centrale — „${core}” — fără să verifice faptele relevante sau să consemneze motivele.`,
    analysis: n => `Conduita poate constitui abatere deoarece articolul ${n} impune regula precisă de mai sus. Evaluarea finală depinde întotdeauna de fapte și de celelalte dispoziții aplicabile.`,
    caseNote: n => `Această decizie publică este asociată articolului ${n} pentru studiu. Deschide sursa pentru a verifica faptele stabilite, normele efectiv aplicate și soluția.`,
    connection: n => `Citește această sursă împreună cu articolul ${n}; linkul permite verificarea directă a textului actual și a domeniului său.`,
    cards: ["Care este regula centrală a articolului?", "Ce formulare trebuie reținută?", "Cum se aplică articolul în practică?", "Ce text prevalează în caz de îndoială?"],
    apply: "Identifică rolurile și faptele, aplică textul exact, verifică obligațiile conexe și documentează raționamentul.",
    prevailing: "Prevalează textul oficial italian afișat mai sus; această versiune română este un ajutor de studiu."
  },
  sq: {
    clause: "Klauzolë", clauseNotes: ["Ky pasazh përcakton një pjesë të detyrimit profesional dhe lexohet së bashku me idenë kryesore të nenit.", "Zbatoje te faktet konkrete, duke përcaktuar rolin profesional, marrësin e shërbimit dhe porositësin e mundshëm.", "Para se të veprosh, kontrollo kufijtë përkatës, pasojat e parashikueshme dhe dispozitat e lidhura të Kodit.", "Një vendim i mbrojtshëm duhet të jetë proporcional, të shpjegohet qartë kur kërkohet dhe të dokumentohet."],
    practice: ["Përcakto personat, rolet dhe qëllimin e shërbimit para zbatimit të nenit.", "Krahaso faktet me formulimin e saktë më sipër dhe me idenë kryesore.", "Dokumento informacionin përkatës, arsyetimin, kufijtë dhe çdo këshillim ose referim."],
    mistakes: ["Leximi i nenit i shkëputur nga pjesa tjetër e Kodit.", "Trajtimi i një mundësie të lejuar si automatike, pa vlerësuar rrethanat konkrete.", "Mosshpjegimi ose mosdokumentimi i një vendimi që prek një person tjetër."],
    scenario: core => `Një psikolog vepron kundër rregullit kryesor — “${core}” — pa kontrolluar faktet përkatëse ose pa dokumentuar arsyet.`,
    analysis: n => `Sjellja mund të përbëjë shkelje sepse neni ${n} kërkon rregullin e saktë të paraqitur më sipër. Vlerësimi përfundimtar varet gjithmonë nga faktet dhe dispozitat e tjera të zbatueshme.`,
    caseNote: n => `Ky vendim publik lidhet me nenin ${n} për qëllime studimi. Hap burimin për të kontrolluar faktet e provuara, normat e zbatuara dhe rezultatin.`,
    connection: n => `Lexoje këtë burim së bashku me nenin ${n}; lidhja lejon kontrollin e drejtpërdrejtë të tekstit në fuqi dhe fushës së tij.`,
    cards: ["Cili është rregulli kryesor i këtij neni?", "Cili formulim duhet mbajtur mend?", "Si zbatohet ky nen në praktikë?", "Cili tekst ka përparësi në rast dyshimi?"],
    apply: "Përcakto rolet dhe faktet, zbato formulimin e saktë, kontrollo detyrimet e lidhura dhe dokumento arsyetimin.",
    prevailing: "Përparësi ka teksti zyrtar italisht i shfaqur më sipër; ky version shqip shërben për studim."
  },
  ar: {
    clause: "عبارة", clauseNotes: ["العبارة دي بتقرر جزء من الواجب المهني، ولازم تتقري مع خلاصة المادة.", "طبّقها على الوقائع الفعلية بعد ما تحدد دور الأخصائي، ومتلقي الخدمة، والجهة المُكلِّفة إن وُجدت.", "قبل التصرف، راجع الحدود المهمة والنتائج المتوقعة والمواد المرتبطة في الميثاق.", "القرار السليم لازم يكون متناسب، ويتشرح بوضوح لما يلزم، ويتوثق."],
    practice: ["حدّد الأشخاص والأدوار وهدف الخدمة قبل تطبيق المادة.", "قارن الوقائع بالنص الدقيق المكتوب فوق وبخلاصة المادة.", "وثّق المعلومات المهمة وأسباب القرار وحدوده وأي استشارة أو إحالة."],
    mistakes: ["قراءة المادة بمعزل عن باقي الميثاق.", "اعتبار الإمكانية المسموح بها إذنًا تلقائيًا من غير تقييم الظروف الفعلية.", "عدم شرح أو توثيق قرار بيأثر على شخص تاني."],
    scenario: core => `أخصائي نفسي تصرّف عكس القاعدة الأساسية في المادة — «${core}» — من غير ما يراجع الوقائع المهمة أو يوثّق أسباب قراره.`,
    analysis: n => `التصرف ده ممكن يشكل مخالفة لأن المادة ${n} بتفرض القاعدة المحددة المكتوبة فوق. التقييم النهائي دايمًا بيعتمد على الوقائع وباقي القواعد الواجبة التطبيق.`,
    caseNote: n => `القرار العلني ده مرتبط بالمادة ${n} للمذاكرة. افتح المصدر عشان تراجع الوقائع الثابتة، والمواد اللي اتطبقت فعلًا، والنتيجة.`,
    connection: n => `اقرأ المصدر ده مع المادة ${n}؛ الرابط موجود عشان تراجع النص الحالي ونطاق تطبيقه مباشرة.`,
    cards: ["إيه القاعدة الأساسية في المادة دي؟", "إيه الصياغة المهمة اللي لازم تفتكرها؟", "إزاي تطبّق المادة دي عمليًا؟", "أي نص هو المرجع لو حصل اختلاف؟"],
    apply: "حدّد الأدوار والوقائع، وطبّق النص بدقة، وراجع الواجبات المرتبطة، ووثّق أسباب القرار.",
    prevailing: "النص الإيطالي الرسمي المعروض فوق هو المرجع؛ النسخة العربية المصرية معمولة للمذاكرة."
  },
  fa: {
    clause: "بند", clauseNotes: ["این بخش، قسمتی از تکلیف حرفه‌ای را بیان می‌کند و باید همراه با خلاصه ماده خوانده شود.", "آن را بر واقعیت‌های پرونده تطبیق دهید و نقش حرفه‌ای، مخاطب خدمت و سفارش‌دهنده احتمالی را مشخص کنید.", "پیش از اقدام، محدودیت‌های مربوط، پیامدهای قابل پیش‌بینی و مواد مرتبط آیین‌نامه را بررسی کنید.", "تصمیم قابل دفاع باید متناسب باشد، در صورت لزوم روشن توضیح داده شود و مستند بماند."],
    practice: ["پیش از اجرای ماده، اشخاص، نقش‌ها و هدف خدمت را مشخص کنید.", "واقعیت‌ها را با عبارت دقیق بالا و خلاصه ماده مقایسه کنید.", "اطلاعات مهم، استدلال، محدودیت‌ها و هر مشورت یا ارجاع را ثبت کنید."],
    mistakes: ["خواندن ماده جدا از بقیه آیین‌نامه.", "خودکار دانستن یک امکان مجاز، بدون ارزیابی شرایط واقعی.", "توضیح‌ندادن یا مستندنکردن تصمیمی که بر شخص دیگری اثر می‌گذارد."],
    scenario: core => `روان‌شناسی برخلاف قاعده اصلی ماده — «${core}» — عمل می‌کند، بدون آنکه واقعیت‌های مهم را بررسی یا دلایل تصمیم را ثبت کند.`,
    analysis: n => `این رفتار می‌تواند تخلف باشد، چون ماده ${n} قاعده دقیق بالا را لازم می‌داند. ارزیابی نهایی همیشه به واقعیت‌ها و سایر مقررات قابل اجرا بستگی دارد.`,
    caseNote: n => `این تصمیم عمومی برای مطالعه به ماده ${n} مرتبط شده است. منبع را باز کنید تا واقعیت‌های احرازشده، مواد واقعاً اعمال‌شده و نتیجه را بررسی کنید.`,
    connection: n => `این منبع را همراه با ماده ${n} بخوانید؛ پیوند برای بررسی مستقیم متن فعلی و دامنه آن ارائه شده است.`,
    cards: ["قاعده اصلی این ماده چیست؟", "کدام عبارت را باید به خاطر سپرد؟", "این ماده در عمل چگونه اجرا می‌شود؟", "در صورت تردید کدام متن ملاک است؟"],
    apply: "نقش‌ها و واقعیت‌ها را مشخص کنید، عبارت دقیق را به کار ببرید، تکالیف مرتبط را بسنجید و استدلال را مستند کنید.",
    prevailing: "متن رسمی ایتالیایی نمایش‌داده‌شده در بالا ملاک است؛ این نسخه فارسی ایران برای مطالعه تهیه شده است."
  }
};

const CHAPTER_COPY = {
  en: ["Part I · General principles", "Part II · Relations with service users and commissioning parties", "Part III · Relations with colleagues", "Part IV · Relations with society", "Part V · Implementing provisions"],
  es: ["Capítulo I · Principios generales", "Capítulo II · Relaciones con usuarios y comitentes", "Capítulo III · Relaciones con colegas", "Capítulo IV · Relaciones con la sociedad", "Capítulo V · Disposiciones de aplicación"],
  ro: ["Capitolul I · Principii generale", "Capitolul II · Relațiile cu beneficiarii și mandanții", "Capitolul III · Relațiile cu colegii", "Capitolul IV · Relațiile cu societatea", "Capitolul V · Dispoziții de aplicare"],
  sq: ["Kreu I · Parime të përgjithshme", "Kreu II · Marrëdhëniet me përdoruesit dhe porositësit", "Kreu III · Marrëdhëniet me kolegët", "Kreu IV · Marrëdhëniet me shoqërinë", "Kreu V · Dispozita zbatuese"],
  ar: ["الباب الأول · المبادئ العامة", "الباب الثاني · العلاقة مع المستفيدين والجهات المُكلِّفة", "الباب الثالث · العلاقة مع الزملاء", "الباب الرابع · العلاقة مع المجتمع", "الباب الخامس · أحكام التنفيذ"],
  fa: ["فصل اول · اصول کلی", "فصل دوم · رابطه با خدمت‌گیرندگان و سفارش‌دهندگان", "فصل سوم · رابطه با همکاران", "فصل چهارم · رابطه با جامعه", "فصل پنجم · مقررات اجرایی"]
};

const COPY = {
  it: {
    articles: "Articoli", flashcards: "Flashcard", about: "Info", support: "Sostieni",
    library: "Il Codice, spiegato con chiarezza", libraryLead: "Studia il testo vigente articolo per articolo, esplora le clausole e allenati per l’Esame di Stato.",
    articlesCount: "42 articoli", cardsCount: "168 flashcard",
    search: "Cerca articolo, concetto o parola…", noResults: "Nessun articolo corrisponde alla ricerca.",
    article: "Articolo", back: "Tutti gli articoli", officialItalian: "Testo ufficiale italiano",
    tapTerms: "Tocca le parole evidenziate per aprire la definizione.", keyMessage: "In sintesi",
    clauseReading: "Lettura per clausole", practical: "In pratica", mistakes: "Errori frequenti",
    example: "Esempio di possibile infrazione", analysis: "Perché è rilevante", cases: "Casi e decisioni",
    connections: "Collegamenti normativi", source: "Apri la fonte", related: "Articoli collegati",
    legalNotice: "Contenuto didattico redazionale", translationNotice: "Traduzione non ufficiale da sottoporre a revisione giuridico-linguistica.",
    localizedArticle: "Testo dell’articolo", comments: "Commento per clausole", termDefinition: "Definizione",
    italianTerm: "Termine italiano", localizedExplanation: "Spiegazione", category: "Categoria",
    close: "Chiudi", studyTitle: "Allenati per l’Esame di Stato", studyLead: "Ripassa tutte le flashcard e salva sul dispositivo quelle conosciute e quelle da rivedere.",
    italian: "Italiano", appLanguage: "Lingua app", shuffle: "Mescola", showAnswer: "Mostra risposta",
    again: "Da rivedere", known: "La conosco", previous: "Precedente", next: "Successiva",
    reviewed: "Valutate", knownCount: "Conosciute", cardOf: "Carta {current} di {total}", reset: "Azzera progresso",
    resetDone: "Progresso azzerato", shareTitle: "Sostieni PsyEtica", shareText: "PsyEtica aiuta a studiare il Codice Deontologico degli psicologi, senza account e anche offline.",
    supportTitle: "Sostieni il progetto", supportBody: "PsyEtica è pensata come risorsa didattica accessibile. Puoi sostenerla condividendola con studenti e colleghe/i e inviando osservazioni sui contenuti.",
    share: "Condividi PsyEtica", whyTitle: "Come usare PsyEtica", whyBody: "Leggi sempre per primo il testo ufficiale italiano. I commenti, gli esempi, i titoli redazionali e le traduzioni aiutano lo studio ma non sostituiscono il Codice né un parere professionale sul caso concreto.",
    privacyTitle: "Privacy semplice", privacyBody: "Nessun login, nessun profilo e nessun tracciamento. Tema, lingua e progresso delle flashcard restano sul dispositivo.",
    languageTitle: "Sette lingue, una fonte", languageBody: "Il testo italiano è sempre visibile e prevale. Le traduzioni sono bozze didattiche non ufficiali e devono essere revisionate da specialisti madrelingua prima della pubblicazione definitiva.",
    sourcesTitle: "Fonti", sourcesBody: "Il testo normativo rimanda al CNOP; commenti e casi riportano i collegamenti alle fonti disponibili. L’app funziona offline, mentre l’apertura di un link esterno richiede una connessione.",
    officialSite: "Apri il Codice vigente sul sito CNOP", version: "Versione 1.0.0",
    loadingError: "Non è stato possibile caricare i dati dell’app.", caseOutcome: "Esito", notKnownFinal: "Eventuale impugnazione o definitività non nota.",
    answer: "Risposta", flashItalianHint: "Le flashcard italiane restano sempre disponibili.", filterAll: "Tutti gli articoli"
  },
  en: {
    articles: "Articles", flashcards: "Flashcards", about: "About", support: "Support",
    library: "The Code, explained clearly", libraryLead: "Study the current text article by article, explore each clause, and prepare for the State Examination.",
    articlesCount: "42 articles", cardsCount: "168 flashcards", search: "Search articles, concepts, or words…", noResults: "No article matches your search.",
    article: "Article", back: "All articles", officialItalian: "Official Italian text", tapTerms: "Tap highlighted words to see the definition.", keyMessage: "Key point",
    clauseReading: "Clause-by-clause reading", practical: "In practice", mistakes: "Common mistakes", example: "Possible infringement example", analysis: "Why it matters", cases: "Cases and decisions", connections: "Legal connections", source: "Open source", related: "Related articles",
    legalNotice: "Editorial learning content", translationNotice: "Unofficial translation requiring legal and native-language review.", localizedArticle: "Article text", comments: "Clause-by-clause commentary", termDefinition: "Definition", italianTerm: "Italian term", localizedExplanation: "Explanation", category: "Category", close: "Close",
    studyTitle: "Prepare for the State Examination", studyLead: "Review every card and save what you know or need to revisit on this device.", italian: "Italian", appLanguage: "App language", shuffle: "Shuffle", showAnswer: "Show answer", again: "Review again", known: "I know it", previous: "Previous", next: "Next", reviewed: "Reviewed", knownCount: "Known", cardOf: "Card {current} of {total}", reset: "Reset progress", resetDone: "Progress reset",
    shareTitle: "Support PsyEtica", shareText: "PsyEtica helps people study the Italian Psychologists’ Code of Ethics, without an account and offline.", supportTitle: "Support the project", supportBody: "PsyEtica is designed as an accessible learning resource. Support it by sharing it with students and colleagues and by sending feedback on the content.", share: "Share PsyEtica",
    whyTitle: "How to use PsyEtica", whyBody: "Always read the official Italian text first. Commentary, examples, editorial titles, and translations support learning but do not replace the Code or case-specific professional advice.", privacyTitle: "Simple privacy", privacyBody: "No login, profile, or tracking. Theme, language, and flashcard progress remain on your device.", languageTitle: "Seven languages, one source", languageBody: "The Italian text is always shown and controls. Translations are unofficial learning drafts and require specialist native review before final publication.", sourcesTitle: "Sources", sourcesBody: "The normative text links to CNOP; commentary and cases include available source links. The app works offline, while external links need a connection.", officialSite: "Open the current Code on the CNOP website", version: "Version 1.0.0", loadingError: "The app data could not be loaded.", caseOutcome: "Outcome", notKnownFinal: "Any appeal or finality is unknown.", answer: "Answer", flashItalianHint: "Italian flashcards always remain available.", filterAll: "All articles"
  },
  es: {
    articles: "Artículos", flashcards: "Tarjetas", about: "Info", support: "Apoyar", library: "El Código, explicado con claridad", libraryLead: "Estudia el texto vigente artículo por artículo, explora sus cláusulas y prepárate para el Examen de Estado.", articlesCount: "42 artículos", cardsCount: "168 tarjetas", search: "Buscar artículo, concepto o palabra…", noResults: "Ningún artículo coincide con la búsqueda.", article: "Artículo", back: "Todos los artículos", officialItalian: "Texto oficial italiano", tapTerms: "Toca las palabras resaltadas para ver la definición.", keyMessage: "En síntesis", clauseReading: "Lectura por cláusulas", practical: "En la práctica", mistakes: "Errores frecuentes", example: "Ejemplo de posible infracción", analysis: "Por qué es relevante", cases: "Casos y decisiones", connections: "Conexiones jurídicas", source: "Abrir fuente", related: "Artículos relacionados", legalNotice: "Contenido didáctico editorial", translationNotice: "Traducción no oficial pendiente de revisión jurídico-lingüística.", localizedArticle: "Texto del artículo", comments: "Comentario por cláusulas", termDefinition: "Definición", italianTerm: "Término italiano", localizedExplanation: "Explicación", category: "Categoría", close: "Cerrar", studyTitle: "Prepárate para el Examen de Estado", studyLead: "Repasa todas las tarjetas y guarda en el dispositivo lo que sabes y lo que debes revisar.", italian: "Italiano", appLanguage: "Idioma de la app", shuffle: "Mezclar", showAnswer: "Mostrar respuesta", again: "Repasar", known: "La sé", previous: "Anterior", next: "Siguiente", reviewed: "Evaluadas", knownCount: "Conocidas", cardOf: "Tarjeta {current} de {total}", reset: "Borrar progreso", resetDone: "Progreso borrado", shareTitle: "Apoya PsyEtica", shareText: "PsyEtica ayuda a estudiar el Código Deontológico italiano de los psicólogos, sin cuenta y sin conexión.", supportTitle: "Apoya el proyecto", supportBody: "PsyEtica está diseñada como recurso didáctico accesible. Puedes apoyarla compartiéndola y enviando observaciones sobre el contenido.", share: "Compartir PsyEtica", whyTitle: "Cómo usar PsyEtica", whyBody: "Lee siempre primero el texto oficial italiano. Los comentarios, ejemplos, títulos y traducciones ayudan al estudio, pero no sustituyen el Código ni el asesoramiento sobre un caso concreto.", privacyTitle: "Privacidad sencilla", privacyBody: "Sin inicio de sesión, perfil ni seguimiento. El tema, idioma y progreso permanecen en el dispositivo.", languageTitle: "Siete idiomas, una fuente", languageBody: "El texto italiano siempre se muestra y prevalece. Las traducciones son borradores didácticos no oficiales que requieren revisión especialista.", sourcesTitle: "Fuentes", sourcesBody: "El texto normativo remite al CNOP; comentarios y casos incluyen los enlaces disponibles. La app funciona sin conexión; los enlaces externos requieren internet.", officialSite: "Abrir el Código vigente en el sitio del CNOP", version: "Versión 1.0.0", loadingError: "No se pudieron cargar los datos.", caseOutcome: "Resultado", notKnownFinal: "No se conoce una posible impugnación o firmeza.", answer: "Respuesta", flashItalianHint: "Las tarjetas italianas están siempre disponibles.", filterAll: "Todos los artículos"
  },
  ro: {
    articles: "Articole", flashcards: "Fișe", about: "Info", support: "Susține", library: "Codul, explicat clar", libraryLead: "Studiază textul în vigoare articol cu articol, explorează clauzele și pregătește-te pentru Examenul de Stat.", articlesCount: "42 de articole", cardsCount: "168 de fișe", search: "Caută articol, concept sau cuvânt…", noResults: "Niciun articol nu corespunde căutării.", article: "Articolul", back: "Toate articolele", officialItalian: "Text oficial italian", tapTerms: "Atinge cuvintele evidențiate pentru definiție.", keyMessage: "Pe scurt", clauseReading: "Lectură pe clauze", practical: "În practică", mistakes: "Greșeli frecvente", example: "Exemplu de posibilă abatere", analysis: "De ce este relevant", cases: "Cazuri și decizii", connections: "Legături juridice", source: "Deschide sursa", related: "Articole conexe", legalNotice: "Conținut didactic editorial", translationNotice: "Traducere neoficială ce necesită revizuire juridică și lingvistică.", localizedArticle: "Textul articolului", comments: "Comentariu pe clauze", termDefinition: "Definiție", italianTerm: "Termen italian", localizedExplanation: "Explicație", category: "Categorie", close: "Închide", studyTitle: "Pregătește-te pentru Examenul de Stat", studyLead: "Recapitulează toate fișele și salvează pe dispozitiv ce știi și ce trebuie revăzut.", italian: "Italiană", appLanguage: "Limba aplicației", shuffle: "Amestecă", showAnswer: "Arată răspunsul", again: "De revăzut", known: "Știu", previous: "Anterior", next: "Următor", reviewed: "Evaluate", knownCount: "Cunoscute", cardOf: "Fișa {current} din {total}", reset: "Șterge progresul", resetDone: "Progres șters", shareTitle: "Susține PsyEtica", shareText: "PsyEtica ajută la studiul Codului deontologic italian al psihologilor, fără cont și offline.", supportTitle: "Susține proiectul", supportBody: "PsyEtica este o resursă didactică accesibilă. O poți susține distribuind-o și trimițând observații asupra conținutului.", share: "Distribuie PsyEtica", whyTitle: "Cum se folosește PsyEtica", whyBody: "Citește întotdeauna mai întâi textul oficial italian. Comentariile, exemplele, titlurile și traducerile sprijină studiul, dar nu înlocuiesc Codul sau consultanța pentru un caz concret.", privacyTitle: "Confidențialitate simplă", privacyBody: "Fără autentificare, profil sau urmărire. Tema, limba și progresul rămân pe dispozitiv.", languageTitle: "Șapte limbi, o singură sursă", languageBody: "Textul italian este afișat mereu și prevalează. Traducerile sunt schițe didactice neoficiale ce necesită revizuire de specialitate.", sourcesTitle: "Surse", sourcesBody: "Textul normativ trimite la CNOP; comentariile și cazurile includ linkurile disponibile. Aplicația funcționează offline; linkurile externe cer conexiune.", officialSite: "Deschide Codul în vigoare pe site-ul CNOP", version: "Versiunea 1.0.0", loadingError: "Datele aplicației nu au putut fi încărcate.", caseOutcome: "Rezultat", notKnownFinal: "O eventuală cale de atac sau definitivarea nu este cunoscută.", answer: "Răspuns", flashItalianHint: "Fișele italiene rămân mereu disponibile.", filterAll: "Toate articolele"
  },
  sq: {
    articles: "Nenet", flashcards: "Kartela", about: "Info", support: "Mbështet", library: "Kodi, i shpjeguar qartë", libraryLead: "Studio tekstin në fuqi nen pas neni, shqyrto klauzolat dhe përgatitu për Provimin e Shtetit.", articlesCount: "42 nene", cardsCount: "168 kartela", search: "Kërko nen, koncept ose fjalë…", noResults: "Asnjë nen nuk përputhet me kërkimin.", article: "Neni", back: "Të gjitha nenet", officialItalian: "Teksti zyrtar italisht", tapTerms: "Prek fjalët e theksuara për përkufizimin.", keyMessage: "Në thelb", clauseReading: "Lexim sipas klauzolave", practical: "Në praktikë", mistakes: "Gabime të shpeshta", example: "Shembull i një shkeljeje të mundshme", analysis: "Pse ka rëndësi", cases: "Raste dhe vendime", connections: "Lidhje juridike", source: "Hap burimin", related: "Nene të lidhura", legalNotice: "Përmbajtje didaktike redaksionale", translationNotice: "Përkthim jozyrtar që kërkon rishikim juridik dhe gjuhësor.", localizedArticle: "Teksti i nenit", comments: "Koment sipas klauzolave", termDefinition: "Përkufizim", italianTerm: "Termi italisht", localizedExplanation: "Shpjegim", category: "Kategori", close: "Mbyll", studyTitle: "Përgatitu për Provimin e Shtetit", studyLead: "Përsërit të gjitha kartelat dhe ruaj në pajisje ato që di dhe ato që duhen rishikuar.", italian: "Italisht", appLanguage: "Gjuha e aplikacionit", shuffle: "Përziej", showAnswer: "Shfaq përgjigjen", again: "Për t’u rishikuar", known: "E di", previous: "Mëparshme", next: "Tjetra", reviewed: "Vlerësuar", knownCount: "Të njohura", cardOf: "Kartela {current} nga {total}", reset: "Fshi përparimin", resetDone: "Përparimi u fshi", shareTitle: "Mbështet PsyEtica", shareText: "PsyEtica ndihmon në studimin e Kodit Deontologjik italian të psikologëve, pa llogari dhe offline.", supportTitle: "Mbështet projektin", supportBody: "PsyEtica është një burim mësimor i qasshëm. Mund ta mbështetësh duke e ndarë dhe duke dërguar vërejtje për përmbajtjen.", share: "Ndaj PsyEtica", whyTitle: "Si përdoret PsyEtica", whyBody: "Lexo gjithmonë fillimisht tekstin zyrtar italisht. Komentet, shembujt, titujt dhe përkthimet ndihmojnë studimin, por nuk zëvendësojnë Kodin ose këshillën për një rast konkret.", privacyTitle: "Privatësi e thjeshtë", privacyBody: "Pa hyrje, profil apo gjurmim. Tema, gjuha dhe përparimi mbeten në pajisje.", languageTitle: "Shtatë gjuhë, një burim", languageBody: "Teksti italisht shfaqet gjithmonë dhe ka përparësi. Përkthimet janë drafte jozyrtare që kërkojnë rishikim specialistësh.", sourcesTitle: "Burimet", sourcesBody: "Teksti normativ lidhet me CNOP; komentet dhe rastet përfshijnë lidhjet e disponueshme. Aplikacioni punon offline; lidhjet e jashtme kërkojnë internet.", officialSite: "Hap Kodin në fuqi në faqen CNOP", version: "Versioni 1.0.0", loadingError: "Të dhënat nuk u ngarkuan.", caseOutcome: "Rezultati", notKnownFinal: "Nuk dihet ankimi ose formë e prerë.", answer: "Përgjigjja", flashItalianHint: "Kartelat italisht janë gjithmonë të disponueshme.", filterAll: "Të gjitha nenet"
  },
  ar: {
    articles: "المواد", flashcards: "بطاقات", about: "حول", support: "ادعم", library: "المدونة، بشرح واضح", libraryLead: "ادرس النص النافذ مادةً مادة، واستكشف العبارات، واستعد لامتحان الدولة.", articlesCount: "42 مادة", cardsCount: "168 بطاقة", search: "ابحث عن مادة أو مفهوم أو كلمة…", noResults: "لا توجد مادة مطابقة للبحث.", article: "المادة", back: "جميع المواد", officialItalian: "النص الإيطالي الرسمي", tapTerms: "اضغط على الكلمات المميزة لعرض التعريف.", keyMessage: "الخلاصة", clauseReading: "شرح بحسب العبارات", practical: "في الممارسة", mistakes: "أخطاء شائعة", example: "مثال على مخالفة محتملة", analysis: "سبب الصلة", cases: "قضايا وقرارات", connections: "روابط قانونية", source: "فتح المصدر", related: "مواد مرتبطة", legalNotice: "محتوى تعليمي تحريري", translationNotice: "ترجمة غير رسمية تحتاج إلى مراجعة قانونية ولغوية متخصصة.", localizedArticle: "نص المادة", comments: "تعليق بحسب العبارات", termDefinition: "التعريف", italianTerm: "المصطلح الإيطالي", localizedExplanation: "الشرح", category: "الفئة", close: "إغلاق", studyTitle: "استعد لامتحان الدولة", studyLead: "راجع جميع البطاقات واحفظ على الجهاز ما تعرفه وما يحتاج إلى مراجعة.", italian: "الإيطالية", appLanguage: "لغة التطبيق", shuffle: "خلط", showAnswer: "إظهار الإجابة", again: "مراجعة لاحقة", known: "أعرفها", previous: "السابقة", next: "التالية", reviewed: "تم تقييمها", knownCount: "معروفة", cardOf: "البطاقة {current} من {total}", reset: "مسح التقدم", resetDone: "تم مسح التقدم", shareTitle: "ادعم PsyEtica", shareText: "يساعد PsyEtica على دراسة مدونة أخلاقيات علماء النفس الإيطالية، دون حساب ودون اتصال.", supportTitle: "ادعم المشروع", supportBody: "صُمم PsyEtica كمورد تعليمي متاح. يمكنك دعمه بمشاركته مع الطلاب والزملاء وإرسال الملاحظات حول المحتوى.", share: "مشاركة PsyEtica", whyTitle: "طريقة استخدام PsyEtica", whyBody: "اقرأ دائمًا النص الإيطالي الرسمي أولًا. تساعد التعليقات والأمثلة والعناوين والترجمات على الدراسة، لكنها لا تحل محل المدونة أو المشورة بشأن حالة محددة.", privacyTitle: "خصوصية بسيطة", privacyBody: "لا تسجيل دخول ولا ملف شخصي ولا تتبع. يبقى المظهر واللغة وتقدم البطاقات على جهازك.", languageTitle: "سبع لغات ومصدر واحد", languageBody: "يظهر النص الإيطالي دائمًا وهو الحاكم. الترجمات مسودات تعليمية غير رسمية تحتاج إلى مراجعة مختصين ناطقين باللغة قبل النشر النهائي.", sourcesTitle: "المصادر", sourcesBody: "يرتبط النص التنظيمي بموقع CNOP، وتشمل التعليقات والقضايا روابط المصادر المتاحة. يعمل التطبيق دون اتصال؛ أما الروابط الخارجية فتحتاج إلى اتصال.", officialSite: "فتح المدونة النافذة على موقع CNOP", version: "الإصدار ١٫٠٫٠", loadingError: "تعذر تحميل بيانات التطبيق.", caseOutcome: "النتيجة", notKnownFinal: "لا يُعرف الطعن المحتمل أو اكتساب القرار للقطعية.", answer: "الإجابة", flashItalianHint: "تبقى البطاقات الإيطالية متاحة دائمًا.", filterAll: "جميع المواد"
  },
  fa: {
    articles: "مواد", flashcards: "فلش‌کارت", about: "درباره", support: "حمایت", library: "آیین‌نامه، با توضیح روشن", libraryLead: "متن لازم‌الاجرا را ماده‌به‌ماده بخوانید، بندها را بررسی کنید و برای آزمون دولتی آماده شوید.", articlesCount: "۴۲ ماده", cardsCount: "۱۶۸ فلش‌کارت", search: "جست‌وجوی ماده، مفهوم یا واژه…", noResults: "هیچ ماده‌ای با جست‌وجو مطابقت ندارد.", article: "ماده", back: "همه مواد", officialItalian: "متن رسمی ایتالیایی", tapTerms: "برای دیدن تعریف، واژه‌های مشخص‌شده را لمس کنید.", keyMessage: "خلاصه", clauseReading: "شرح بندبه‌بند", practical: "در عمل", mistakes: "اشتباه‌های رایج", example: "نمونه تخلف احتمالی", analysis: "دلیل ارتباط", cases: "پرونده‌ها و تصمیم‌ها", connections: "پیوندهای حقوقی", source: "باز کردن منبع", related: "مواد مرتبط", legalNotice: "محتوای آموزشی تحریری", translationNotice: "ترجمه غیررسمی؛ نیازمند بازبینی حقوقی و زبانی متخصص.", localizedArticle: "متن ماده", comments: "توضیح بندبه‌بند", termDefinition: "تعریف", italianTerm: "اصطلاح ایتالیایی", localizedExplanation: "توضیح", category: "دسته", close: "بستن", studyTitle: "برای آزمون دولتی آماده شوید", studyLead: "همه فلش‌کارت‌ها را مرور کنید و موارد دانسته یا نیازمند بازبینی را روی دستگاه ذخیره کنید.", italian: "ایتالیایی", appLanguage: "زبان برنامه", shuffle: "درهم‌ریزی", showAnswer: "نمایش پاسخ", again: "مرور دوباره", known: "می‌دانم", previous: "قبلی", next: "بعدی", reviewed: "ارزیابی‌شده", knownCount: "دانسته", cardOf: "کارت {current} از {total}", reset: "پاک کردن پیشرفت", resetDone: "پیشرفت پاک شد", shareTitle: "حمایت از PsyEtica", shareText: "PsyEtica به مطالعه آیین‌نامه اخلاق حرفه‌ای روان‌شناسان ایتالیا، بدون حساب و به‌صورت آفلاین کمک می‌کند.", supportTitle: "از پروژه حمایت کنید", supportBody: "PsyEtica یک منبع آموزشی دسترس‌پذیر است. با معرفی آن به دانشجویان و همکاران و ارسال بازخورد درباره محتوا از پروژه حمایت کنید.", share: "اشتراک‌گذاری PsyEtica", whyTitle: "روش استفاده از PsyEtica", whyBody: "همیشه ابتدا متن رسمی ایتالیایی را بخوانید. توضیحات، نمونه‌ها، عنوان‌ها و ترجمه‌ها برای یادگیری‌اند و جایگزین آیین‌نامه یا مشاوره درباره پرونده مشخص نیستند.", privacyTitle: "حریم خصوصی ساده", privacyBody: "بدون ورود، نمایه یا ردیابی. پوسته، زبان و پیشرفت فلش‌کارت‌ها روی دستگاه می‌ماند.", languageTitle: "هفت زبان، یک منبع", languageBody: "متن ایتالیایی همیشه نمایش داده می‌شود و ملاک است. ترجمه‌ها پیش‌نویس آموزشی غیررسمی‌اند و پیش از انتشار نهایی به بازبینی متخصص بومی نیاز دارند.", sourcesTitle: "منابع", sourcesBody: "متن مقرراتی به CNOP پیوند دارد و توضیحات و پرونده‌ها پیوند منابع موجود را نشان می‌دهند. برنامه آفلاین کار می‌کند؛ پیوندهای بیرونی اینترنت می‌خواهند.", officialSite: "باز کردن آیین‌نامه نافذ در وب‌سایت CNOP", version: "نسخه ۱٫۰٫۰", loadingError: "داده‌های برنامه بارگذاری نشد.", caseOutcome: "نتیجه", notKnownFinal: "اعتراض احتمالی یا قطعیت تصمیم معلوم نیست.", answer: "پاسخ", flashItalianHint: "فلش‌کارت‌های ایتالیایی همیشه در دسترس‌اند.", filterAll: "همه مواد"
  }
};

const FLASH_FILTER_COPY = {
  it: { italianOnly: "Le flashcard sono disponibili solo in italiano; l’interfaccia resta nella lingua selezionata.", label: "Filtra flashcard", all: "Tutte", known: "Conosciute", unknown: "Da rivedere", empty: "Nessuna flashcard in questo filtro." },
  en: { italianOnly: "Flashcards are available only in Italian; the interface remains in your selected language.", label: "Filter flashcards", all: "All", known: "Known", unknown: "Not known", empty: "No flashcards in this filter." },
  es: { italianOnly: "Las tarjetas están disponibles solo en italiano; la interfaz permanece en el idioma seleccionado.", label: "Filtrar tarjetas", all: "Todas", known: "Conocidas", unknown: "Por repasar", empty: "No hay tarjetas en este filtro." },
  ro: { italianOnly: "Fișele sunt disponibile numai în italiană; interfața rămâne în limba selectată.", label: "Filtrează fișele", all: "Toate", known: "Cunoscute", unknown: "De revăzut", empty: "Nu există fișe în acest filtru." },
  sq: { italianOnly: "Kartelat janë vetëm në italisht; ndërfaqja mbetet në gjuhën e zgjedhur.", label: "Filtro kartelat", all: "Të gjitha", known: "Të njohura", unknown: "Për t’u rishikuar", empty: "Nuk ka kartela në këtë filtër." },
  ar: { italianOnly: "البطاقات متاحة بالإيطالي بس؛ والواجهة بتفضل باللغة اللي اخترتها.", label: "فلترة البطاقات", all: "الكل", known: "معروفة", unknown: "للمراجعة", empty: "مفيش بطاقات في الفلتر ده." },
  fa: { italianOnly: "فلش‌کارت‌ها فقط به ایتالیایی هستند؛ رابط کاربری به زبان انتخابی شما می‌ماند.", label: "فیلتر فلش‌کارت‌ها", all: "همه", known: "دانسته", unknown: "نیازمند مرور", empty: "در این فیلتر فلش‌کارتی نیست." }
};

const NOTES_COPY = {
  it: { title: "I miei appunti", body: "Restano soltanto su questo dispositivo e non vengono mai inviati. Possono andare persi se cancelli i dati dell’app o del browser.", placeholder: "Scrivi qui osservazioni, collegamenti o domande sull’articolo…", saved: "Salvato sul dispositivo", clear: "Elimina appunto", clearConfirm: "Eliminare l’appunto personale per questo articolo?" },
  en: { title: "My notes", body: "Stored only on this device and never sent anywhere. They may be lost if you clear the app or browser data.", placeholder: "Write observations, connections, or questions about this article…", saved: "Saved on this device", clear: "Delete note", clearConfirm: "Delete your personal note for this article?" },
  es: { title: "Mis apuntes", body: "Se guardan solo en este dispositivo y nunca se envían. Pueden perderse si borras los datos de la aplicación o del navegador.", placeholder: "Escribe observaciones, conexiones o preguntas sobre este artículo…", saved: "Guardado en el dispositivo", clear: "Eliminar apunte", clearConfirm: "¿Eliminar tu apunte personal de este artículo?" },
  ro: { title: "Notițele mele", body: "Sunt păstrate numai pe acest dispozitiv și nu sunt trimise nicăieri. Se pot pierde dacă ștergi datele aplicației sau ale browserului.", placeholder: "Scrie observații, legături sau întrebări despre acest articol…", saved: "Salvat pe dispozitiv", clear: "Șterge notița", clearConfirm: "Ștergi notița personală pentru acest articol?" },
  sq: { title: "Shënimet e mia", body: "Ruhen vetëm në këtë pajisje dhe nuk dërgohen askund. Mund të humbasin nëse fshin të dhënat e aplikacionit ose të shfletuesit.", placeholder: "Shkruaj vërejtje, lidhje ose pyetje për këtë nen…", saved: "U ruajt në pajisje", clear: "Fshi shënimin", clearConfirm: "Ta fshij shënimin personal për këtë nen?" },
  ar: { title: "ملاحظاتي", body: "بتتحفظ على الجهاز ده بس ومش بتتبعت لأي مكان. ممكن تضيع لو مسحت بيانات التطبيق أو المتصفح.", placeholder: "اكتب ملاحظات أو روابط أو أسئلة عن المادة دي…", saved: "اتحفظت على الجهاز", clear: "امسح الملاحظة", clearConfirm: "تمسح ملاحظتك الشخصية للمادة دي؟" },
  fa: { title: "یادداشت‌های من", body: "فقط روی همین دستگاه ذخیره می‌شوند و جایی ارسال نمی‌شوند. با پاک‌کردن داده‌های برنامه یا مرورگر ممکن است از بین بروند.", placeholder: "نکته‌ها، ارتباط‌ها یا پرسش‌های خود درباره این ماده را بنویسید…", saved: "روی دستگاه ذخیره شد", clear: "حذف یادداشت", clearConfirm: "یادداشت شخصی این ماده حذف شود؟" }
};

const ARTICLE_STATUS_COPY = {
  it: { group: "Indicatori di studio", important: "Importante", revisit: "Da rileggere", difficult: "Difficile da capire" },
  en: { group: "Study markers", important: "Important", revisit: "Read again", difficult: "Difficult to understand" },
  es: { group: "Marcadores de estudio", important: "Importante", revisit: "Volver a leer", difficult: "Difícil de entender" },
  ro: { group: "Marcaje de studiu", important: "Important", revisit: "De recitit", difficult: "Dificil de înțeles" },
  sq: { group: "Shenja studimi", important: "I rëndësishëm", revisit: "Për t’u rilexuar", difficult: "I vështirë për t’u kuptuar" },
  ar: { group: "علامات المذاكرة", important: "مهم", revisit: "اقراه تاني", difficult: "صعب يتفهم" },
  fa: { group: "نشان‌های مطالعه", important: "مهم", revisit: "دوباره بخوانم", difficult: "دشوار برای فهم" }
};

const PWA_COPY = {
  it: { title: "Installa PsyEtica", body: "La versione web può funzionare come un’app e continuare a mostrare i contenuti già scaricati anche senza connessione.", ios: "iPhone/iPad: apri il sito in Safari, tocca Condividi, poi Aggiungi alla schermata Home e attiva Apri come app web.", android: "Android: apri il sito in Chrome e scegli Installa app dal menu del browser.", install: "Installa app", installed: "PsyEtica è già aperta come app installata." },
  en: { title: "Install PsyEtica", body: "The web version can work like an app and keep showing downloaded content without a connection.", ios: "iPhone/iPad: open the site in Safari, tap Share, then Add to Home Screen and enable Open as Web App.", android: "Android: open the site in Chrome and choose Install app from the browser menu.", install: "Install app", installed: "PsyEtica is already open as an installed app." },
  es: { title: "Instalar PsyEtica", body: "La versión web puede funcionar como una aplicación y seguir mostrando el contenido descargado sin conexión.", ios: "iPhone/iPad: abre el sitio en Safari, toca Compartir, después Añadir a pantalla de inicio y activa Abrir como app web.", android: "Android: abre el sitio en Chrome y elige Instalar aplicación en el menú.", install: "Instalar aplicación", installed: "PsyEtica ya está abierta como aplicación instalada." },
  ro: { title: "Instalează PsyEtica", body: "Versiunea web poate funcționa ca o aplicație și poate afișa conținutul descărcat fără conexiune.", ios: "iPhone/iPad: deschide site-ul în Safari, apasă Partajare, apoi Adăugați pe ecranul principal și activează Deschideți ca aplicație web.", android: "Android: deschide site-ul în Chrome și alege Instalează aplicația din meniu.", install: "Instalează aplicația", installed: "PsyEtica este deja deschisă ca aplicație instalată." },
  sq: { title: "Instalo PsyEtica", body: "Versioni web mund të funksionojë si aplikacion dhe të shfaqë përmbajtjen e shkarkuar edhe pa lidhje.", ios: "iPhone/iPad: hape faqen në Safari, prek Share, pastaj Add to Home Screen dhe aktivizo Open as Web App.", android: "Android: hape faqen në Chrome dhe zgjidh Install app nga menyja.", install: "Instalo aplikacionin", installed: "PsyEtica është hapur tashmë si aplikacion i instaluar." },
  ar: { title: "ثبّت PsyEtica", body: "نسخة الويب تقدر تشتغل زي التطبيق وتعرض المحتوى اللي اتحمّل حتى من غير إنترنت.", ios: "iPhone/iPad: افتح الموقع في Safari، اضغط مشاركة، وبعدها إضافة إلى الشاشة الرئيسية وفعّل فتح كتطبيق ويب.", android: "Android: افتح الموقع في Chrome واختار تثبيت التطبيق من قائمة المتصفح.", install: "ثبّت التطبيق", installed: "PsyEtica مفتوح بالفعل كتطبيق متثبّت." },
  fa: { title: "نصب PsyEtica", body: "نسخه وب می‌تواند مانند برنامه اجرا شود و محتوای دانلودشده را بدون اینترنت هم نمایش دهد.", ios: "iPhone/iPad: سایت را در Safari باز کنید، Share و سپس Add to Home Screen را بزنید و Open as Web App را فعال کنید.", android: "Android: سایت را در Chrome باز کنید و از منوی مرورگر Install app را بزنید.", install: "نصب برنامه", installed: "PsyEtica هم‌اکنون به‌صورت برنامه نصب‌شده باز است." }
};

const state = {
  language: languageFromLocation() || localStorage.getItem("psyetica.language") || "it",
  theme: localStorage.getItem("psyetica.theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  screen: "articles",
  articleNumber: null,
  italianArticles: [],
  localizedArticles: [],
  italianGlossary: null,
  localizedGlossary: null,
  italianCases: null,
  localizedCases: null,
  sourceCatalog: new Map(),
  search: "",
  flashFilter: "all",
  flashIndex: 0,
  flashRevealed: false,
  shuffledIds: null
};

const main = document.getElementById("main");
const languageSelect = document.getElementById("languageSelect");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const toastElement = document.getElementById("toast");
let toastTimer;
let deferredInstallPrompt = null;

function t(key, replacements = {}) {
  let value = (COPY[state.language] || COPY.it)[key] || COPY.it[key] || key;
  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replace(`{${name}}`, replacement);
  });
  return value;
}

function flashT(key) {
  return (FLASH_FILTER_COPY[state.language] || FLASH_FILTER_COPY.it)[key] || FLASH_FILTER_COPY.it[key] || key;
}

function notesT(key) {
  return (NOTES_COPY[state.language] || NOTES_COPY.it)[key] || NOTES_COPY.it[key] || key;
}

function articleStatusT(key) {
  return (ARTICLE_STATUS_COPY[state.language] || ARTICLE_STATUS_COPY.it)[key] || ARTICLE_STATUS_COPY.it[key] || key;
}

function pwaT(key) {
  return (PWA_COPY[state.language] || PWA_COPY.it)[key] || PWA_COPY.it[key] || key;
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function arr(value) { return Array.isArray(value) ? value : []; }
function currentDirection() { return LANGUAGES.find(item => item.code === state.language)?.dir || "ltr"; }
function localizedClass() { return currentDirection() === "rtl" ? "rtl-text" : ""; }

async function json(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function loadItalianData() {
  const batchNames = ["articles.01-08.it.json", "articles.09-17.it.json", "articles.18-27.it.json", "articles.28-37.it.json", "articles.38-42.it.json"];
  const [batches, glossary, cases] = await Promise.all([
    Promise.all(batchNames.map(name => json(`data/editorial/${name}`))),
    json("data/glossary.it.json"),
    json("data/cases.it.json")
  ]);
  state.italianArticles = batches.flatMap(batch => arr(batch.articles)).sort((a, b) => a.number - b.number);
  state.italianGlossary = glossary;
  state.italianCases = cases;
  state.sourceCatalog.clear();
  batches.flatMap(batch => arr(batch.source_catalog)).forEach(source => state.sourceCatalog.set(source.id, source));
}

async function loadLanguageData(code) {
  if (code === "it") {
    state.localizedArticles = [];
    state.localizedGlossary = null;
    state.localizedCases = null;
    return;
  }
  const [articles, glossary, cases] = await Promise.all([
    json(`data/i18n/${code}/articles.${code}.json`),
    json(`data/i18n/${code}/glossary.${code}.json`),
    json(`data/i18n/${code}/cases.${code}.json`)
  ]);
  state.localizedArticles = arr(articles.articles).sort((a, b) => a.number - b.number);
  state.localizedGlossary = glossary;
  state.localizedCases = cases;
}

function setDocumentLanguage() {
  const lang = LANGUAGES.find(item => item.code === state.language) || LANGUAGES[0];
  const seo = SEO_META[state.language] || SEO_META.it;
  document.documentElement.lang = lang.html || lang.code;
  document.documentElement.dir = lang.dir;
  document.documentElement.dataset.theme = state.theme;
  document.title = seo.title;
  document.getElementById("metaDescription")?.setAttribute("content", seo.description);
  document.getElementById("ogTitle")?.setAttribute("content", seo.title);
  document.getElementById("ogDescription")?.setAttribute("content", seo.description);
  document.getElementById("ogUrl")?.setAttribute("content", `${SITE_ORIGIN}${seo.path}`);
  document.getElementById("ogLocale")?.setAttribute("content", seo.locale);
  document.getElementById("twitterTitle")?.setAttribute("content", seo.title);
  document.getElementById("twitterDescription")?.setAttribute("content", seo.description);
  document.getElementById("canonicalLink")?.setAttribute("href", `${SITE_ORIGIN}${seo.path}`);
  document.querySelectorAll("[data-seo-language]").forEach(link => {
    if (link.dataset.seoLanguage === state.language) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  document.querySelector('meta[name="theme-color"]').content = state.theme === "dark" ? "#081A1D" : "#F4F8F7";
  document.querySelectorAll("[data-i18n]").forEach(node => node.textContent = t(node.dataset.i18n));
  document.getElementById("themeButton").setAttribute("aria-label", state.theme === "dark" ? "Light mode" : "Dark mode");
  if (window.PsyEticaNative) window.PsyEticaNative.setDarkMode(state.theme === "dark");
}

function setActiveNavigation() {
  document.querySelectorAll("#bottomNav [data-screen]").forEach(button => {
    const active = button.dataset.screen === state.screen && state.articleNumber == null;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
}

function scrollTopAndFocus() {
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

function render() {
  setDocumentLanguage();
  setActiveNavigation();
  if (state.articleNumber != null) renderArticle(state.articleNumber);
  else if (state.screen === "flashcards") renderFlashcards();
  else if (state.screen === "about") renderAbout();
  else renderArticles();
}

function chapterLabel(chapter) {
  const source = String(chapter || "");
  if (state.language === "it") return source.replace(/\s*[–-]\s*/, " · ");
  const match = source.match(/Capo\s+(IV|V|III|II|I)\b/i);
  const index = match ? ["I", "II", "III", "IV", "V"].indexOf(match[1].toUpperCase()) : -1;
  return CHAPTER_COPY[state.language]?.[index] || source.replace(/\s*[–-]\s*/, " · ");
}

function articleStatusKey(number, status) { return `psyetica.article.${number}.${status}`; }
function hasArticleStatus(number, status) { return localStorage.getItem(articleStatusKey(number, status)) === "1"; }

function articleStatusSymbols(number) {
  return [
    hasArticleStatus(number, "important") ? "★" : "",
    hasArticleStatus(number, "revisit") ? "↻" : "",
    hasArticleStatus(number, "difficult") ? "❗" : ""
  ].filter(Boolean).join(" ");
}

function renderArticleStatusControls(number) {
  const controls = [
    { status: "important", symbol: "★" },
    { status: "revisit", symbol: "↻" },
    { status: "difficult", symbol: "!" }
  ];
  return `<div class="article-status-actions ${localizedClass()}" role="group" aria-label="${esc(articleStatusT("group"))}">${controls.map(control => {
    const active = hasArticleStatus(number, control.status);
    const label = articleStatusT(control.status);
    return `<button class="article-status ${control.status} ${active ? "active" : ""}" data-article-status="${control.status}" data-status-article="${number}" type="button" aria-pressed="${active}" aria-label="${esc(label)}" title="${esc(label)}"><span aria-hidden="true">${control.symbol}</span><span class="status-label">${esc(label)}</span></button>`;
  }).join("")}</div>`;
}

function renderArticles() {
  const query = state.search.trim().toLocaleLowerCase(state.language);
  const displayArticles = state.language === "it" ? state.italianArticles : state.localizedArticles;
  const filtered = displayArticles.filter(article => {
    const content = state.language === "it"
      ? `${article.editorial_title} ${article.official_text} ${arr(article.tags).join(" ")}`
      : `${article.localized.editorial_title} ${article.localized.article_text} ${arr(article.localized.tags).join(" ")}`;
    return !query || content.toLocaleLowerCase(state.language).includes(query) || String(article.number) === query;
  });

  let currentChapter = null;
  let cards = "";
  filtered.forEach(article => {
    const chapter = state.language === "it" ? article.chapter : article.italian_source.chapter;
    if (chapter !== currentChapter) {
      if (currentChapter !== null) cards += "</div>";
      cards += `<div class="chapter-heading">${esc(chapterLabel(chapter))}</div><div class="article-list">`;
      currentChapter = chapter;
    }
    const title = state.language === "it" ? article.editorial_title : article.localized.editorial_title;
    const preview = state.language === "it" ? article.official_text : article.localized.core_message;
    cards += `
      <article class="article-card">
        <button class="article-open" type="button" data-open-article="${article.number}">
          <span class="article-number">${article.number}</span>
          <span><span class="article-title">${esc(title)}</span><span class="article-preview">${esc(preview)}</span></span>
          <span class="chevron" aria-hidden="true">›</span>
        </button>
        ${renderArticleStatusControls(article.number)}
      </article>`;
  });
  if (currentChapter !== null) cards += "</div>";

  main.innerHTML = `
    <section class="hero ${localizedClass()}">
      <p class="eyebrow">Codice deontologico · Psicologi</p>
      <h1>${esc(t("library"))}</h1>
      <p class="lead">${esc(t("libraryLead"))}</p>
      <div class="hero-stats">
        <span class="stat"><strong>${esc(t("articlesCount"))}</strong></span>
        <span class="stat"><strong>${esc(t("cardsCount"))}</strong></span>
      </div>
    </section>
    <div class="search-wrap"><input class="search-input ${localizedClass()}" id="articleSearch" type="search" value="${esc(state.search)}" placeholder="${esc(t("search"))}" aria-label="${esc(t("search"))}"></div>
    <section id="articleResults">${cards || `<div class="empty">${esc(t("noResults"))}</div>`}</section>`;
  bindArticleListEvents();
}

function bindArticleListEvents() {
  document.getElementById("articleSearch")?.addEventListener("input", event => {
    const caret = event.target.selectionStart;
    state.search = event.target.value;
    renderArticles();
    const next = document.getElementById("articleSearch");
    next.focus();
    next.setSelectionRange(caret, caret);
  });
  document.querySelectorAll("[data-open-article]").forEach(button => button.addEventListener("click", () => openArticle(Number(button.dataset.openArticle))));
  document.querySelectorAll("[data-article-status]").forEach(button => button.addEventListener("click", () => {
    const key = articleStatusKey(Number(button.dataset.statusArticle), button.dataset.articleStatus);
    if (localStorage.getItem(key) === "1") localStorage.removeItem(key); else localStorage.setItem(key, "1");
    const scrollPosition = window.scrollY;
    renderArticles();
    requestAnimationFrame(() => window.scrollTo(0, scrollPosition));
  }));
}

function annotationsForItalian(articleNumber) {
  return arr(state.italianGlossary?.article_annotations).find(item => item.article === articleNumber)?.annotations || [];
}

function highlightText(text, annotations, language, mode) {
  const source = String(text || "");
  const occupied = new Array(source.length).fill(false);
  const ranges = [];
  [...arr(annotations)].sort((a, b) => String(b.surface).length - String(a.surface).length).forEach(annotation => {
    const surface = String(annotation.surface || "");
    if (!surface) return;
    const lowerText = source.toLocaleLowerCase(language);
    const lowerSurface = surface.toLocaleLowerCase(language);
    let index = 0;
    while ((index = lowerText.indexOf(lowerSurface, index)) !== -1) {
      const end = index + surface.length;
      if (!occupied.slice(index, end).some(Boolean)) {
        for (let cursor = index; cursor < end; cursor += 1) occupied[cursor] = true;
        ranges.push({ start: index, end, id: annotation.glossary_id, mode });
      }
      index = Math.max(end, index + 1);
    }
  });
  ranges.sort((a, b) => a.start - b.start);
  let output = "";
  let cursor = 0;
  ranges.forEach(range => {
    output += esc(source.slice(cursor, range.start));
    output += `<mark class="term" tabindex="0" role="button" data-glossary-id="${esc(range.id)}" data-glossary-mode="${range.mode}">${esc(source.slice(range.start, range.end))}</mark>`;
    cursor = range.end;
  });
  output += esc(source.slice(cursor));
  return output;
}

function getItalianArticle(number) { return state.italianArticles.find(article => article.number === number); }
function getLocalizedArticle(number) { return state.localizedArticles.find(article => article.number === number); }

function renderArticleNavigation(number, placement) {
  const index = state.italianArticles.findIndex(article => article.number === number);
  const previousNumber = index > 0 ? state.italianArticles[index - 1].number : null;
  const nextNumber = index >= 0 && index < state.italianArticles.length - 1 ? state.italianArticles[index + 1].number : null;
  const options = state.italianArticles.map(article => {
    const localized = state.language === "it" ? article : getLocalizedArticle(article.number)?.localized;
    const label = localized?.editorial_title || article.editorial_title || `${t("article")} ${article.number}`;
    const markers = articleStatusSymbols(article.number);
    return `<option value="${article.number}" ${article.number === number ? "selected" : ""}>${markers ? `${esc(markers)} · ` : ""}${esc(t("article"))} ${article.number} · ${esc(label)}</option>`;
  }).join("");
  const previousArrow = currentDirection() === "rtl" ? "→" : "←";
  const nextArrow = currentDirection() === "rtl" ? "←" : "→";
  return `
    <nav class="article-navigation ${localizedClass()}" data-placement="${placement}" aria-label="${esc(t("article"))}">
      <button class="article-step" data-open-article="${previousNumber ?? ""}" type="button" ${previousNumber == null ? "disabled" : ""}>${previousArrow} <span>${esc(t("previous"))}</span></button>
      <label class="article-jump"><span class="sr-only">${esc(t("article"))}</span><select class="article-jump-select" aria-label="${esc(t("article"))}">${options}</select></label>
      <button class="article-step" data-open-article="${nextNumber ?? ""}" type="button" ${nextNumber == null ? "disabled" : ""}><span>${esc(t("next"))}</span> ${nextArrow}</button>
    </nav>`;
}

function renderArticle(number) {
  const italian = getItalianArticle(number);
  const translatedRecord = state.language === "it" ? null : getLocalizedArticle(number);
  if (!italian || (state.language !== "it" && !translatedRecord)) {
    state.articleNumber = null;
    renderArticles();
    return;
  }
  const content = state.language === "it" ? italian : translatedRecord.localized;
  const title = content.editorial_title;
  const officialHighlighted = highlightText(italian.official_text, annotationsForItalian(number), "it", "it");
  const translatedHighlighted = translatedRecord
    ? highlightText(content.article_text, content.glossary_annotations, state.language, "localized")
    : "";

  const localizedBlock = translatedRecord ? `
    <section class="content-card localized ${localizedClass()}" lang="${esc(state.language)}" dir="${currentDirection()}">
      <div class="card-kicker">${esc(t("localizedArticle"))} · ${esc(LANGUAGES.find(l => l.code === state.language).native)}</div>
      <p class="article-text" dir="${currentDirection()}">${translatedHighlighted}</p>
      <p class="hint">⌁ ${esc(t("tapTerms"))}</p>
    </section>` : "";

  main.innerHTML = `
    <button class="back-button" id="articleBack" type="button">${currentDirection() === "rtl" ? "→" : "←"} ${esc(t("back"))}</button>
    ${renderArticleNavigation(number, "top")}
    <header class="article-head ${localizedClass()}">
      <p class="chapter-label">${esc(chapterLabel(italian.chapter))}</p>
      <h1>${esc(t("article"))} ${number}</h1>
      <p class="lead">${esc(title)}</p>
    </header>
    <section class="content-card official" lang="it" dir="ltr">
      <div class="card-kicker">IT · ${esc(t("officialItalian"))}</div>
      <p class="article-text" dir="ltr">${officialHighlighted}</p>
      <p class="hint">⌁ ${esc(t("tapTerms"))}</p>
    </section>
    ${localizedBlock}
    <section class="${localizedClass()}" lang="${esc(state.language)}" dir="${currentDirection()}">
      <h2 class="section-title">${esc(t("keyMessage"))}</h2>
      <div class="core-message">${esc(content.core_message)}</div>
      <h2 class="section-title">${esc(state.language === "it" ? t("clauseReading") : t("comments"))}</h2>
      <div class="clause-list">${renderClauses(content)}</div>
      ${renderLearningDetails(content, italian, translatedRecord)}
    </section>
    ${renderArticleNotes(number)}
    ${renderArticleNavigation(number, "bottom")}`;
  document.getElementById("articleBack").addEventListener("click", closeArticle);
  document.querySelectorAll("[data-open-article]").forEach(button => button.addEventListener("click", () => {
    const target = Number(button.dataset.openArticle);
    if (target) openArticle(target);
  }));
  document.querySelectorAll(".article-jump-select").forEach(select => select.addEventListener("change", () => openArticle(Number(select.value))));
  bindArticleEvents();
}

function noteStorageKey(articleNumber) {
  return `psyetica.notes.article.${articleNumber}`;
}

function renderArticleNotes(articleNumber) {
  const value = localStorage.getItem(noteStorageKey(articleNumber)) || "";
  return `
    <section class="personal-notes ${localizedClass()}" lang="${esc(state.language)}" dir="${currentDirection()}">
      <div class="notes-heading"><span class="notes-icon" aria-hidden="true">✎</span><div><h2>${esc(notesT("title"))}</h2><p>${esc(notesT("body"))}</p></div></div>
      <label class="sr-only" for="articleNotes">${esc(notesT("title"))}</label>
      <textarea id="articleNotes" dir="auto" maxlength="20000" placeholder="${esc(notesT("placeholder"))}">${esc(value)}</textarea>
      <div class="notes-footer"><span id="notesStatus" class="small muted" role="status" aria-live="polite">${value ? esc(notesT("saved")) : ""}</span><button id="clearArticleNotes" class="notes-clear" type="button" ${value ? "" : "disabled"}>${esc(notesT("clear"))}</button></div>
    </section>`;
}

function renderClauses(content) {
  if (state.language !== "it") {
    const copy = LEARNING_COPY[state.language] || LEARNING_COPY.en;
    const count = Math.max(1, arr(content.meaning_units).length);
    const fragments = splitIntoClauseCount(content.article_text, count);
    return fragments.map((fragment, index) => `
      <article class="clause">
        <span class="clause-label">${String(index + 1).padStart(2, "0")} · ${esc(copy.clause)}</span>
        <p class="clause-fragment">${esc(fragment)}</p>
        <p class="clause-comment">${esc(copy.clauseNotes[index % copy.clauseNotes.length])}</p>
      </article>`).join("");
  }
  return arr(content.meaning_units).map((unit, index) => {
    const fragment = state.language === "it" ? unit.official_fragment : unit.localized_fragment;
    const comment = state.language === "it" ? unit.comment_it : unit.comment;
    return `<article class="clause"><span class="clause-label">${String(index + 1).padStart(2, "0")} · ${esc(unit.label)}</span><p class="clause-fragment">${esc(fragment)}</p><p class="clause-comment">${esc(comment)}</p></article>`;
  }).join("");
}

function splitIntoClauseCount(text, count) {
  const source = String(text || "").trim();
  let parts = source.split(/(?<=[.!?؟])\s+|[؛;]\s*/u).map(part => part.trim()).filter(Boolean);
  if (parts.length < count) parts = source.split(/(?<=[.!?؟])\s+|[؛;،,]\s*/u).map(part => part.trim()).filter(Boolean);
  if (!parts.length) return [source];
  if (parts.length === count) return parts;
  if (parts.length < count) {
    const words = source.split(/\s+/u);
    return Array.from({ length: count }, (_, index) => words.slice(Math.floor(index * words.length / count), Math.floor((index + 1) * words.length / count)).join(" ")).filter(Boolean);
  }
  return Array.from({ length: count }, (_, index) => parts.slice(Math.floor(index * parts.length / count), Math.floor((index + 1) * parts.length / count)).join(" ")).filter(Boolean);
}

function listHtml(items) {
  return arr(items).length ? `<ul>${arr(items).map(item => `<li>${esc(item)}</li>`).join("")}</ul>` : "";
}

function renderLearningDetails(content, italian, translatedRecord) {
  if (state.language !== "it") return renderLocalizedLearningDetails(content, italian);
  const infringement = content.hypothetical_infringement || {};
  const relatedArticles = arr(infringement.possible_related_articles).map(n => `<button class="badge related-article" data-related-article="${n}" type="button">${esc(t("article"))} ${n}</button>`).join("");
  const caseLinks = renderCaseLinks(content.real_case_links, italian.number);
  const legal = arr(content.legal_connections).map(connection => {
    const source = state.sourceCatalog.get(connection.source_id);
    return `<div class="scenario"><strong>${esc(connection.reference)}</strong><p>${esc(connection.relevance)}</p>${source?.url ? `<a class="source-link external-link" href="${esc(source.url)}">${esc(t("source"))} · ${esc(source.authority || source.title)}</a>` : ""}</div>`;
  }).join("");
  return `
    <h2 class="section-title">${esc(t("practical"))}</h2>
    <details><summary>${esc(t("practical"))}</summary><div class="details-body">${listHtml(content.in_practice)}</div></details>
    <details><summary>${esc(t("mistakes"))}</summary><div class="details-body">${listHtml(content.frequent_mistakes)}</div></details>
    <details><summary>${esc(t("example"))}</summary><div class="details-body"><div class="scenario"><p><strong>${esc(t("example"))}</strong></p><p>${esc(infringement.scenario)}</p><p><strong>${esc(t("analysis"))}</strong></p><p>${esc(infringement.analysis)}</p>${relatedArticles ? `<div class="badge-row"><span class="small muted">${esc(t("related"))}</span>${relatedArticles}</div>` : ""}</div></div></details>
    ${caseLinks ? `<details><summary>${esc(t("cases"))}</summary><div class="details-body">${caseLinks}</div></details>` : ""}
    ${legal ? `<details><summary>${esc(t("connections"))}</summary><div class="details-body">${legal}</div></details>` : ""}`;
}

function renderLocalizedLearningDetails(content, italian) {
  const copy = LEARNING_COPY[state.language] || LEARNING_COPY.en;
  const infringement = content.hypothetical_infringement || {};
  const relatedArticles = arr(infringement.possible_related_articles).map(n => `<button class="badge related-article" data-related-article="${n}" type="button">${esc(t("article"))} ${n}</button>`).join("");
  const caseLinks = renderCaseLinks(content.real_case_links, italian.number);
  const legal = arr(content.legal_connections).map(connection => {
    const source = state.sourceCatalog.get(connection.source_id);
    return `<div class="scenario"><strong>${esc(connection.reference)}</strong><p>${esc(copy.connection(italian.number))}</p>${source?.url ? `<a class="source-link external-link" href="${esc(source.url)}">${esc(t("source"))} · ${esc(source.authority || source.title)}</a>` : ""}</div>`;
  }).join("");
  return `
    <h2 class="section-title">${esc(t("practical"))}</h2>
    <details><summary>${esc(t("practical"))}</summary><div class="details-body">${listHtml(copy.practice)}</div></details>
    <details><summary>${esc(t("mistakes"))}</summary><div class="details-body">${listHtml(copy.mistakes)}</div></details>
    <details><summary>${esc(t("example"))}</summary><div class="details-body"><div class="scenario"><p><strong>${esc(t("example"))}</strong></p><p>${esc(copy.scenario(content.core_message))}</p><p><strong>${esc(t("analysis"))}</strong></p><p>${esc(copy.analysis(italian.number))}</p>${relatedArticles ? `<div class="badge-row"><span class="small muted">${esc(t("related"))}</span>${relatedArticles}</div>` : ""}</div></div></details>
    ${caseLinks ? `<details><summary>${esc(t("cases"))}</summary><div class="details-body">${caseLinks}</div></details>` : ""}
    ${legal ? `<details><summary>${esc(t("connections"))}</summary><div class="details-body">${legal}</div></details>` : ""}`;
}

function renderCaseLinks(links, articleNumber) {
  if (!arr(links).length) return "";
  return arr(links).map(link => {
    const italianCase = arr(state.italianCases?.cases).find(item => item.id === link.case_id);
    const localizedCase = arr(state.localizedCases?.cases).find(item => item.id === link.case_id);
    const note = state.language === "it" ? link.note : (LEARNING_COPY[state.language] || LEARNING_COPY.en).caseNote(articleNumber);
    const sourceRoot = state.language === "it" ? italianCase : localizedCase?.italian_source;
    return `<div class="scenario" style="margin-bottom:10px"><strong>${esc(sourceRoot?.authority || link.case_id)}</strong><p class="small muted">${esc(sourceRoot?.decision || "")}</p><p>${esc(note)}</p>${italianCase?.outcome ? `<p class="small"><strong>${esc(t("caseOutcome"))}:</strong> ${esc(italianCase.outcome)}${italianCase.finality_known === false ? ` · ${esc(t("notKnownFinal"))}` : ""}</p>` : ""}${sourceRoot?.source?.url ? `<a class="source-link external-link" href="${esc(sourceRoot.source.url)}">${esc(t("source"))}</a>` : ""}</div>`;
  }).join("");
}

function bindArticleEvents() {
  document.querySelectorAll("mark.term").forEach(term => {
    term.addEventListener("click", () => showGlossary(term.dataset.glossaryId, term.dataset.glossaryMode, term.textContent));
    term.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); showGlossary(term.dataset.glossaryId, term.dataset.glossaryMode, term.textContent); }
    });
  });
  document.querySelectorAll("[data-related-article]").forEach(button => button.addEventListener("click", () => openArticle(Number(button.dataset.relatedArticle))));
  document.querySelectorAll("a.external-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    openExternal(link.href);
  }));
  const notes = document.getElementById("articleNotes");
  const notesStatus = document.getElementById("notesStatus");
  const clearNotes = document.getElementById("clearArticleNotes");
  if (notes && state.articleNumber != null) {
    const key = noteStorageKey(state.articleNumber);
    notes.addEventListener("input", () => {
      if (notes.value) localStorage.setItem(key, notes.value); else localStorage.removeItem(key);
      notesStatus.textContent = notes.value ? notesT("saved") : "";
      clearNotes.disabled = !notes.value;
    });
    clearNotes.addEventListener("click", () => {
      if (!notes.value || !window.confirm(notesT("clearConfirm"))) return;
      localStorage.removeItem(key);
      notes.value = "";
      notesStatus.textContent = "";
      clearNotes.disabled = true;
      notes.focus();
    });
  }
}

function showGlossary(id, mode, selectedSurface = "") {
  const italian = arr(state.italianGlossary?.entries).find(entry => entry.id === id);
  if (!italian) return;
  const localized = arr(state.localizedGlossary?.entries).find(entry => entry.id === id);
  if (mode === "localized" && localized) {
    showModal(`
      <p class="eyebrow">${esc(t("termDefinition"))}</p>
      <h2>${esc(selectedSurface || localized.term)}</h2>
      <p class="term-italian" lang="it" dir="ltr">IT · ${esc(localized.italian_lemma || italian.lemma)}</p>
      <h3>${esc(t("termDefinition"))} · IT</h3><p lang="it" dir="ltr">${esc(localized.italian_definition || italian.definition_it)}</p>
      <p class="small muted">${esc(t("related"))}: ${arr(localized.related_articles).join(", ")}</p>`);
  } else {
    showModal(`
      <p class="eyebrow">${esc(t("termDefinition"))}</p>
      <h2 lang="it" dir="ltr">${esc(italian.lemma)}</h2>
      <p lang="it" dir="ltr">${esc(italian.definition_it)}</p>
      <p class="small muted"><strong>${esc(t("category"))}:</strong> ${esc(italian.category)} · <strong>${esc(t("related"))}:</strong> ${arr(italian.related_articles).join(", ")}</p>`);
  }
}

function allItalianFlashcards() {
  const cards = state.italianArticles.flatMap(article => arr(article.flashcards).map(card => ({ ...card, article: article.number })));
  if (state.shuffledIds) {
    const order = new Map(state.shuffledIds.map((id, index) => [id, index]));
    cards.sort((a, b) => (order.get(a.id) ?? 9999) - (order.get(b.id) ?? 9999));
  }
  return cards;
}

function filteredFlashcards(cards = allItalianFlashcards()) {
  if (state.flashFilter === "known") return cards.filter(card => cardProgress(card) === "known");
  if (state.flashFilter === "unknown") return cards.filter(card => cardProgress(card) !== "known");
  return cards;
}

function progressKey(card) { return `psyetica.card.it.${card.id}`; }
function cardProgress(card) { return localStorage.getItem(progressKey(card)); }

function renderFlashcards() {
  const allCards = allItalianFlashcards();
  const cards = filteredFlashcards(allCards);
  state.flashIndex = Math.max(0, Math.min(state.flashIndex, cards.length - 1));
  const card = cards[state.flashIndex];
  const reviewed = allCards.filter(item => cardProgress(item)).length;
  const known = allCards.filter(item => cardProgress(item) === "known").length;
  const unknown = allCards.length - known;
  const uiDirection = currentDirection();

  main.innerHTML = `
    <header class="flash-head ${localizedClass()}"><p class="eyebrow">Quiz · Esame di Stato</p><h1>${esc(t("studyTitle"))}</h1><p class="lead">${esc(t("studyLead"))}</p></header>
    <div class="flash-toolbar">
      <div class="segmented flash-filter" role="group" aria-label="${esc(flashT("label"))}">
        <button type="button" data-flash-filter="all" class="${state.flashFilter === "all" ? "active" : ""}">${esc(flashT("all"))}<span>${allCards.length}</span></button>
        <button type="button" data-flash-filter="known" class="${state.flashFilter === "known" ? "active" : ""}">${esc(flashT("known"))}<span>${known}</span></button>
        <button type="button" data-flash-filter="unknown" class="${state.flashFilter === "unknown" ? "active" : ""}">${esc(flashT("unknown"))}<span>${unknown}</span></button>
      </div>
      <button class="shuffle-button" id="shuffleCards" type="button">↝ ${esc(t("shuffle"))}</button>
    </div>
    <p class="small muted ${localizedClass()}">${esc(flashT("italianOnly"))}</p>
    <div class="review-summary ${localizedClass()}"><div class="review-stat"><strong>${reviewed}</strong>${esc(t("reviewed"))}</div><div class="review-stat"><strong>${known}</strong>${esc(flashT("known"))}</div><div class="review-stat"><strong>${unknown}</strong>${esc(flashT("unknown"))}</div></div>
    ${card ? `<div class="progress-line"><span>${esc(t("article"))} ${card.article}</span><span>${esc(t("cardOf", { current: state.flashIndex + 1, total: cards.length }))}</span></div>
    <div class="progress-track"><div class="progress-fill" style="width:${((state.flashIndex + 1) / cards.length) * 100}%"></div></div>
    <article class="flashcard" lang="it" dir="ltr">
      <div class="flash-meta"><span>${esc(card.type)}</span><span lang="${esc(state.language)}" dir="${uiDirection}">${esc(t("article"))} ${card.article}</span></div>
      <p class="flash-question">${esc(card.front)}</p>
      ${state.flashRevealed ? `<div><p class="eyebrow">${esc(t("answer"))}</p><p class="flash-answer">${esc(card.back)}</p></div>` : `<button class="reveal-button" id="revealCard" type="button">${esc(t("showAnswer"))}</button>`}
    </article>
    ${state.flashRevealed ? `<div class="review-actions"><button class="again" data-rate="again" type="button">↺ ${esc(t("again"))}</button><button class="known" data-rate="known" type="button">✓ ${esc(t("known"))}</button></div>` : ""}
    <div class="card-nav"><button id="previousCard" type="button">${uiDirection === "rtl" ? "›" : "‹"} ${esc(t("previous"))}</button><button id="nextCard" type="button">${esc(t("next"))} ${uiDirection === "rtl" ? "‹" : "›"}</button></div>` : `<div class="empty">${esc(flashT("empty"))}</div>`}
    <button class="back-button" style="margin-top:18px" id="resetProgress" type="button">${esc(t("reset"))}</button>`;
  bindFlashcardEvents(allCards, cards, card);
}

function renderFlashcardsPreservingScroll() {
  const scrollPosition = window.scrollY;
  renderFlashcards();
  requestAnimationFrame(() => window.scrollTo(0, scrollPosition));
}

function bindFlashcardEvents(allCards, cards, card) {
  document.querySelectorAll("[data-flash-filter]").forEach(button => button.addEventListener("click", () => {
    state.flashFilter = button.dataset.flashFilter;
    state.flashIndex = 0;
    state.flashRevealed = false;
    renderFlashcardsPreservingScroll();
  }));
  document.getElementById("shuffleCards")?.addEventListener("click", () => {
    const ids = allCards.map(item => item.id);
    for (let index = ids.length - 1; index > 0; index -= 1) {
      const random = Math.floor(Math.random() * (index + 1));
      [ids[index], ids[random]] = [ids[random], ids[index]];
    }
    state.shuffledIds = ids;
    state.flashIndex = 0;
    state.flashRevealed = false;
    renderFlashcardsPreservingScroll();
  });
  document.getElementById("revealCard")?.addEventListener("click", () => { state.flashRevealed = true; renderFlashcardsPreservingScroll(); });
  document.getElementById("previousCard")?.addEventListener("click", () => moveCard(-1, cards.length));
  document.getElementById("nextCard")?.addEventListener("click", () => moveCard(1, cards.length));
  document.querySelectorAll("[data-rate]").forEach(button => button.addEventListener("click", () => {
    localStorage.setItem(progressKey(card), button.dataset.rate);
    const nextCards = filteredFlashcards(allCards);
    state.flashIndex = nextCards.length < cards.length
      ? Math.min(state.flashIndex, Math.max(0, nextCards.length - 1))
      : nextCards.length ? (state.flashIndex + 1) % nextCards.length : 0;
    state.flashRevealed = false;
    renderFlashcardsPreservingScroll();
  }));
  document.getElementById("resetProgress")?.addEventListener("click", () => {
    allCards.forEach(item => localStorage.removeItem(progressKey(item)));
    state.flashFilter = "all";
    state.flashIndex = 0;
    state.flashRevealed = false;
    showToast(t("resetDone"));
    renderFlashcardsPreservingScroll();
  });
}

function moveCard(delta, length) {
  if (!length) return;
  state.flashIndex = (state.flashIndex + delta + length) % length;
  state.flashRevealed = false;
  renderFlashcardsPreservingScroll();
}

function renderAbout() {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  main.innerHTML = `
    <section class="hero ${localizedClass()}"><p class="eyebrow">PsyEtica</p><h1>${esc(t("whyTitle"))}</h1><p class="lead">${esc(t("whyBody"))}</p></section>
    <div class="about-grid ${localizedClass()}">
      <article class="about-card"><h2>${esc(t("privacyTitle"))}</h2><p>${esc(t("privacyBody"))}</p></article>
      <article class="about-card"><h2>${esc(t("languageTitle"))}</h2><p>${esc(INFO_TRANSLATION_NOTE[state.language] || INFO_TRANSLATION_NOTE.it)}</p></article>
      <article class="about-card"><h2>${esc(pwaT("title"))}</h2><p>${esc(pwaT("body"))}</p>${standalone ? `<p class="install-status">✓ ${esc(pwaT("installed"))}</p>` : `<ul class="install-steps"><li>${esc(pwaT("ios"))}</li><li>${esc(pwaT("android"))}</li></ul>${deferredInstallPrompt ? `<button class="install-button" id="installPwa" type="button">↓ ${esc(pwaT("install"))}</button>` : ""}`}</article>
      <article class="about-card"><h2>${esc(t("sourcesTitle"))}</h2><p>${esc(t("sourcesBody"))}</p><a href="https://www.psy.it/la-professione-psicologica/codice-deontologico-degli-psicologi-italiani/codice-deontologico-vigente/" class="source-link external-link">${esc(t("officialSite"))}</a></article>
      <article class="about-card"><h2>${esc(t("supportTitle"))}</h2><p>${esc(KO_FI_BODY[state.language] || KO_FI_BODY.it)}</p><button class="support-button" id="aboutShare" type="button">♥ Ko-fi</button></article>
    </div>
    <p class="release-note">${esc(t("version"))} · © 2026 Mohamad-k97 · <a href="${LICENSE_URL}" class="license-link external-link">AGPL-3.0-or-later</a></p>`;
  document.querySelectorAll("a.external-link").forEach(link => link.addEventListener("click", event => { event.preventDefault(); openExternal(link.href); }));
  document.getElementById("aboutShare")?.addEventListener("click", () => openExternal(SUPPORT_URL));
  document.getElementById("installPwa")?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    await deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    renderAbout();
  });
}

function openArticle(number) {
  state.articleNumber = number;
  render();
  scrollTopAndFocus();
}

function closeArticle() {
  state.articleNumber = null;
  render();
  scrollTopAndFocus();
}

function navigate(screen) {
  state.screen = screen;
  state.articleNumber = null;
  render();
  scrollTopAndFocus();
}

function showModal(html) {
  modalContent.innerHTML = html;
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

function showSupport() {
  openExternal(SUPPORT_URL);
}

function shareApp() {
  if (window.PsyEticaNative) window.PsyEticaNative.share(t("shareTitle"), t("shareText"));
  else if (navigator.share) navigator.share({ title: t("shareTitle"), text: t("shareText") });
  closeModal();
}

function openExternal(url) {
  if (window.PsyEticaNative) window.PsyEticaNative.openUrl(url);
  else window.open(url, "_blank", "noopener");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.classList.add("show");
  toastTimer = setTimeout(() => toastElement.classList.remove("show"), 1800);
}

async function changeLanguage(code) {
  const preserveFlashcardScroll = state.screen === "flashcards" && state.articleNumber == null;
  const scrollPosition = window.scrollY;
  state.language = code;
  localStorage.setItem("psyetica.language", code);
  syncLanguageUrl(code);
  state.flashIndex = 0;
  state.flashRevealed = false;
  state.shuffledIds = null;
  main.innerHTML = `<div class="loading"><span class="loader"></span><p>…</p></div>`;
  try {
    await loadLanguageData(code);
    render();
    if (preserveFlashcardScroll) requestAnimationFrame(() => window.scrollTo(0, scrollPosition)); else scrollTopAndFocus();
  } catch (error) {
    console.error(error);
    main.innerHTML = `<div class="empty">${esc(t("loadingError"))}</div>`;
  }
}

function configureGlobalEvents() {
  languageSelect.innerHTML = LANGUAGES.map(language => `<option value="${language.code}">${esc(language.native)}</option>`).join("");
  languageSelect.value = state.language;
  languageSelect.addEventListener("change", event => changeLanguage(event.target.value));
  document.getElementById("themeButton").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("psyetica.theme", state.theme);
    setDocumentLanguage();
  });
  document.getElementById("supportButton").addEventListener("click", showSupport);
  document.getElementById("homeButton").addEventListener("click", () => navigate("articles"));
  document.querySelectorAll("#bottomNav [data-screen]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.screen)));
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", event => { if (event.target === modalBackdrop) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !modalBackdrop.hidden) closeModal(); });
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (state.screen === "about" && state.articleNumber == null) renderAbout();
  });
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    if (state.screen === "about" && state.articleNumber == null) renderAbout();
  });
}

window.PsyEticaApp = {
  back() {
    if (!modalBackdrop.hidden) { closeModal(); return true; }
    if (state.articleNumber != null) { closeArticle(); return true; }
    if (state.screen !== "articles") { navigate("articles"); return true; }
    return false;
  }
};

async function init() {
  if (!LANGUAGES.some(language => language.code === state.language)) state.language = "it";
  configureGlobalEvents();
  setDocumentLanguage();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    navigator.serviceWorker.register("./service-worker.js?v=seo-20260819")
      .then(registration => registration.update())
      .catch(error => console.warn("Service worker registration failed", error));
  }
  try {
    await loadItalianData();
    await loadLanguageData(state.language);
    render();
  } catch (error) {
    console.error(error);
    main.innerHTML = `<div class="empty">${esc(t("loadingError"))}</div>`;
  }
}

init();
