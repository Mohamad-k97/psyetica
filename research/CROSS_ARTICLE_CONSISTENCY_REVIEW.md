# Revisione trasversale delle schede italiane

Data del controllo: 13 agosto 2026  
Copertura: articoli 1-42  
Stato: controllo editoriale e tecnico completato; revisione deontologica e legale non ancora eseguita

## Esito

Le 42 schede usano ora un impianto editoriale coerente. Il validatore conferma che:

- il testo ufficiale riportato in ogni scheda coincide esattamente con il corpus CNOP;
- le 147 unità di significato ricompongono integralmente il testo, senza omissioni sostanziali;
- ogni esempio resta qualificato come ipotetico e non come violazione automaticamente accertata;
- i collegamenti a casi reali distinguono l'accertamento da collegamenti, controesempi, limiti probatori ed esiti non di merito;
- le fonti ripetute tra lotti usano lo stesso identificativo e gli stessi metadati essenziali;
- 114 concetti di glossario sono ancorati mediante 159 espressioni testuali esatte;
- 14 gruppi tematici e 8 catene dirette rendono espliciti i rapporti fra articoli.

Questo controllo migliora coerenza, tracciabilità e fruibilità didattica. Non attesta la correttezza giuridica definitiva dei commenti e non sostituisce il controllo di uno psicologo con esperienza deontologica e di un giurista.

## Regole terminologiche adottate

### Ruoli delle persone

I termini ufficiali restano invariati nelle citazioni. Nei commenti si identifica invece il ruolo concreto prima di scegliere la parola:

- **committente**: chi conferisce l'incarico;
- **destinatario della prestazione**: persona verso cui l'attività è diretta;
- **utente**: termine ampio usato dal Codice in più contesti;
- **cliente**: appropriato nel rapporto professionale o commerciale quando non implica necessariamente un trattamento sanitario;
- **paziente**: riservato ai contesti di cura o terapia in cui il termine è pertinente;
- **partecipante o soggetto di ricerca**: non va assimilato automaticamente a cliente o paziente.

Committente, pagatore, destinatario, persona valutata e titolare del consenso possono coincidere, ma non devono essere trattati come sinonimi. Questa distinzione è centrale soprattutto negli articoli 4, 12, 18, 24, 25, 31, 32 e 37.

### Responsabilità e stato dei casi

**Illecito disciplinare**, **reato**, responsabilità civile e responsabilità amministrativa rimangono piani distinti. Una segnalazione, una contestazione o un fatto narrato non equivalgono a una violazione accertata.

Per questo i casi usano una tassonomia controllata:

- `violazione_accertata`;
- `violazione_accertata_con_altri_profili`;
- `collegamento_giurisprudenziale`;
- `controesempio`;
- `caso_adiacente`;
- `esito_processuale_non_di_merito`;
- `limite_probatorio`.

La qualifica di violazione accertata è ammessa dal validatore soltanto quando l'articolo compare fra quelli dichiarati violati nella scheda del caso. L'eventuale definitività, impugnazione o successiva riforma della decisione deve comunque essere verificata prima della pubblicazione.

### Consenso e autonomia

Non si usa **consenso** come etichetta unica. Vanno distinti almeno:

- consenso alla prestazione;
- consenso alla partecipazione alla ricerca;
- autorizzazione all'uso dei dati raccolti;
- consenso valido e dimostrabile alla deroga al segreto nella testimonianza;
- informazione, coinvolgimento e volontà di persone minorenni o non pienamente capaci;
- libertà di scelta, rifiuto e revoca.

L'oggetto del consenso deve essere dichiarato in ogni scenario. Il consenso non elimina automaticamente asimmetria, conflitto di interessi, doveri di protezione o limiti professionali.

### Segreto, riservatezza e dati

**Segreto professionale**, **riservatezza**, **privacy o protezione dei dati**, **anonimato** e **non riconoscibilità** non sono intercambiabili. Gli articoli 11-17 formano una sequenza didattica: regola generale; testimonianza e consenso; obblighi o pericolo grave; gruppi; collaborazione; comunicazione scientifica; custodia documentale.

**Referto** e **denuncia** restano istituti distinti. I commenti non devono indicare quale obbligo ricorra in un caso concreto senza verificare ruolo esercitato, natura dei fatti e normativa applicabile.

### Competenza, titoli e scienza

**Competenza professionale**, titolo, abilitazione e formale autorizzazione non sono sinonimi. **Validità** e **attendibilità** sono anch'esse distinte. Le schede collegano:

