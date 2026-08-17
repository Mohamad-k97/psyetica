# Dossier per la fase italiana

## Risultato della verifica

La base dell'app deve essere il testo che il CNOP presenta oggi come vigente. La revisione
approvata nel 2023 è rimasta in vigore dal 1 dicembre 2023 al 24 dicembre 2024, ma la
sentenza del Consiglio di Stato n. 10376/2024 ha invalidato la procedura referendaria. Dal
24 dicembre 2024 è quindi tornato applicabile il testo precedente. Il CNOP ha dichiarato
nel programma 2025–2029 di voler avviare una nuova revisione.

Conseguenza di prodotto: il Codice non può essere memorizzato nell'app come testo senza
data. Ogni release e ogni record devono riportare stato, data di efficacia, fonte, data
dell'ultimo controllo e versione. La versione 2023 può essere conservata in una sezione
storica, ma non deve comparire come vigente.

Il testo vigente completo, composto da 42 articoli, è stato estratto dalla pagina ufficiale
CNOP in `data/articles.it.json`. Lo script riproducibile è
`scripts/extract_cnop_code.py`.

## Gerarchia editoriale

1. **Testo ufficiale** — riprodotto senza parafrasi e con la fonte CNOP.
2. **Collegamenti normativi** — leggi e regolamenti che incidono sul significato operativo.
3. **Commento didattico originale** — comprensibile, ma rigoroso e corredato di fonti.
4. **Esempio ipotetico** — scenario inventato, sempre marcato come tale.
5. **Caso reale anonimizzato** — solo quando è pubblicamente documentato; deve includere
   autorità, data, articoli, esito e stato delle impugnazioni.
6. **Controesempio** — condotta contestata ma non ritenuta illecita, utile per evitare
   interpretazioni eccessive.

Il commento non va presentato come “interpretazione ufficiale”. Anche il volume
istituzionale delle 100 domande e risposte precisa di non contenere interpretazioni
autentiche.

## Struttura di ogni articolo

Ogni scheda italiana dovrebbe contenere:

- numero, Capo e testo ufficiale;
- indicazione “testo vigente dal 24/12/2024” e link alla fonte;
- titolo redazionale breve, esplicitamente non ufficiale;
- scomposizione in unità di significato;
- commento per ogni unità;
- “in pratica” con gli obblighi essenziali;
- “attenzione a” con gli errori frequenti;
- norme collegate;
- un esempio ipotetico di possibile violazione;
- quando disponibile, un caso reale e un controesempio;
- tag per contesto: clinica, ricerca, forense, minori, gruppi, lavoro, online, pubblicità,
  colleganza;
- data e identità del revisore professionale.

La scomposizione non deve fingere che esistano commi che il testo non numera. Useremo
“unità di significato” e numeri redazionali. La prima segmentazione automatica presente nel
JSON separa frasi e punti e virgola ed è marcata come bozza. Prima di scrivere il commento,
un redattore dividerà ulteriormente una frase alla virgola solo quando la virgola separa
obblighi, condizioni o destinatari realmente autonomi.

Esempio di record editoriale:

```json
{
  "article": 7,
  "segment_id": "7-s2",
  "official_fragment": "...",
  "comment_it": "...",
  "legal_links": ["legge o principio pertinente"],
  "sources": ["source-id"],
  "review": {
    "content_status": "draft|reviewed|approved",
    "reviewed_by": null,
    "reviewed_on": null
  }
}
```

## Copertura delle fonti per gruppi di articoli

| Articoli | Temi | Fonti prioritarie |
|---|---|---|
| 1–8 | vincolatività, responsabilità, rispetto, competenza, autonomia, validità, abusivismo | Codice CNOP; L. 56/1989; regolamenti disciplinari; casistica ordinistica; Cass. 31972/2018 e 7362/2025 |
| 9–10 | ricerca su persone e animali | Codice etico AIP 2022; GDPR; normativa sulla sperimentazione animale da aggiungere alla verifica puntuale |
| 11–17 | segreto, testimonianza, denuncia/referto, collaborazione, anonimato, custodia | c.p.p. art. 200; c.p. art. 622; GDPR; parere OPER sul referto; 100 domande e risposte |
| 18–21 | libertà di scelta, selezione, docenza, strumenti riservati | approfondimento OPER sull'art. 21; L. 56/1989; AIP per ricerca e insegnamento |
| 22–32 | non lesività, compenso, informazione/consenso, diagnosi, conflitti, interruzione, commistioni, minori, terzo committente | L. 219/2017; 100 domande e risposte; contributi dell'Ordine Veneto sul consenso; delibere e Cass. 31972/2018 |
| 33–40 | colleganza, sviluppo scientifico, fonti, giudizi sui colleghi, competenze, decoro, titoli, pubblicità | AIP; delibere disciplinari OPER; indirizzi CNOP/territoriali sulla pubblicità da verificare articolo per articolo |
| 41–42 | osservatorio e vigenza | CNOP; L. 56/1989; sentenza Consiglio di Stato 10376/2024; cronologia delle versioni |

