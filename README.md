# Kalustohuollon ja Vikailmoitusten Hallintasovellus

Tämä sovellus tarjoaa kattavan ratkaisun kaluston vikojen katseluun, raportointiin ja päivittämiseen. Se hyödyntää edistynyttä tekoälypohjaista chatbot-teknologiaa tarjotakseen huolto-ohjeita, helpottaen käyttäjien kaluston hallintaa ja korjaamista. Sovellus on rakennettu Next.js:llä ja se käyttää LangChain-kirjastoa, integroituen saumattomasti OpenAI:n malleihin keskustelevan tekoälyn vastausten generoimiseksi.

## Ominaisuudet

- **Vikailmoitusten Raportointi ja Katselu**
  - Käyttäjät voivat raportoida uusia kaluston vikoja.
  - Tarkastella olemassa olevia vikoja yksityiskohtaisine kuvauksineen.

- **Huolto-ohjeet**
  - Saada yksityiskohtaisia huolto- ja korjausohjeita tekoäly-chatbotilta.
  - Chatbot tarjoaa vastauksia suomeksi, keskittyen tarkkuuteen ja selkeyteen.

- **Tekoälypohjaiset Ratkaisut**
  - Hyödyntää LangChainia keskustelukontekstien käsittelyyn ja hallintaan.
  - Integroituu OpenAI:n kanssa tekoälyvastausten generoimiseksi.

- **Autentikointi**
  - Sovellus käyttää Supabasea autentikointiin JSON Web Token (JWT) -teknologialla.

- **AI SDK Integraatio**
  - Sovellus hyödyntää Vercel AI SDK:n useChat-koukkua chatbot-toiminnallisuuden integroimiseen.

- **Lunni API Integraatio**
  - Integroitu Lunni API -järjestelmän kanssa vikailmoitusten ja kaluston tietojen hakemiseen.

## Kohderyhmä

Tämä sovellus on suunniteltu erityisesti Helsingin kaupungin kohdevastaavien (talonmiesten) käyttöön.

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
- Supabase (autentikointi)
- Vercel AI SDK
- Lunni API
