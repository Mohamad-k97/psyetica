# Handoff delle fonti multilingue

Data: 13 agosto 2026  
Lingue: italiano, inglese, spagnolo, romeno, albanese, arabo e persiano

## Contratto della pagina articolo

L'app deve caricare `data/i18n/languages.json` e rispettare questo ordine:

1. mostrare sempre il testo italiano ufficiale, indipendentemente dalla lingua scelta;
2. se la lingua è italiana, mostrare subito dopo commenti ed esempi italiani;
3. se la lingua non è italiana, mostrare il testo non ufficiale dell'articolo nella lingua scelta e poi i relativi commenti;
4. rendere visibile l'avvertenza che la traduzione è una bozza didattica e che il testo italiano è il riferimento;
5. applicare `dir="rtl"` ai contenitori localizzati arabi e persiani, lasciando `dir="ltr"` al blocco italiano e ai riferimenti latini;
6. rendere disponibili le flashcard italiane e quelle della lingua selezionata.

## Pop-up terminologici

Nel testo italiano si usano le annotazioni di `data/glossary.it.json`: il pop-up mostra la definizione editoriale italiana.

Nelle altre lingue si usano le `glossary_annotations` contenute in ciascun articolo localizzato. Il campo `surface` è sempre una sottostringa esatta del testo visualizzato e il pop-up rinvia a:

- `italian_surface`: forma presente nell'articolo italiano;
- `italian_lemma`: lemma italiano comune;
- voce omonima per `glossary_id` nel glossario localizzato, che conserva anche `italian_definition`.

La chiave `glossary_id` è stabile fra tutte le lingue. Non associare i pop-up mediante posizione numerica nel testo.

Gli ancoraggi hanno tre livelli:

- `exact_in_localized_article`: il termine controllato era già presente;
- `terminology_enforced_exact_in_localized_article` con `match_method: exact_contextual_surface`: sostituzione di una resa contestuale esatta;
- `terminology_enforced_exact_in_localized_article` con `match_method: fuzzy_contextual_surface_needs_language_review`: il termine è ora evidenziabile, ma la frase selezionata deve essere controllata da un revisore madrelingua.

Tutti i 954 ancoraggi non italiani sono tecnicamente risolti. Una parte consistente resta intenzionalmente marcata per controllo umano, soprattutto nelle lingue prodotte mediante passaggio intermedio dall'inglese.

## Flashcard

Gli identificativi sono uguali in ogni lingua, per esempio `12-f3`. Questo consente di mantenere un unico stato utente per:

- ultima risposta;
- livello di padronanza;
- intervallo di ripetizione;
- preferenza fra carta italiana e localizzata.

La coppia italiana non va sostituita dalla traduzione. In modalità non italiana l'interfaccia può offrire un comando rapido per alternare le due versioni.

## Stato editoriale e revisione

Le traduzioni sono state generate localmente mediante Argos Translate. Inglese deriva direttamente dall'italiano; spagnolo, romeno, albanese, arabo e persiano usano un passaggio intermedio inglese. Alcuni termini ad alto rischio sono stati sostituiti con equivalenti controllati ricavati da fonti professionali della lingua, registrate in `data/i18n/terminology-sources.json`.

Ogni file e articolo conserva lo stato `machine_draft_needs_native_legal_review` o `machine_draft`. Questo stato non deve essere rimosso fino a quando non siano completati almeno:

1. revisione madrelingua dell'intero articolo e dei commenti;
2. revisione giuridico-deontologica del testo normativo tradotto;
3. controllo di termini legati all'ordinamento italiano, come Albo, Ordine, referto, denuncia, Autorità Tutoria, responsabilità disciplinare e procacciamento della clientela;
4. controllo prioritario degli ancoraggi fuzzy;
5. verifica di tutte le forme storiche o non perfettamente equivalenti nell'ordinamento di arrivo.

## Verifica automatica

`python scripts/validate_editorial.py` controlla ora anche:

- presenza di 42 articoli e 168 flashcard per lingua;
- identità del testo italiano incorporato con il corpus ufficiale;
- direzione RTL per arabo e persiano;
- corrispondenza di tutti i 114 identificativi di glossario;
- presenza esatta nel testo di ogni superficie evidenziabile;
- assenza di caratteri di sostituzione Unicode, termini eccessivamente lunghi e sequenze sospette di parole ripetute;
- copertura terminologica delle sette lingue.