## Casistica già disponibile

`data/cases.it.json` contiene otto schede iniziali:

- cinque decisioni ordinistiche ufficiali e anonimizzate;
- due decisioni della Cassazione con sanzione, prescrizione o profili procedurali;
- un controesempio della Cassazione sull'espressione di opinioni scientifiche nel dibattito
  sul counseling.

Queste schede coprono già gli artt. 2, 3, 4, 7, 8, 11, 21, 22, 26, 31, 37–40. Per gli
altri articoli è preferibile, in assenza di una decisione pubblica solida, usare scenari
ipotetici realistici invece di descrivere come “reale” un fatto non verificabile.

## Indicazioni ricavate dai dati dell'Ordine Veneto

Nel contributo sulla Commissione Deontologia 2020–2024, l'Ordine Veneto segnala tra gli
articoli più ricorrenti nei procedimenti aperti quelli relativi ad autonomia, validità dei
dati, rispetto, consenso, astensione/conflitti, commistioni tra ruolo e vita privata,
strumenti e risultati, decoro, presentazione professionale, pubblicità, segreto e minori.
Questo suggerisce di dare priorità editoriale agli artt. 4, 6, 7, 11, 24–26, 28, 31 e
38–40, senza trasformare quei dati territoriali in statistiche nazionali.

## Piano di redazione italiana

La redazione può procedere in sette lotti, con revisione dopo ciascun lotto:

1. artt. 1–8 — principi e responsabilità;
2. artt. 9–17 — ricerca e segreto;
3. artt. 18–24 — scelta, formazione, non lesività, compenso e consenso;
4. artt. 25–32 — valutazione, conflitti, limiti relazionali e minori;
5. artt. 33–40 — colleghi, società, titoli e pubblicità;
6. artt. 41–42 — attuazione, storia e vigenza;
7. controllo trasversale di coerenza, terminologia, rinvii e casistica.

Ogni lotto passa da bozza a revisione deontologico-giuridica e infine ad approvazione.
Le flashcard italiane vanno generate solo dal contenuto approvato, così non si consolidano
semplificazioni o versioni obsolete.

## Preparazione alla traduzione

Per le lingue non italiane l'interfaccia dovrebbe mostrare sempre:

- il testo italiano vigente e autorevole;
- una traduzione giuridica dichiarata non ufficiale;
- il commento nella lingua scelta, con tono più accessibile;
- la fonte italiana e la data di controllo.

Ogni traduzione deve essere prodotta da una memoria terminologica controllata e revisionata
da una persona con competenza giuridica nella lingua di arrivo. Non basta una traduzione
letterale: termini come *Albo*, *Ordine*, *segreto professionale*, *referto*, *denuncia*,
*potestà/responsabilità genitoriale*, *committente*, *destinatario*, *censura* e *radiazione*
non hanno sempre equivalenti uno-a-uno.

Arabo e persiano richiedono inoltre layout RTL, numeri e citazioni bidirezionali testati,
mentre il testo italiano deve restare LTR anche dentro la pagina RTL.

## Flashcard per la Prova Pratico Valutativa/Esame di Stato

La sezione studio dovrebbe includere almeno quattro famiglie di carte:

- richiamo: “Qual è il nucleo dell'art. 7?”;
- riconoscimento: scegliere l'articolo pertinente a un breve scenario;
- discriminazione: distinguere segreto, testimonianza, referto e denuncia;
- collegamento: individuare due o più articoli che operano insieme.

Ogni risposta deve mostrare il frammento ufficiale pertinente e una spiegazione, non solo
il numero dell'articolo. I casi reali possono diventare carte avanzate soltanto mantenendo
l'esito processuale esatto.

## Questioni ancora aperte prima del rilascio pubblico

- verifica legale del diritto di riproduzione integrale del testo CNOP e delle condizioni
  d'uso del sito;
- revisore deontologico-giuridico nominato per commenti e traduzioni;
- politica di aggiornamento quando il CNOP pubblicherà una nuova revisione;
- verifica puntuale delle norme esterne articolo per articolo;
- controllo privacy delle sintesi dei casi;
- definizione chiara che l'app è didattica e non sostituisce pareri dell'Ordine o consulenza
  legale su casi concreti.
