# CD PSI — materiali di base

Raccolta iniziale per un'app didattica sul Codice Deontologico degli Psicologi Italiani.

## App Android

Il prototipo Android offline è in `android-app/`. Include navigazione degli articoli,
commento per clausole, evidenziazioni terminologiche con pop-up, casi e fonti,
168 flashcard italiane con progresso locale e filtri per conosciute/da rivedere,
appunti personali per articolo, sette lingue di interfaccia con LTR/RTL, modalità scura e
un comando di supporto/condivisione sempre visibile. Non richiede login e non esegue
tracciamento.

L'APK di sviluppo aggiornato è `dist/PsyEtica-0.4.0-debug.apk`. È firmato con una
chiave Android di debug ed è adatto a installazione e collaudo interno; per la
distribuzione pubblica servirà una build release firmata con la chiave del progetto.

## PWA

Gli stessi asset in `android-app/app/src/main/assets/www/` formano una Progressive
Web App installabile. `manifest.webmanifest`, `service-worker.js` e le icone in
`icons/` permettono l'installazione e il funzionamento offline su browser compatibili.
Per pubblicarla come sito statico, usa quella cartella come directory di deploy; il
pacchetto pronto per l'upload è `dist/PsyEtica-PWA-0.4.0.zip`.

### Pubblicazione con Cloudflare Workers

Il file `wrangler.jsonc` configura il progetto come Worker di soli asset statici e
indica `android-app/app/src/main/assets/www` come directory della PWA. Collegando il
repository a Workers Builds, usa il branch `main`, nessun build command e il deploy
command predefinito `npx wrangler deploy`.

Cloudflare pubblicherà automaticamente ogni nuovo push su `main`. Dopo il primo
deploy, il dominio si associa da **Settings > Domains & Routes > Add > Custom
Domain**; non serve copiare manualmente gli asset né mantenere un server applicativo.

Le note personali e il progresso delle flashcard restano nello spazio locale del
browser o dell'app installata: non vengono sincronizzati tra dispositivi e possono
andare persi cancellando i dati del sito o dell'app.

- `data/articles.it.json`: testo vigente dei 42 articoli, estratto dalla pagina ufficiale CNOP.
- `data/cases.it.json`: prime sintesi originali di casi pubblici, con esito e fonti.
- `data/glossary.it.json`: glossario italiano con definizioni editoriali, note di
  traduzione e ancoraggi testuali esatti per i futuri pop-up.
- `data/cross_references.it.json`: gruppi tematici e catene di collegamento fra
  articoli, con le distinzioni concettuali da preservare nell'app.
- `data/i18n/languages.json`: manifest delle sette lingue, direzione di scrittura
  e contratto di visualizzazione per pagine articolo, pop-up e flashcard.
- `data/i18n/{en,es,ro,sq,ar,fa}/articles.*.json`: testo editoriale non ufficiale dell'articolo,
  commenti, esempi e collegamenti; ogni record conserva anche il testo italiano
  ufficiale da mostrare per primo. Le flashcard localizzate restano nei materiali
  sorgente storici, ma non vengono incluse negli asset né mostrate dall'app.
- `data/i18n/{en,es,ro,sq,ar,fa}/glossary.*.json`: ponte terminologico verso lemma,
  forma testuale e definizione editoriale italiani.
- `data/i18n/{en,es,ro,sq,ar,fa}/cases.*.json`: registro dei nove casi con fonte,
  esito e sintesi italiana invariati e con le note contestuali localizzate.
- `data/i18n/terminology-sources.json`: fonti professionali e terminologiche per
  il controllo linguistico successivo.
- `data/editorial/articles.01-08.it.json`: prima bozza completa delle schede didattiche
  italiane per gli articoli 1-8, con unità di significato, commenti, esempi, casi e flashcard.
- `data/editorial/articles.09-17.it.json`: secondo lotto italiano, dedicato a ricerca,
  animali, segreto professionale, testimonianza, referto/denuncia, gruppi,
  collaborazione, comunicazioni scientifiche e documentazione.
