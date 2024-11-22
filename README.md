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
  - Sovellus hyödyntää mm. Vercel AI SDK:n useChat-koukkua chatbot-toiminnallisuuden integroimiseen.
- **Lunni API Integraatio**
  - Integroitu Lunni API -järjestelmän kanssa vikailmoitusten ja kaluston tietojen hakemiseen.

## Kohderyhmä

Tämä sovellus on suunniteltu Helsingin kaupungin kohdevastaavien (talonmiesten) käyttöön.

## Esitiedot

Sovelluksen käyttöönottoa varten tarvitset:

1. [OpenAI API](https://platform.openai.com/) avaimen
2. [Lunni API](https://lunni.io/) avaimen
3. [Supabase](https://supabase.com/) tilin - voit käyttää myös olemassa olevaa Älyä-avustajan tiliä, mutta tarvitset env muuttujat.

## Asennus

1. Kloonaa repositorio:

```bash
git clone https://github.com/laguagu/alya-avustaja
cd alya-avustaja
```

2. Asenna riippuvuudet:

```bash
npm install
```

3. Kopioi `.env.example` tiedosto nimellä `.env.local`:

```bash
cp .env.example .env.local
```

4. Täytä ympäristömuuttujat `.env.local` tiedostoon.

## Supabase asetukset

1. Kirjaudu (tai luo tili) [Supabase](https://supabase.com/) 
2. Hae projektin ympäristömuuttujat Supabase-hallintapaneelista:

![Supabase ympäristömuuttujat](./public/supabase.png)

3. Lisää seuraavat muuttujat `.env.local` tiedostoon:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SUPABASE_PRIVATE_KEY=[YOUR-PRIVATE-KEY]
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
```

- `DATABASE_URL`: Löytyy kohdasta "Database" -> "Connection string"
- `SUPABASE_PRIVATE_KEY`: Löytyy kohdasta "API" -> "anon/public"
- `SUPABASE_URL`: Löytyy kohdasta "API" -> "Project URL"

4. Käynnistä kehityspalvelin komennolla `npm run dev`.

## Tietokannan alustus (Vain jos sinulla ei ole olemassa olevaa Supabase tietokantaa alustettuna älyä-avustajalle)

1. Luo tietokantataulut:

```bash
npm run push
```

2. Aja hakufunktio tietokantaan Supabasen 'SQL Editor' (`db/match_huolto_ohjeet_db_function.sql`):

```sql
-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a function to search for documents
CREATE OR REPLACE FUNCTION match_huolto_ohjeet(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  filter jsonb DEFAULT '{}'::jsonb
) RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    piiroinen_chairs.id,
    piiroinen_chairs.content,
    jsonb_build_object(
      'similarity', 1 - (piiroinen_chairs.embedding <=> query_embedding)
    ) || piiroinen_chairs.metadata AS metadata,
    1 - (piiroinen_chairs.embedding <=> query_embedding) as similarity
  FROM piiroinen_chairs
  WHERE piiroinen_chairs.metadata @> filter
  ORDER BY piiroinen_chairs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

```

match_huolto_ohjeet funktio löytyy myös `db/match_huolto_ohjeet_db_function.sql`

3. Lisää testikäyttäjä (valinnainen):

```bash
npm run seed-db
```

## Sovelluksen Käynnistäminen

- Käynnistä kehityspalvelin komennolla `npm run dev`.

## Keskeiset teknologiat

- Next.js
- LangChain
- OpenAI API
- Supabase (autentikointi ja tietojen tallennus)
- Vercel AI SDK
- Lunni API
- pgvector (PostgreSQL-laajennus vektorihakuun)

## Kehitys

Käytettävissä olevat komennot:

```bash
npm run dev         # Kehityspalvelin
npm run build       # Tuotantoversio
npm run start       # Tuotantopalvelin
npm run lint        # Koodin tarkistus
npm run generate    # Drizzle skeeman generointi
npm run migrate     # Tietokannan migraatio
npm run push        # Drizzle skeeman vienti tietokantaan
npm run pull        # Tietokannan skeeman tuonti
npm run studio      # Drizzle Studio
npm run format      # Koodin formatointi
```

## Ympäristömuuttujat

```env
# OpenAI
OPENAI_API_KEY=****

# Lunni API
LUNNI_API=****
LUNNI_SERVICES=https://apiv3.lunni.io/services
LUNNI_UNITS=https://apiv3.lunni.io/devices
NEXT_PUBLIC_LUNNI_API=****

# JWT Authentication
SECRET=****

# Database Seeding (valinnainen)
USER_PASSWORD=****
USER_EMAIL=****
ADMIN_PASSWORD=****
ADMIN_EMAIL=****

# Development
NODE_ENV=development

# Supabase
DATABASE_URL=****
SUPABASE_PRIVATE_KEY=****
SUPABASE_URL=****
```

## API-reitit

API-reitit löytyvät `api/`-kansiosta esim:

- `api/supabase/route.ts` - Chatbot RAG-toiminnallisuus
- `api/chatbot/route.ts` - Chatbot RAG-toiminnallisuus
- `api/seed/route.ts` - Uusien documenttien vieminen tietokantaan ja niiden splittaus.

## Middleware

Sovelluksen suojaus ja API-reittien autentikointi on toteutettu middleware-tasolla (`middleware.ts`). Autentikoinnin voi poistaa käytöstä kommentoimalla tiedoston ulos esimerkiksi.

## Tietokantarakenne

Tietokantarakenne on määritelty Drizzle ORM:n avulla (`db/drizzle/schema.ts`). Sisältää seuraavat taulut:

- users
- sessions
- chat_messages
- chat_feedback
- issue_feedback

## Tietojen Tallennus

Sovellus käyttää Supabase-tietokantaa seuraavien tietojen tallentamiseen:

- Käyttäjien kirjautumistiedot
- Chatbotin viestit
- Vektori-embeddings huolto-ohjeille
- Käyttäjä palaute

Nämä tiedot tallennetaan käyttökokemuksen parantamiseksi, keskusteluhistorian säilyttämiseksi ja tehokkaan semanttisen haun mahdollistamiseksi.

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

   - Käyttää LagnChainin RecursiveCharacterTextSplitter-algoritmiä tekstin jakamiseen semanttisesti merkityksellisiin osiin.
   - Optimoi kontekstin säilymisen ja parantaa hakutulosten laatua.

5. **Luonnollisen kielen käsittely (NLP)**:

   - Hyödyntää edistyneitä NLP-tekniikoita kysymysten ymmärtämiseen ja kontekstin säilyttämiseen.
   - Sisältää tekniikoita kuten tokenisaatio, lemmatisaatio ja kontekstuaalinen analyysi.
   - NLP-toiminnallisuudet on integroitu sovellukseen LangChain-kirjaston ja OpenAI:n mallien kautta, parantaen merkittävästi chatbotin kykyä ymmärtää ja vastata kysymyksiin Piiroisen huonekalujen huollosta.

6. **Streaming ja asynkroninen prosessointi**:

   - Käyttää moderneja asynkronisia tekniikoita, kuten streamausta, mahdollistaen tehokkaan ja reaaliaikaisen vastausten generoinnin.

7. **Joustava tekoälyarkkitehtuuri**:
   - LangChain-pohjainen toteutus mahdollistaa eri komponenttien (kuten embeddings-mallin tai LLM:n) helpon vaihtamisen.

## Lisenssi

License - katso [LICENCE](LICENCE) tiedosto lisätietoja varten.