- articolo 5: preparazione, aggiornamento, limiti e strumenti;
- articolo 7: basi delle valutazioni e ipotesi alternative;
- articolo 21: insegnamento di strumenti e tecniche riservati;
- articolo 37: limiti del mandato, consulenza e invio;
- articolo 39: presentazione pubblica di formazione, esperienza e competenza;
- articolo 40: serietà scientifica della comunicazione pubblicitaria.

Questi richiami non trasformano una regola in un'altra: servono a prevenire risposte didattiche troppo semplici.

### Compensi, vantaggi e comunicazione pubblica

Sono mantenuti distinti:

- accordo sul compenso dell'articolo 23;
- vantaggio indebito tratto dalla relazione dell'articolo 28;
- vincolo a presidi o luoghi di cura dell'articolo 29;
- corrispettivo fra professionisti dell'articolo 30;
- sottrazione o procacciamento della clientela degli articoli 36 e 40;
- presentazione professionale dell'articolo 39;
- pubblicità informativa dell'articolo 40.

Il compenso pattuito non è di per sé un vantaggio indebito. La comunicazione veritiera non è per ciò solo conforme a ogni regola vigente sulla pubblicità professionale.

## Glossario e futuri pop-up

Il file `data/glossary.it.json` separa il testo normativo dalle informazioni editoriali. Ogni voce contiene:

- un identificativo stabile indipendente dalla lingua;
- lemma e categoria;
- definizione italiana breve;
- nota per la futura traduzione giuridica;
- articoli collegati;
- una o più forme esatte presenti nel testo ufficiale.

Le annotazioni non inseriscono markup dentro il testo ufficiale. L'interfaccia dovrà applicarle in fase di visualizzazione secondo queste regole:

1. cercare la forma esatta nell'articolo visualizzato;
2. in caso di sovrapposizione, preferire l'espressione più lunga;
3. evidenziare ogni occorrenza esatta, salvo una diversa scelta esplicita dell'interfaccia;
4. mostrare chiaramente che la definizione italiana è editoriale e non una definizione ufficiale del CNOP;
5. non memorizzare soltanto offset numerici, perché cambierebbero con testo, punteggiatura e lingua;
6. nelle traduzioni, collegare lo stesso identificativo concettuale a una nuova forma testuale verificata nella specifica versione linguistica.

Le parole singole sono annotate soltanto quando il contesto le rende sufficientemente precise. Dove possibile si preferiscono collocazioni come **valido e dimostrabile consenso**, **stretto necessario**, **conoscenza professionale diretta**, **formale autorizzazione**, **procacciamento della clientela** e **Consiglio dell'Ordine competente**.

## Normalizzazioni eseguite

- Unificato l'identificativo dell'articolo 348 c.p. in `cp-art-348`.
- Unificato il D.P.R. n. 137/2012 in `dpr-137-2012`.
- Allineati autorità, titoli e collegamenti ripetuti della legge n. 56/1989, della legge n. 219/2017, del codice etico AIP e delle raccolte di decisioni territoriali.
- Normalizzati i ruoli attribuiti ai casi senza alterare le sintesi o trasformare collegamenti didattici in accertamenti.
- Lasciato invariato ogni campo `official_text` e ogni frammento normativo.

## Questioni ancora aperte

Queste aree restano intenzionalmente in stato `draft` e richiedono controllo specialistico prima della pubblicazione o del congelamento delle traduzioni normative:

| Priorità | Articoli | Verifica necessaria |
| --- | --- | --- |
| Alta | 11-17 | Presupposti attuali di testimonianza, referto, denuncia, pericolo grave, trattamento dei dati e custodia documentale. |
| Alta | 21 | Perimetro attuale degli strumenti e delle tecniche riservati alla professione. |
| Alta | 23 | Coordinamento con la disciplina vigente su preventivo, compenso e obblighi informativi. |
| Alta | 24 e 31 | Consenso, capacità, responsabilità genitoriale, autorità competente e prestazioni sanitarie o non sanitarie. |
| Alta | 40 | Legislazione e prassi ordinistica vigenti sulla pubblicità professionale e competenze di controllo. |
| Alta | 41 e 42 | Stato effettivo di eventuali revisioni, referendum, proclamazioni e data di vigenza al momento della pubblicazione. |
| Media | 1, 2, 5 e 36 | Procedimento disciplinare, formazione continua e dovere di segnalazione nella disciplina vigente. |
| Media | 7, 25, 31 e 39 | Portata attribuibile alle decisioni territoriali usate come esempi e loro eventuale definitività. |
| Media | 2, 38 e 40 | Applicazione contestuale delle clausole aperte su decoro, dignità e immagine della professione. |

In assenza del revisore specialistico si può procedere con il prototipo dell'app, mantenendo in evidenza lo stato di bozza. Non è invece prudente presentare commenti, definizioni o traduzioni come ufficiali o definitivamente convalidati.