- `data/editorial/articles.18-27.it.json`: terzo lotto italiano, dedicato a libertà
  di scelta, selezione, formazione, strumenti riservati, non lesività, compenso,
  consenso, valutazioni commissionate, astensione e interruzione della terapia.
- `data/editorial/articles.28-37.it.json`: quarto lotto italiano, dedicato a confini
  professionali, presidi e compensi, persone minorenni, committenza, colleganza,
  ricerca, reputazione professionale e limiti di competenza.
- `data/editorial/articles.38-42.it.json`: quinto e ultimo lotto italiano, dedicato
  a decoro, presentazione professionale, pubblicità e norme di attuazione.
- `research/SOURCE_REGISTRY.md`: registro ragionato delle fonti e limiti di riuso.
- `research/ITALIAN_MATERIALS_DOSSIER.md`: metodo e piano per i commenti italiani,
  traduzioni future e flashcard.
- `research/EDITORIAL_REVIEW_01-08.md`: controlli eseguiti e questioni aperte per la
  revisione professionale del primo lotto.
- `research/EDITORIAL_REVIEW_09-17.md`: controlli e questioni giuridiche da mantenere
  nella revisione specialistica del secondo lotto.
- `research/EDITORIAL_REVIEW_18-27.md`: controlli e cautele interpretative per il
  terzo lotto.
- `research/EDITORIAL_REVIEW_28-37.md`: controlli e cautele interpretative per il
  quarto lotto, con particolare attenzione alla disciplina attuale dei minori.
- `research/EDITORIAL_REVIEW_38-42.md`: controlli e cautele interpretative per il
  lotto conclusivo, inclusi pubblicità, Osservatorio, referendum e vigenza.
- `research/CROSS_ARTICLE_CONSISTENCY_REVIEW.md`: revisione trasversale di
  terminologia, ruoli, consenso, segreto, competenza, casi e aree ancora aperte.
- `research/sources/`: copie di lavoro delle fonti istituzionali selezionate.
- `scripts/extract_cnop_code.py`: estrazione riproducibile del testo ufficiale.
- `scripts/validate_editorial.py`: controllo di fedeltà del testo, fonti, casi e flashcard.
- `scripts/generate_translations.py`: generazione riproducibile delle bozze
  multilingue tramite modelli neurali locali e terminologia controllata.
- `data/i18n/manual/`: riscritture editoriali dirette, articolo per articolo, in
  inglese britannico, spagnolo, romeno, albanese, arabo egiziano e persiano iraniano.
- `scripts/apply_manual_translations.py`: applica in modo deterministico le
  riscritture editoriali e aggiorna gli asset Android senza servizi di traduzione esterni.
- `scripts/build_localized_case_sources.py`: consolida le note di caso tradotte
  presenti nelle schede in registri localizzati autonomi.

Il testo attualmente pubblicato dal CNOP come vigente è quello ripristinato dal 24 dicembre
2024 dopo la sentenza del Consiglio di Stato n. 10376/2024. La revisione 2023 non deve
essere mostrata come vigente.

Per rigenerare il dataset italiano:

```powershell
python scripts\extract_cnop_code.py
python scripts\validate_editorial.py
```

Le fonti multilingue generate sono bozze automatiche, non traduzioni ufficiali.
Prima della pubblicazione vanno revisionate da una persona madrelingua con competenza
giuridico-professionale. Gli ancoraggi marcati
`fuzzy_contextual_surface_needs_language_review` sono esatti nel testo visualizzato,
ma la selezione della frase sostituita richiede particolare controllo umano.

I commenti, gli esempi e le traduzioni non costituiscono interpretazione ufficiale o
consulenza legale e dovranno essere sottoposti a revisione professionale prima della
pubblicazione.

La prima bozza editoriale italiana copre ora tutti i 42 articoli. È stato completato
anche un controllo trasversale editoriale e tecnico, ma tutte le schede restano in
stato `draft`: prima di congelare le traduzioni giuridiche multilingue servirà una
revisione deontologica e legale. Nel frattempo i dati possono essere usati per il
prototipo dell'app, mostrando chiaramente che commenti e definizioni non sono ufficiali.
