let svt1DataRaw = [
    {
        name: "Go'kväll",
        start: "2021-02-10T05:15:00+01:00",
        description: "Intervju med Emma Frans som är doktor i medicinsk epidemiologi. Hon har skrivit en bok med tankar och erfarenheter från coronaåret 2020. Gunnel Carlson visar vad man kan göra i trädgården så här tidigt på våren. Tara Moshizi och Johan Lundström tipsar om sevärda filmer och tv-serier. Ett fjärde reportage i serien \"Det vackraste samiska hantverket\". I dag får vi se hur en mjölkstäva tillverkas. Programledare: Jovan Radomir."
    },
    {
        name: "Morgonstudion",
        start: "2021-02-10T06:00:00+01:00",
        description: "Dagens viktigaste nyheter och analyser med täta uppdateringar. Vi sänder direkt inrikes- och utrikesnyheter inklusive sport, kultur och nöje. Dessutom intervjuer med aktuella gäster. Nyhetssammanfattningar varje hel- och halvtimme med start kl 06.00. Lokala nyheter från kl 07.05. Väder kvart i och kvart över."
    },
    {
        name: "Hemmagympa med Sofia",
        start: "2021-02-10T09:10:00+01:00",
        description: "Sofia Åhman leder SVT:s hemmagympapass. Passet fokuserar på styrka och kondition."
    },
    {
        name: "Vinterstudion",
        start: "2021-02-10T09:30:00+01:00",
        description: "Vinterstudion med höjdpunkter från dagens tävlingar. Programledare: André Pops."
    },
    {
        name: "Alpint: VM",
        start: "2021-02-10T10:00:00+01:00",
        description: "Kombination herrar, första åket, från Cortina i Italien. Kommentator: Johan Ejeborg. Expert: Tobias Hellman."
    },
    {
        name: "Vinterstudion",
        start: "2021-02-10T11:00:00+01:00",
        description: "Vinterstudion med höjdpunkter från dagens tävlingar. Programledare: André Pops."
    },
    {
        name: "Längdskidor: SM",
        start: "2021-02-10T11:15:00+01:00",
        description: "Sprintfinalen, i klassisk stil, avgörs på nyrenoverade Borås Skidstadion. Kommentator: Jacob Hård. Expert: Anders Blomquist."
    },
    {
        name: "Vinterstudion",
        start: "2021-02-10T13:00:00+01:00",
        description: "Vinterstudion med höjdpunkter från dagens tävlingar. Programledare: André Pops."
    },
    {
        name: "Alpint: VM",
        start: "2021-02-10T13:30:00+01:00",
        description: "Kombination herrar, andra åket, från Cortina i Italien. Kommentator: Johan Ejeborg. Expert: Tobias Hellman."
    },
    {
        name: "Vinterstudion",
        start: "2021-02-10T14:30:00+01:00",
        description: "Vinterstudion med höjdpunkter från dagens tävlingar. Programledare: André Pops."
    },
    {
        name: "Skidskytte: VM",
        start: "2021-02-10T15:00:00+01:00",
        description: "Direktsändning från skidskytte-VM från Pokljuka, Slovenien med mixedstafett, herrar och damer. Kommentator: Ola Bränholm. Expert: Björn Ferry."
    },
    {
        name: "Vinterstudion",
        start: "2021-02-10T16:30:00+01:00",
        description: "Vinterstudion med höjdpunkter från dagens tävlingar. Programledare: André Pops."
    },
    {
        name: "Strömsö",
        start: "2021-02-10T17:00:00+01:00",
        description: "Starta vårens odlingar inomhus, redan på vintern. Trädgårdsmästaren Kristine delar med sig av sina bästa tips för en tidigare skörd. Jim bygger en odlingslåda, Camilla ritar mönster på glasburkar och i köket testar Anders och Jonas ostpanering. Inspiration för hus och hem, fritid och vardagsliv. Del 3 av 17. (Finland, 2020)"
    },
    {
        name: "Sverige idag",
        start: "2021-02-10T17:30:00+01:00",
        description: "Nyheter från hela Sverige - direkt från Umeå."
    },
    {
        name: "Rapport",
        start: "2021-02-10T18:00:00+01:00",
        description: "Nyheter från Sverige och världen."
    },
    {
        name: "Kulturnyheterna",
        start: "2021-02-10T18:15:00+01:00",
        description: ""
    },
    {
        name: "Sportnytt",
        start: "2021-02-10T18:28:00+01:00",
        description: ""
    },
    {
        name: "Lokala nyheter",
        start: "2021-02-10T18:33:00+01:00",
        description: ""
    },
    {
        name: "Go'kväll",
        start: "2021-02-10T18:45:00+01:00",
        description: "Gäst är skådespelaren Sissela Kyle. Maud Onnermark lagar god mat i Go'kväll-köket. Johanna Lundin väcker läslust genom att tipsa om böcker under temat \"blå böcker\". Vi fortsätter att besöka museer på olika platser i landet. I dag besöker vi ett kraftverksmuséum i Krångede i Jämtland. Programledare: Jovan Radomir."
    },
    {
        name: "Rapport",
        start: "2021-02-10T19:30:00+01:00",
        description: "Nyheter från Sverige och världen."
    },
    {
        name: "Lokala nyheter",
        start: "2021-02-10T19:55:00+01:00",
        description: ""
    },
    {
        name: "Sverige möts",
        start: "2021-02-10T20:00:00+01:00",
        description: "Flödet av narkotika ökar i Sverige och det är också grunden för den ökande gängkriminaliteten. Samtidigt stiger dödstalen bland narkotikamissbrukare. Har Sverige förlorat kampen mot knarket - trots vår stränga lagstiftning? Nu höjs röster för att legalisera cannabis och avkriminalisera bruk av narkotika. Direktsänd debatt med inrikesminister Mikael Damberg, Romina Pourmokhtari, ordförande i LUF, ravegeneralen Anders Varveus, poliser, före detta kriminella och unga missbrukare. Programledare: Magnus Thorén."
    },
    {
        name: "Helt lyriskt",
        start: "2021-02-10T21:00:00+01:00",
        description: "Julia Frej och Sabina Ddumba tolkar Carl Michael Bellman och Maria Wine. Programledare: Fredrik Lindström. Del 5 av 5."
    },
    {
        name: "Sportnytt",
        start: "2021-02-10T22:00:00+01:00",
        description: ""
    },
    {
        name: "Lokala nyheter",
        start: "2021-02-10T22:15:00+01:00",
        description: ""
    },
    {
        name: "Rapport",
        start: "2021-02-10T22:25:00+01:00",
        description: "Nyheter från Sverige och världen."
    },
    {
        name: "VM-vintern: Magasin",
        start: "2021-02-10T22:30:00+01:00",
        description: "Höjdpunkter, nyheter och intervjuer från skidskytte-VM i Pokljuka, Slovenien och alpina VM i Cortina, Italien. Programledare: André Pops."
    },
    {
        name: "Komma ut",
        start: "2021-02-10T23:00:00+01:00",
        description: "Sigrid. Sigrid ska ta med sin flickvän på släktmiddag för första gången. Eftersom inte alla i släkten vet att hon är homosexuell har hon bestämt sig för att först berätta för sin faster och farbror. Sigrid får också träffa två kända idrottskvinnor som är gifta med varandra och har barn. Del 5 av 7. UR."
    },
    {
        name: "Tack gud jag är homo",
        start: "2021-02-10T23:40:00+01:00",
        description: "Queer-fear. Clara Henry förklarar skillnaden mellan pan- och bisexualitet. Linda är nervös och rädd för att säga fel när hon ska intervjua två personer som är queer. Alice kallar rädslan för \"queer-fear\". Duon träffar Mona och Malin, två \"real life queers\", och de förklarar vad det betyder. Del 5 av 8. UR."
    },
    {
        name: "Skam France",
        start: "2021-02-10T23:55:00+01:00",
        description: "La curiosité. Lucas kan inte sluta tänka på Eliott och försöker ta reda på allt om honom. Men medan Lucas drömmer om Eliott, drömmer Chloé om Lucas, och hon bestämmer sig för att bjuda honom på fest. Lucas tackar ja - men så träffar han Eliott. Del 2 av 10. UR."
    },
    {
        name: "Carina Bergfeldt",
        start: "2021-02-11T00:15:00+01:00",
        description: "Gäster i veckans program är avgående \"Melodifestivalgeneralen\" Christer Björkman, komikern Jesper Rönndahl samt Ingela Jansson, bilhandlardottern som blev storbedragerska. Dessutom träffar vi artisten Miss Li, som framför nya låten \"Förlåt\" a cappella i studion. Talkshow med journalisten och författaren Carina Bergfeldt. Del 4 av 10."
    },
    {
        name: "I mördarens spår 1973",
        start: "2021-02-11T01:15:00+01:00",
        description: "Tennison spelar upp radioupptagningen för Bradfield, som nu ser sin chans att hämnas på Clifford. Bradfield får teamet att övervaka Bentleys, trots order från högre ort om att fokusera på mordfallet. I rollerna: Stefanie Martini, Sam Reid, Blake Harrison, Alun Armstrong, Ruth Sheen m.fl. Del 5 av 6."
    },
    {
        name: "Sändningsuppehåll",
        start: "2021-02-11T02:00:00+01:00",
        description: ""
    },
    {
        name: "Sverige idag",
        start: "2021-02-11T04:45:00+01:00",
        description: "Nyheter från hela Sverige - direkt från Umeå."
    }
];
let svt2DataRaw = [
    {
        name: "Sändningsuppehåll",
        start: "2021-02-10T05:00:00+01:00",
        description: ""
    },
    {
        name: "SVT Forum",
        start: "2021-02-10T09:00:00+01:00",
        description: "Frågor om placerade barn och unga. DIREKT. \nRiksdagen debatterar utskottens förslag, bland annat socialutskottets betänkande om placerade barn och unga. \n\n"
    },
    {
        name: "Rapport",
        start: "2021-02-10T12:00:00+01:00",
        description: "Nyheter från Sverige och världen."
    },
    {
        name: "SVT Forum",
        start: "2021-02-10T12:03:00+01:00",
        description: " 12:03: Tjänstebilar och klimatomställningen. \nVad innebär förslaget från regeringen, C och L om nya förmånsregler för tjänstebilar och vilka blir konsekvenserna? Medverkande: Rickard Nordin (C), Lorentz Tovatt (MP), Jessica Rosencrantz (M) och Mattias Bergman, vd Bil Sweden, som också är arrangör. Från 20/1. \n\n13:20: Vägar till ett uthålligt EU - pandemin och migration. \nLedande forskare diskuterar EU och coronapandemin samt regelverk och åtgärder när det gäller integration, migration och arbetskraft. Med Titti Mattsson, professor i offentlig rätt, Carl Fredrik Bergström, professor i Europarätt, Eskil Wadensjö, professor i nationalekonomi, m fl. Del av ett längre seminarium. Arrangör: Universitetens nätverk för Europaforskning. Från 3/2.    \n\n14:45: Dramat som samhällsspegel. \nSVT:s nya dramaserie Tunna blå linjen handlar om sex poliser med Malmös gator som arbetsplats. Hur viktigt är det med drama som ställer frågor om samhället och hur nära verkligheten kan man gå? Medverkande: Anna Croneman, chef SVT drama, Cilla Jackert, manusförfattare, Gizem Erdogan, skådespelare, Joakim Palmkvist, kriminalreporter Sydsvenskan och Alexandra Goncalves, polis i Malmö. Arrangör: SVT. Från 9/2. \n\n15:45: Corona special. \nProgram med svar på tittarnas frågor om corona. Hur påverkas vi, samhället, ekonomin och jobben? Programledare: Hiba Daniel. Från 9/2. \n\n"
    },
    {
        name: "Rapport",
        start: "2021-02-10T16:00:00+01:00",
        description: "Nyheter från Sverige och världen."
    },
    {
        name: "SVT Forum",
        start: "2021-02-10T16:05:00+01:00",
        description: "Hänt i dag. \n\n\n"
    },
    {
        name: "Min sanning: Hanne Kjöller",
        start: "2021-02-10T16:15:00+01:00",
        description: "Anna Hedenmo möter skribenten, opinionsbildaren och författaren Hanne Kjöller."
    },
    {
        name: "Nyheter på lätt svenska",
        start: "2021-02-10T17:15:00+01:00",
        description: ""
    },
    {
        name: "Nyhetstecken",
        start: "2021-02-10T17:20:00+01:00",
        description: "Nyheter på teckenspråk."
    },
    {
        name: "Oddasat",
        start: "2021-02-10T17:30:00+01:00",
        description: "Samiskspråkiga nyheter."
    },
    {
        name: "Uutiset",
        start: "2021-02-10T17:45:00+01:00",
        description: "Finskspråkiga nyheter."
    },
    {
        name: "Varför blir vi förälskade?",
        start: "2021-02-10T18:00:00+01:00",
        description: "Vad säger vetenskapen om mänsklig kärlek? Med biologisk blick synar vi syftet och mekanismerna bakom kärlek. Vad gör p-piller med oss och vad avgör vilka du attraheras av. Vilka passar ihop och vilka inte. Hur upprätthåller man kärleksrelationer och vad gör frånvaron av kärlek med oss? Är sex viktigt? Kan kärlek skada oss? Vetenskapen vet inte allt men kan ge oss en klarare syn på vissa delar. "
    },
    {
        name: "Designreportage",
        start: "2021-02-10T18:50:00+01:00",
        description: "Reportage från Go'kväll. "
    },
    {
        name: "VM-vintern: Magasin",
        start: "2021-02-10T19:00:00+01:00",
        description: "Höjdpunkter, nyheter och intervjuer från skidskytte-VM i Pokljuka, Slovenien och alpina VM i Cortina, Italien. Programledare: André Pops."
    },
    {
        name: "Modern och dottern",
        start: "2021-02-10T19:30:00+01:00",
        description: "Zeynep Günes får ett tillfälligt lärarjobb på den lokala grundskolan. Snart inser hon att en av hennes elever, Melek, utsätts för övergrepp av sin mamma och hennes pojkvän. Och när Zeynep förstår att ingen hjälper Melek tar hon saken i egna händer... I rollerna: Cansu Dere, Vahide Perçin, Beren Gökyildiz m.fl. Del 107 av 129."
    },
    {
        name: "Världens natur: Tibets orörda natur",
        start: "2021-02-10T20:00:00+01:00",
        description: "Den tibetanska högplatån är den största och högst belägna i världen. Det är ingen plats för vänner av värme och komfort. Men där finns djur som inte bara härdar ut, de frodas i det karga klimatet och den tunna luften. Från sluttningarnas apor till topparnas snöleoparder."
    },
    {
        name: "Beatles forever",
        start: "2021-02-10T20:50:00+01:00",
        description: "Del 4 av 10. Beatlesexperten Per Wium samtalar med sångerskan Karoline Gro Budtz och gitarristen Søren Bødker Madsen om en sång ur Beatles sångskatt. Som avslutning framför Karoline och Søren \"Lucy in the sky with diamonds\"."
    },
    {
        name: "Aktuellt",
        start: "2021-02-10T21:00:00+01:00",
        description: "SVT:s fördjupande nyhetsprogram."
    },
    {
        name: "Kulturnyheterna",
        start: "2021-02-10T21:34:00+01:00",
        description: ""
    },
    {
        name: "Nyhetssammanfattning",
        start: "2021-02-10T21:41:00+01:00",
        description: ""
    },
    {
        name: "30 minuter",
        start: "2021-02-10T21:45:00+01:00",
        description: "Gäst är energiminister Anders Ygeman (S), som intervjuas om effektbristen och kärnkraften. Programledare: Anders Holmberg. Del 4 av 15."
    },
    {
        name: "Utredningen",
        start: "2021-02-10T22:15:00+01:00",
        description: "Fakta läggs till fakta, men Jens Møller och hans team har fortfarande inte några avgörande bevis. Alla tvivel måste skingras, annars har de inget fall. Åklagare Jakob Buch-Jepsen betonar att det måste finnas motiv och dödsorsak för att kunna åtala. Møller kallar till presskonferens med förhoppningen att den gripne eller någon i dennes omgivning ska börja prata. Samtidigt undersöker man den misstänktes dator och hittar mörka hemligheter... I rollerna: Søren Malling, Pilou Asbæk, Laura Christensen, Charlotte Munck, Henrik Birch, Pernilla August, Rolf Lassgård m.fl. Del 5 av 6."
    },
    {
        name: "Ekonomibyrån",
        start: "2021-02-10T23:00:00+01:00",
        description: "Allt fler överger kontanterna i Sverige och vi kan bli det första landet i världen som blir kontantlöst. Coronapandemin har snabbat på utvecklingen när allt fler handlat på nätet. Men vilka risker finns det med ett samhälle helt utan sedlar och mynt? I studion: utredaren och fd moderatpolitikern Anna Kinberg Batra, Niklas Arvidsson, universitetslektor och docent i industriell dynamik vid KTH och beteendevetaren och författaren Elin Helander. Programledare: Carolina Neurath. Del 4 av 14."
    },
    {
        name: "När livet vänder",
        start: "2021-02-10T23:30:00+01:00",
        description: "I juni 2005 förändrades Annelies liv för alltid. Mitt under hennes födelsedagsfest gick hennes man Jörg ner till stallet för att avsluta sitt liv med en slaktpistol. Anneli lyckades rädda livet på sin älskade make, men han kunde inte längre minnas vem han var. Anneli har lärt sig att leva med den chockerande sanningen - detta är en berättelse om att sörja någon som ännu lever, om förlusten av framtiden och identiteten - men det är också en berättelse om kärlek. Anja Kontor möter människor som tagit sig igenom svåra händelser i sina liv. Del 4 av 7."
    },
    {
        name: "Egenland - Finland är fantastiskt",
        start: "2021-02-11T00:00:00+01:00",
        description: "Rovaniemi är inte bara hemmaarena för rockgruppen Lordi, utan också Midnight Sun Burlesque, världens nordligaste burleskgrupp. I 400 år gammal urskog i Paljakka naturreservat skapas Trädopera och i Ranua hittar man ett litet stycke Japan. Programledarna Hannamari Hoikkala och Nicke Aldén presenterar finländarnas egna favoritplatser och guidar till oväntade turistpärlor, unika attraktioner och fascinerande personligheter, runt omkring i Finland. Del 6 av 8."
    },
    {
        name: "Varför blir vi förälskade?",
        start: "2021-02-11T00:30:00+01:00",
        description: "Vad säger vetenskapen om mänsklig kärlek? Med biologisk blick synar vi syftet och mekanismerna bakom kärlek. Vad gör p-piller med oss och vad avgör vilka du attraheras av. Vilka passar ihop och vilka inte. Hur upprätthåller man kärleksrelationer och vad gör frånvaron av kärlek med oss? Är sex viktigt? Kan kärlek skada oss? Vetenskapen vet inte allt men kan ge oss en klarare syn på vissa delar. "
    },
    {
        name: "Under klubban",
        start: "2021-02-11T01:20:00+01:00",
        description: "Mogens och Peder är oense om värderingen av den stora attraktionen på dagens auktion. Finn är på jakt efter varor till en ny filial och Rikke och Heidi fascineras av en stor tavla. Välkommen in bakom kulisserna på auktionshus runt omkring i Danmark. Del 2 av 8. "
    },
    {
        name: "Sportnytt",
        start: "2021-02-11T01:50:00+01:00",
        description: ""
    },
    {
        name: "Nyhetstecken",
        start: "2021-02-11T02:05:00+01:00",
        description: "Nyheter på teckenspråk."
    },
    {
        name: "Sändningsuppehåll",
        start: "2021-02-11T02:15:00+01:00",
        description: ""
    }
];
let svtBarnDataRaw = [
    {
        name: "Pablo",
        start: "2021-02-10T05:00:00+01:00",
        description: "Pablo är en 5-årig pojke med autism. Han ser världen på ett lite annorlunda sätt och för att förstå den bättre tar han hjälp av sina kritor.  "
    },
    {
        name: "Timmy Lamm - engelska ord",
        start: "2021-02-10T05:10:00+01:00",
        description: "Följ med Timmy Lamm till förskolan och lär dig engelska ord!"
    },
    {
        name: "Babblarna",
        start: "2021-02-10T05:15:00+01:00",
        description: "En serie för de allra minsta med figurerna Babba, Bibbi, Bobbo, Dadda, Diddi och Doddo."
    },
    {
        name: "Babblarna",
        start: "2021-02-10T05:20:00+01:00",
        description: "En serie program för de allra minsta med figurerna Babba, Bibbi, Bobbo, Dadda, Diddi och Doddo."
    },
    {
        name: "Monsterskolan",
        start: "2021-02-10T05:25:00+01:00",
        description: "Följ med monstren som varje natt på Monsterskolan utforskar sin vrålsnuffliga värld och gör maffiga monstersaker!"
    },
    {
        name: "Olobob-toppen",
        start: "2021-02-10T05:30:00+01:00",
        description: "Följ med Bubbel, Lallo och Tibb och bygg en ny konstig, kulig, rolig figur varje dag!"
    },
    {
        name: "Lilla prinsessan",
        start: "2021-02-10T05:35:00+01:00",
        description: "Tecknad brittisk serie om en nyfiken och vetgirig prinsessa. Om den lilla prinsessan inte får som hon vill blir hon arg. Prinsessans röst görs av Sandra Kassman."
    },
    {
        name: "Punky",
        start: "2021-02-10T05:45:00+01:00",
        description: " Restaurangkväll hemma. Punky är en liten tjej med Downs syndrom. Vi följer henne i vardagen tillsammans med familjen."
    },
    {
        name: "Kojsagor",
        start: "2021-02-10T05:55:00+01:00",
        description: "I en fantastisk trädkoja fylld av böcker samlas Lisette, Antoine, Fanny och Tiago för att leka och läsa sagor."
    },
    {
        name: "Stella och Sam",
        start: "2021-02-10T06:00:00+01:00",
        description: "Världens roligaste, snällaste och mest nyfikna storasyster heter Stella. Hon har svar på allt, till och med när hon inte vet svaret. Hon och lillebror Sam är med om fantastiska äventyr."
    },
    {
        name: "Fnissnisse",
        start: "2021-02-10T06:15:00+01:00",
        description: "Rumpbaggen Fnissnisse trivs bra hos mamma och pappa russin. Tillsammans med de andra i Grönsalsskogen lyckas de göra varje dag till en liten fest med mycket skratt. Berättare: Tuvalisa Rangström."
    },
    {
        name: "Regnbågsstadens hjälte",
        start: "2021-02-10T06:20:00+01:00",
        description: "När Kokos hjärta börjar glöda rycker Regnbågsstadens hjälte ut för att hjälpa stora som små."
    },
    {
        name: "Greta Gris",
        start: "2021-02-10T06:30:00+01:00",
        description: "Greta är en glatt grymtande liten gris som bor med mamma Gris, pappa Gris och lillebror Georg. Greta tycker om att spela spel, leka och klä ut sig men det absolut bästa hon vet är att hoppa i lerpölar."
    },
    {
        name: "Claude",
        start: "2021-02-10T06:35:00+01:00",
        description: "Claude är en vit hund med tjusig röd basker och matchande tröja. Varje dag ger han sig ut på olika äventyr med sin bästa vän i hela världen som är en strumpa."
    },
    {
        name: "Ax till max",
        start: "2021-02-10T06:50:00+01:00",
        description: "I staden Fräsinge finns det alltid något kul att göra för Ax och vännerna - och deras full-fartiga-fordon förstås! "
    },
    {
        name: "Gigantosaurus",
        start: "2021-02-10T07:00:00+01:00",
        description: "Spännande äventyr med fyra små dinosaurier och en jättestor Gigantosaurus."
    },
    {
        name: "Fåret Shaun",
        start: "2021-02-10T07:10:00+01:00",
        description: "När bonden inte ser på blir djuren sina riktiga jag.     Detta avsnitt: Shaun på hattjakt."
    },
    {
        name: "Om jag var ett djur",
        start: "2021-02-10T07:15:00+01:00",
        description: "Nyfiken på djur? På hur de lever och hur deras uppväxt ser ut? Häng med ner i gryt, gångar och andra bon och följ dem på nära håll. Vilket djur skulle du vilja vara? "
    },
    {
        name: "Monsterbarnvakterna",
        start: "2021-02-10T07:25:00+01:00",
        description: "Häng med kompisarna Esme och Roy - de bästa monsterbarnvaktarna i stan - när de får monsterstora och -små problem på halsen! "
    },
    {
        name: "Våfflan",
        start: "2021-02-10T07:35:00+01:00",
        description: "En magisk talande hund? Är det sant? Jajamän!"
    },
    {
        name: "Luo Bao Bei",
        start: "2021-02-10T07:45:00+01:00",
        description: "Att vara sju år och nyfiken på världen och allting är kul och klurigt. Tur att Luo Bao Bei har sin hemliga vän Skärbjörn - och sina verkliga vänner Timo och Fanny. "
    },
    {
        name: "Biet Maya",
        start: "2021-02-10T08:00:00+01:00",
        description: "Maya är inte som alla andra bin - hon bor nämligen inte i en kupa. Ängen är hennes hem och platsen där hon upplever alla sina äventyr med sina ovanliga vänner - och sin bästis Villy, som trots att han också är ett bi egentligen är en riktig latmask. "
    },
    {
        name: "Pirata & Piloto",
        start: "2021-02-10T08:10:00+01:00",
        description: "Lätta ankar och hissa storseglet! Vi ska iväg på nya äventyr med havets bästa och snällaste pirat - och hennes besättning!"
    },
    {
        name: "Ricky Zoom",
        start: "2021-02-10T08:25:00+01:00",
        description: "Fullt ös i Däckköping med Ricky och hojpolarna."
    },
    {
        name: "Pippi Långstrump",
        start: "2021-02-10T08:35:00+01:00",
        description: "Det har kommit ett tivoli till stan. Pippi är i sitt esse. Hon handskas suveränt med boaormarna, och den starkaste mannen i världen får en dag som han aldrig glömmer. I huvudrollerna: Inger Nilsson, Maria Persson och Pär Sundberg. Del 6 av 13: Pippi går på tivoli. "
    },
    {
        name: "Victor & Josefine",
        start: "2021-02-10T09:00:00+01:00",
        description: "Björnen Victor och musen Josefine är som ler och långhalm, bästa vänner och nästan familj. Deras vardag kantas av värme, musik och munterhet. "
    },
    {
        name: "Pyjamashjältarna",
        start: "2021-02-10T09:15:00+01:00",
        description: "På natten förvandlas Oscar, Amanda och Jens till de tre pyjamashjältarna Kattpojken, Ugglis och Gecko. Tillsammans skyddar de staden mot alla skurkar."
    },
    {
        name: "Anden i lampan",
        start: "2021-02-10T09:25:00+01:00",
        description: "Andens nya ande. På vinden hittar Jamillah en magisk lampa vars ande tar henne tillbaka till antika Bagdad. Där träffar hon den unge Aladdin som blir hennes vän. Säsong 2."
    },
    {
        name: "Djupet",
        start: "2021-02-10T09:40:00+01:00",
        description: "Ombord på ubåten Aronnax fortsätter familjen Nekton att värna om haven och dess invånare. Antes tid går dock mest åt till att försöka tyda Ephemychrons alla symboler. Kan de visa vägen till det försvunna Lemurien? Säsong 2."
    },
    {
        name: "Pirater i huset intill",
        start: "2021-02-10T10:00:00+01:00",
        description: "Gnölviken är lika tråkigt som det låter, där händer absolut ingenting. Men en dag får Matilda nya grannar... Detta avsnitt: Landkrabbe-arbete."
    },
    {
        name: "Robin Hoods rabalder och rackartyg",
        start: "2021-02-10T10:10:00+01:00",
        description: "Följ med gänget som med hjälp av skratt, magi och vänskap ska rädda Nottingham! Vid 10 års ålder är Robin Hood redan en hjälte och bor med sina vänner i Sherwoodskogen. Tillsammans med Broder Tuck, Lille John, Scarlett och Marion bekämpar han prins Johns olika upptåg."
    },
    {
        name: "Bagel & Beckys show",
        start: "2021-02-10T10:25:00+01:00",
        description: "Bagel & Becky reser i tiden! Slåss mot monster! Petar näsan! Och en massa annat skoj, konstigt, larvigt och läskigt!"
    },
    {
        name: "Blinky Bills bravader",
        start: "2021-02-10T10:35:00+01:00",
        description: "Oavsett om det är rymdvarelser som landar eller en borgmästare med storhetsvansinne så är det dags för ännu en bravad av Blinky Bill och gänget!"
    },
    {
        name: "Grötnöt & Fjädrik",
        start: "2021-02-10T10:45:00+01:00",
        description: "De här rymdsniglarna är inte de skarpaste knivarna i stället. Faktiskt egentligen inte skarpa nog att ens vara med i stället, om man ska vara ärlig. "
    },
    {
        name: "Bangarang",
        start: "2021-02-10T11:00:00+01:00",
        description: "Bangarang, pangarang! För Dennis, Rubi, Jessi och Pajsarn finns inga begränsningar när det gäller hur knasigt det kan bli eller hur illa en stinkbomb kan lukta. Men Valter gör vad han kan för att sabotera."
    },
    {
        name: "Andys minsta babydjur",
        start: "2021-02-10T11:15:00+01:00",
        description: "Små, ulliga, gulliga. Alla ska de lära sig gå, klättra, simma - och leka!"
    },
    {
        name: "Simon",
        start: "2021-02-10T11:25:00+01:00",
        description: "Simon är en modig liten kanin, men inte alltid. Tur att han har vänner, och föräldrar, som stöttar honom!"
    },
    {
        name: "I drömmarnas trädgård",
        start: "2021-02-10T11:30:00+01:00",
        description: "Vi möter Daisy, Igglepiggle, Makka Pakka och några till. De bor i en vacker trädgård och är med om många  upptäckter och äventyr."
    },
    {
        name: "Berätta för mig - nordsamiska",
        start: "2021-02-10T12:00:00+01:00",
        description: "Triggad. Roddes klasskompis Rosa tycker om att stå i centrum och ibland retar hon andra elever. Rodde tycker att Rosa är kul och applåderar hennes elaka skämt. Men är det verkligen rätt att skratta när andra känner sig mobbade? Del 4 av 5. UR."
    },
    {
        name: "Daniel Tigers kvarter",
        start: "2021-02-10T12:10:00+01:00",
        description: "Du har nåt visst. Daniel Tiger och hans vänner Madelina, Prins Onsdag, Kattis och ugglan Ho lär sig om känslor och sånt genom sång och fantasi. "
    },
    {
        name: "Monsterskolan",
        start: "2021-02-10T12:20:00+01:00",
        description: "Följ med monstren som varje natt på Monsterskolan utforskar sin vrålsnuffliga värld och gör maffiga monstersaker!"
    },
    {
        name: "Roboten Rob",
        start: "2021-02-10T12:30:00+01:00",
        description: "Fyra barnrobotar åker ut i rymden för att lösa problem. Men man måste inte vara robot för att kunna hänga med. Svenska röster: Mimmi Sandén, Josefine Götestam, Julianna Wretman Werner, Filippa Åberg, Jonas Bergström m.fl."
    },
    {
        name: "Katie Morag",
        start: "2021-02-10T12:40:00+01:00",
        description: "Om livet på en avlägsen ö, fylld av vardagligheter, spännande historia och mystik."
    },
    {
        name: "Monsterbarnvakterna",
        start: "2021-02-10T12:50:00+01:00",
        description: "Häng med bästa kompisarna Esme och Roy - de bästa monsterbarnvaktarna i stan - när de får monsterstora och -små problem på halsen! "
    },
    {
        name: "P King Älling",
        start: "2021-02-10T13:05:00+01:00",
        description: "Häng med till Hällekulla och träffa tre goda, snälla, knasiga vänner!"
    },
    {
        name: "Gården",
        start: "2021-02-10T13:15:00+01:00",
        description: "Vi följer livet på gården och idag gör några barn och en vuxen olika yogaövningar tillsammans i snön. Getterna vill förstås också vara med och yoga."
    },
    {
        name: "Thunderbirds",
        start: "2021-02-10T13:45:00+01:00",
        description: "Andra säsongen. Internationella räddningsstyrkan har sett till att Hood gripits av, och är i förvar hos, Globala Dynamiska Försvaret. Men oskadliggjord, det är han inte!"
    },
    {
        name: "Legendarerna",
        start: "2021-02-10T14:05:00+01:00",
        description: "Legendarerna reser land och rike runt för att reparera sitt misstag; i strid med den onde Mörkhell råkade de krossa Jovenia-stenen så att alla i världen förvandlades till barn! Detta avsnitt: Nidrans återkomst."
    },
    {
        name: "Blue water high",
        start: "2021-02-10T14:30:00+01:00",
        description: "Del 21 av 26. De sex eleverna på surfarskolan Solar Blue satsar på en framtid som professionella surfare. Varje år utses en av eleverna till vinnare av ett sponsoravtal som innebär första steget mot en proffskarriär. Medverkande: Kain O'Keefe, Lachlan Buchanan, Eka Darville, Cariba Heine, Amy Beckwith, Rebecca Breeds m.fl."
    },
    {
        name: "MI High",
        start: "2021-02-10T14:55:00+01:00",
        description: "I dagens samhälle finns en ny typ av hemliga agenter, väl gömda på en plats där skurkar och banditer aldrig skulle leta. Välkomna till S:t Hopes, skolan som gömmer de mest avancerade tonårsagenterna den engelska regeringen har."
    },
    {
        name: "Mitt livs värsta år igen",
        start: "2021-02-10T15:20:00+01:00",
        description: "Del 2 av 13: Februari - alla hjärtans dag. När Alex King går till sängs kvällen före sin 15-årsdag är han lättad över att ett år fullt av pinsamma situationer och andra hemskheter äntligen är slut. Nästa år ska bli så mycket bättre! Men när Alex vaknar nästa morgon upptäcker han att tiden återställts och Alex kommer att få leva sitt livs värsta år en gång till. Svenska röster: Jonas Bane, Linn Ehrner, Axel Bergström, Lucas Krüger, Felice Jankell, Amanda Krüger, Göran Berlander, Ole Ornered m.fl."
    },
    {
        name: "Annedroider",
        start: "2021-02-10T15:45:00+01:00",
        description: "Jakten. Nicks liv ändrades drastiskt när han och hans mamma flyttade in i huset mittemot det mystiska skrotupplaget. Anne, Nick och Shania gör allt de kan för att skydda Hand, Öga och Vän från omvärlden men det blir allt svårare att hålla dem hemliga. Säsong 3."
    },
    {
        name: "Backstage",
        start: "2021-02-10T16:10:00+01:00",
        description: "Ett nytt skolår för de talangfulla tonåringarna, på berömda Keaton School of the arts, som försöker uppfylla sina drömmar om att arbeta som artister, dansare, konstnärer och allehanda kreativa yrken. Säsong 2."
    },
    {
        name: "Vi forever",
        start: "2021-02-10T16:30:00+01:00",
        description: "Joanna vill inte ha nya vänner, hon vill ha sina gamla vänner tillbaka och hon börjar med Linn. Men till hennes stora överraskning är Linn inte hemma, utan bara hennes storebror Patrick. När Patrick berättar att han har gjort slut med Jasmin får Joanna sina förhoppningar om att bli Patricks flickvän tillbaka. Regi: Johanna Runevad. I rollerna: Ebba Tasala, Lilly Starborg, Edit Svanström, Isadora Högrelius m.fl."
    },
    {
        name: "Sommarlägret",
        start: "2021-02-10T16:40:00+01:00",
        description: "Fransk animerad serie från 2012. Under sin vistelse på ett sommarläger upptäcker Mats och Lisa att skogen runt dem är magisk, full av musikaliska fiskar, minnesträd och den legendariske Flapacha! De två kusinerna och deras vänner bestämmer sig för att hålla legenden hemlig och beger sig ut i skogen för att söka efter den mystiske Flapacha som sägs ha svar på alla frågor och kunna besanna dina drömmar.  Svenska röster: Max Nobel, Hanna Bhagavan, Johan H:son Kjellgren, Beatrice Järås m.fl."
    },
    {
        name: "Furiki rullar",
        start: "2021-02-10T16:55:00+01:00",
        description: "Sengångaren André är full av energi och älskar att köra snabba bilar."
    },
    {
        name: "Ett fall för KLURO",
        start: "2021-02-10T17:05:00+01:00",
        description: "Har din bil någon gång börjat dansa, har ditt hus förvandlats till en rymdraket eller har siffrorna i din mattebok försvunnit spårlöst? Agenterna på KLURO fortsätter lösa kluriga problem. "
    },
    {
        name: "Fix och trix",
        start: "2021-02-10T17:15:00+01:00",
        description: "Bihn och Boo gillar att vara i sin trädkoja och skapa olika världar till sina leksaker. Med lite \"fix och trix\" kan man bygga allt möjligt."
    },
    {
        name: "Ho-ho, kör!",
        start: "2021-02-10T17:30:00+01:00",
        description: "En fladdermusfest. Tre små ugglor vet allt om samarbete. Med lite sång och lek kommer de med ho-troliga lösningar."
    },
    {
        name: "Bing",
        start: "2021-02-10T17:35:00+01:00",
        description: "Bing bor tillsammans med Flopp i ett hus i närheten av en stor fin park. Där leker Bing ofta med sina vänner Soola, Pando, Kajsa och lille Charlie. Det finns mycket att undersöka och lära när man är liten som Bing, men Flopp finns alltid nära till hands för att svara på frågor och hjälpa Bing på vägen. "
    },
    {
        name: "Beccas gäng",
        start: "2021-02-10T17:45:00+01:00",
        description: "Becca och hennes vänner i Sidensvansskogen är alltid redo för äventyr."
    },
    {
        name: "Bolibompa",
        start: "2021-02-10T18:00:00+01:00",
        description: "En halvtimmes Bolibompa."
    },
    {
        name: "Daniel Tigers kvarter",
        start: "2021-02-10T18:10:00+01:00",
        description: "Avundsjuka i trädhuset. Daniel Tiger leker med vännerna i sitt kvarter och lär sig saker som är viktiga för att förstå andra människor och världen han växer upp i."
    },
    {
        name: "Doktorerna",
        start: "2021-02-10T18:25:00+01:00",
        description: "Patienten Sofia har ramlat från en klätterställning och skadat armen. Hon får åka ambulans ända in i doktorsmottagningen. Nu åker till och med gipset fram. Inget fall är för svårt för Doktorerna!"
    },
    {
        name: "Labyrint",
        start: "2021-02-10T18:30:00+01:00",
        description: "Daidalos fortsätter sina tester. Nu ska det avgöras. Vem är bäst på att fånga smitande slajm, Stinger, Taurus eller Minus? Daidalos blir till slut tvungen att anropa slajmväktarna för att lösa problemet. Daidalos spelas av Leif Andrée och programledare är Kitty Jutbring. Del 6 av 10."
    },
    {
        name: "Lilla Aktuellt",
        start: "2021-02-10T19:15:00+01:00",
        description: "Nyhetsprogram för barn och unga."
    },
    {
        name: "Småkryp",
        start: "2021-02-10T19:25:00+01:00",
        description: "Hur ser vardagslivet ut för en insekt? En \"docu-cartoon\" med en skämtsam inblick i småkrypens värld."
    },
    {
        name: "Sändningsuppehåll",
        start: "2021-02-10T19:30:00+01:00",
        description: ""
    }
];
let kunskapsKanalenDataRaw = [
    {
        name: "Sändningsuppehåll",
        start: "2021-02-10T05:00:00+01:00",
        description: ""
    },
    {
        name: "UR Samtiden",
        start: "2021-02-10T14:00:00+01:00",
        description: "14:00 Harvey J. Alter - Nobelföreläsning i medicin. 14:50 Michael Hougton - Nobelföreläsning i medicin. 15:20 Charles M. Rice - Nobelföreläsning i medicin. 16:00 Framtiden för högre utbildning. 16:15 Den svenska industrins segertåg. UR."
    },
    {
        name: "En perfekt skridskoälv",
        start: "2021-02-10T17:00:00+01:00",
        description: "76 år gamla Øyvind har åkt skridskor på älven Røa sedan har var liten grabb. Varje vinter när isen väl har lagt sig ger har sig ut tillsammans med sina kamrater. \"Det är lika roligt varje gång\", menar Øyvind. (Norge, 2020)"
    },
    {
        name: "Antikmagasinet",
        start: "2021-02-10T17:05:00+01:00",
        description: "Fotokonsten har fått sin erkända plats i finrummen. Antikmagasinet ger sig in i fotokonstens förtrollande värld. Gäster: Elisabeth Ohlson Wallin, fotograf, och Nette Johansson, gallerist. Programledare: Anne Lundberg. Del 4 av 12."
    },
    {
        name: "Blind i backen",
        start: "2021-02-10T17:35:00+01:00",
        description: "Män och kvinnor som utmanar sina visuella funktionsnedsättningar genom skidåkning. Några uppfattar bara vaga former, ljus och färger och alla åtföljs av en guide. Gemensamt har de en passion för skidåkning. UR."
    },
    {
        name: "Englands historiska hus",
        start: "2021-02-10T18:30:00+01:00",
        description: "Från förhistoriska hyddor till moderna lyxbyggen, hur har de används och förvandlats genom åren? Och hur har hem sett ut under alla historiens epoker? Phil Spencer ger sig ut på jakt efter Storbritanniens 100 mest fascinerande hus och tar reda på vad vi har lärt oss av att bygga hem i tusentals år. Del 1 av 8."
    },
    {
        name: "Djurvärldens kriminella",
        start: "2021-02-10T19:15:00+01:00",
        description: "På Julön i Stilla havet är det krabborna som regerar. De finns i alla storlekar, och de är hungriga. När magen kurrar på den fyra kilo tunga kokoskrabban öppnar den vilken matlåda som helst och drar sig inte ens för att stjäla handväskor. Del 2 av 3: Kriget om födan.  "
    },
    {
        name: "Spåret av ett brott",
        start: "2021-02-10T20:05:00+01:00",
        description: "Så kallade \"cold cases\", olösta gamla mordfall, har nu en unik möjlighet att undersökas igen. DNA från brottsplatser har blivit en viktig del i dessa olösta gåtor, och speciella laboratorium har nu börjat kunna lösa gamla brott på löpande band. En seriemördare från 1970-talet kan äntligen spåras med hjälp av DNA som lämnats kvar på platsen. Del 3 av 3. Genetiska fingeravtryck."
    },
    {
        name: "Dokument utifrån: Det var en gång ett Irak",
        start: "2021-02-10T21:00:00+01:00",
        description: "När Saddam Hussein har störtats uteblir den stabilitet och fred som USA hade förväntat sig. Utan Saddams järnhand blossar ett brutalt inbördeskrig upp mellan olika grupperingar i landet och ett nytt kapitel börjar. Genom djupt personliga intervjuer med vanliga irakier, journalister och soldater tecknas i denna storserie en ny bild av kriget som på många sätt har format världen vi nu lever i. Vilket pris fick civilbefolkningen betala och vilka var de avgörande misstagen? Brittisk dokumentärserie från 2019 av James Bluemel. Del 4 av 5: Saddam."
    },
    {
        name: "Koreakriget",
        start: "2021-02-10T22:00:00+01:00",
        description: "Det glömda kriget. Seriestart. Trots många dödade och stora flyktingskaror har Koreakriget nästan glömts bort. Men med hjälp av historiskt material från nyöppnade arkiv får vi ta del av en av världshistoriens vändpunkter. Del 1 av 2. UR.\n"
    },
    {
        name: "Djur som filmar sig själva",
        start: "2021-02-10T22:55:00+01:00",
        description: "Hur är det att vara hack i häl på antiloper som flyr så jord och stenar sprutar i ögonen på det förföljande rovdjuret? Det kan vi inte veta - om inte geparden som jagar dem själv tar bilderna åt oss. Del 2 av 3."
    },
    {
        name: "Begravda hemligheter",
        start: "2021-02-10T23:45:00+01:00",
        description: "Gravplats för de avrättade. Resterna av över hundra unga män utanför Andover i Hampshire. Förnekad kristen begravning, slarvigt nedkastade i grunda gravar. Vilka var dessa unga män och varför är de begravda på detta sätt? Brittisk faktaserie från 2019. UR."
    },
    {
        name: "Sändningsuppehåll",
        start: "2021-02-11T00:30:00+01:00",
        description: ""
    }
];
let svt24DataRaw = [
    {
        name: "Sändningsuppehåll",
        start: "2021-02-10T05:00:00+01:00",
        description: ""
    },
    {
        name: "Sverige!",
        start: "2021-02-10T19:30:00+01:00",
        description: "Sofia Helin blev världskänd som den trubbiga polisen Saga Norén i Bron. Nu spelar hon en älskvärd kronprinsessa i Atlantic Crossing. Vi träffar också konstnären Dagmar Glemme, vars barndomsminnen från krigets Tyskland fortfarande syns i hennes konst. Dessutom besöker vi det mytomspunna kommunala projektet Dragon Gate. Programledare: Fredrik Önnevall."
    },
    {
        name: "Mustang",
        start: "2021-02-10T20:00:00+01:00",
        description: "Fem föräldralösa tonårssystrar bor tillsammans med sin mormor och morbror i en liten by vid Svarta Havets kust. På väg hem från skolans sommaravslutning skrattar och skojar de med några killar från byn. Snart börjar rykten om osedlighet florera och flickornas mormor blir orolig för att deras värde på äktenskapsmarknaden ska ha tagit skada. Historien växer till oanade proportioner och systrarnas frihet kringskärs allt mer. Deras hem blir snart ett fängelse men under ytan bubblar upproret. Regi: Deniz Gamze Ergüven. I rollerna: Günes Sensoy, Doga Zeynep Doguslu, Tugba Sunguroglu, Elit Iscan, Ilayda Akdogan, Nihal G. Koldas m.fl."
    },
    {
        name: "Din hjärna - teckenspråkstolkat",
        start: "2021-02-10T21:35:00+01:00",
        description: "När är egentligen hjärnan färdigutvecklad och vilka stadier går den igenom för att komma dit? Varför är vi mer risktagande och rebelliska under tonåren? Anders Hansen följer hjärnans utveckling från fosterstadiet till vuxen ålder. Och Eva Dahlgren berättar hur hennes kreativitet utvecklats och förändrats genom livet. Del 4 av 5."
    },
    {
        name: "Tareq Taylors matresa",
        start: "2021-02-10T22:35:00+01:00",
        description: "Tareq träffar Jerusalems store mästerkock och får lära sig hemligheterna i hans restaurangkök. Hela familjen beger sig till kuststaden Tel Aviv där Zafer ivrigt vill lära sin pappa surfa medan Tareq lagar havsaborre med tahinisås i solnedgången vid havet. Del 5 av 6: Havets läckerheter i Tel Aviv."
    },
    {
        name: "Utrikesbyrån",
        start: "2021-02-10T23:05:00+01:00",
        description: "Kampen hårdnar om vaccinen i Europa. Storbritannien håller hårt i Astra Zenecas åtråvärda doser och storgrälar med EU om vem som har rätten till dem. Men är det fel att kapa åt sig vaccin - om man kan? I Utrikesbyrån medverkar Moderatpolitikern Hanif Bali, som engagerat sig i vaccinfrågan, svenskbrittiske journalisten James Savage, som studerat brexitanhängarnas skadeglädje över EU:s saktfärdighet, professorn i global infektionsepidemiolog Anna Mia Ekström, som varnar för vaccinnationalism, samt SVT:s utrikesreporter Christoffer Wendick, som benat i maktspelet kring vaccinen. Programledare: Johan Ripås. Del 4 av 12. "
    },
    {
        name: "Bastubandet från Bergen",
        start: "2021-02-10T23:35:00+01:00",
        description: "Killarna i popbandet Kakkmaddafakka från Bergen tar sitt bastubadande på yttersta allvar. Och vem har sagt att man inte kan ge konsert inne i en bastu?"
    },
    {
        name: "Tack gud jag är homo - syntolkat",
        start: "2021-02-10T23:40:00+01:00",
        description: "Queer-fear . Clara Henry, bloggare och programledare, förklarar skillnaden mellan pan- och bisexualitet. Linda är nervös och rädd för att säga fel när hon ska intervjua två personer som är queer. Alice kallar rädslan för \"queer-fear\". Duon träffar Mona och Malin, två \"real life queers\", och de förklarar vad det betyder. Del 5 av 8. UR."
    },
    {
        name: "Infiltratören - teckenspråkstolkat",
        start: "2021-02-10T23:55:00+01:00",
        description: "Peter är en av huvudpersonerna i det så kallade \"Gotlandsärendet\", ett uppmärksammat och kritiserat narkotikatillslag i Visby 2000. I sin nya roll som Sergeant at arms för Bandidos stockholmsavdelning kommer han för första gången i kontakt med den ryska maffian. Svensk dokumentärserie om polisinfiltratören Peter Rätz som under sju år infiltrerade flera grupperingar inom den organiserade brottsligheten. Del 4 av 6. Operationerna."
    },
    {
        name: "Husdrömmar - syntolkat",
        start: "2021-02-11T00:25:00+01:00",
        description: "På en vacker sjötomt i skogen ska Jon och Jennys nuvarande hus rivas för att ge plats åt det storslagna drömhus som Jenny ritat själv under sin mammaledighet, något som mer liknar en barnteckning i blyerts enligt Gert Wingårdh! Men med Jon och Jennys vilja finns inga hinder, för hur svårt kan det vara att rita och bygga ett hus? Del 2 av 10."
    },
    {
        name: "Sändningsuppehåll",
        start: "2021-02-11T01:25:00+01:00",
        description: ""
    }
];


export {svt1DataRaw, svt2DataRaw, svtBarnDataRaw, kunskapsKanalenDataRaw, svt24DataRaw};