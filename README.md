# Kalustohuollon ja Vikailmoitusten Hallintasovellus - Älyäavustaja

Tämä sovellus tarjoaa kattavan ratkaisun kaluston vikojen katseluun, raportointiin ja päivittämiseen. Se hyödyntää edistynyttä tekoälypohjaista chatbot-teknologiaa tarjotakseen huolto-ohjeita, helpottaen käyttäjien kaluston hallintaa ja korjaamista. Sovellus on rakennettu Next.js:llä ja se käyttää LangChain-kirjastoa, integroituen saumattomasti OpenAI:n malleihin keskustelevan tekoälyn vastausten generoimiseksi.

## Ominaisuudet

- **Vikailmoitusten Raportointi ja Katselu**
  - Käyttäjät voivat raportoida uusia kaluston vikoja.
  - Tarkastella olemassa olevia vikoja yksityiskohtaisine kuvauksineen.
  - Sulkea/Avata vikailmoituksia
  - Täydentää vikailmoituksua automaattisesti
- **Huolto-ohjeet**
  - Saada yksityiskohtaisia huolto- ja korjausohjeita tekoäly-chatbotilta.
  - Chatbot tarjoaa vastauksia suomeksi Piiroisen huonekalujen ylläpitoon ja huoltoon keskittyen.
- **Tekoälypohjaiset Ratkaisut**
  - Hyödyntää LangChainia keskustelukontekstien käsittelyyn ja hallintaan.
  - Integroituu OpenAI:n kanssa tekoälyvastausten generoimiseksi.
- **Autentikointi**
  - Sovellus käyttää Supabasea autentikointiin JSON Web Token (JWT) -teknologialla.
- **AI SDK Integraatio**
  - Sovellus hyödyntää Vercel AI SDK:n useChat-koukkua chatbot-toiminnallisuuden integroimiseen.
- **Lunni API Integraatio**
  - Integroitu Lunni API -järjestelmän kanssa vikailmoitusten ja kaluston tietojen hakemiseen.

## Edistyneet Tekoäly- ja Koneoppimismenetelmät

Sovellus hyödyntää useita edistyneitä tekoäly- ja koneoppimismenetelmiä:

1. **Retrieval-Augmented Generation (RAG)**: 
   - Yhdistää tiedonhaun ja tekstin generoinnin, mahdollistaen dynaamisen ja kontekstiriippuvaisen tiedon yhdistämisen.
   - Tuottaa tarkempia ja relevantimpia vastauksia verrattuna perinteisiin kysymys-vastausjärjestelmiin.

2. **Vektori-embedding**:
   - Käyttää OpenAI:n kehittämää embedding-mallia, joka perustuu syviin neuroverkkoihin.
   - Muuntaa tekstin korkeaulotteisiksi vektoreiksi säilyttäen tekstin semanttisen merkityksen.
   - Hyödyntää transfer learning -tekniikkaa, jossa suuria kielimalleja on esikoulutettu valtavilla tekstimäärillä.

3. **Similariteettihaku vektoritietokannassa**:
   - Hyödyntää cosine-similariteettia vektorien vertailuun semanttisen samankaltaisuuden mittaamiseksi.
   - Mahdollistaa "fuzzy matching" -tyylisen haun, joka ymmärtää kontekstin ja merkityksen.

4. **Edistynyt tekstin jakaminen (chunking)**:
   - Käyttää RecursiveCharacterTextSplitter-algoritmiä tekstin jakamiseen semanttisesti merkityksellisiin osiin.
   - Optimoi kontekstin säilymisen ja parantaa hakutulosten laatua.

5. **Luonnollisen kielen käsittely (NLP)**:
   - Hyödyntää edistyneitä NLP-tekniikoita kysymysten ymmärtämiseen ja kontekstin säilyttämiseen.
   - Sisältää tekniikoita kuten tokenisaatio, lemmatisaatio ja kontekstuaalinen analyysi.
   - NLP-toiminnallisuudet on integroitu sovellukseen LangChain-kirjaston ja OpenAI:n mallien kautta, parantaen merkittävästi chatbotin kykyä ymmärtää ja vastata kysymyksiin Piiroisen huonekalujen huollosta.
6. **Streaming ja asynkroninen prosessointi**:
   - Käyttää moderneja asynkronisia tekniikoita, kuten streamausta, mahdollistaen tehokkaan ja reaaliaikaisen vastausten generoinnin.

7. **Joustava tekoälyarkkitehtuuri**:
   - LangChain-pohjainen toteutus mahdollistaa eri komponenttien (kuten embeddings-mallin tai LLM:n) helpon vaihtamisen.

Nämä tekniikat edustavat tekoälyn ja koneoppimisen viimeisimpiä edistysaskeleita tiedonhaussa ja luonnollisen kielen käsittelyssä, mahdollistaen älykkäämmän, kontekstitietoisemman ja tehokkaamman tiedonkäsittelyn.

## Tietojen Tallennus

Sovellus käyttää Supabase-tietokantaa seuraavien tietojen tallentamiseen:
- Käyttäjien kirjautumistiedot
- Chatbotin viestit
- Vektori-embeddings huolto-ohjeille

Nämä tiedot tallennetaan käyttökokemuksen parantamiseksi, keskusteluhistorian säilyttämiseksi ja tehokkaan semanttisen haun mahdollistamiseksi.

## Kohderyhmä

Tämä sovellus on suunniteltu Helsingin kaupungin kohdevastaavien (talonmiesten) käyttöön.

## Asennus

1. Kloonaa repositorio paikalliselle koneellesi.
2. Asenna riippuvuudet suorittamalla `npm install`.
3. Määritä `.env`-tiedosto API-avaimillasi.

## Sovelluksen Käynnistäminen

- Käynnistä kehityspalvelin komennolla `npm run dev`.
- Rakenna sovellus tuotantoa varten komennolla `npm run build`.
- Käynnistä tuotantopalvelin komennolla `npm start`.

## Teknologiat

- Next.js
- LangChain
- OpenAI API
- Supabase (autentikointi ja tietojen tallennus)
- Vercel AI SDK
- Lunni API
- pgvector (PostgreSQL-laajennus vektorihakuun)
