"use server";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { formatDocumentsAsString } from "langchain/util/document";

// const FI_ANSWER_TEMPLATE = `
// Olet tekoälyavustaja, jonka tehtävänä on auttaa huonekalujen kunnossapidossa ja korjaamisessa. Kaikki vastaukset tulee antaa suomeksi. Tehtäväsi on tarjota tarkkoja ja käytännöllisiä huolto- ja korjausohjeita eri huonekaluille sekä tietoa niiden käytetyistä osista.

// Muotoile vastauksesi tarkasti ja selkeästi. Tarjoa käytännön neuvoja, jotka auttavat pidentämään huonekalujen käyttöikää ja toimivuutta. Käytä ammattimaista mutta lähestyttävää sävyä, varmistaen, että ohjeet ovat helposti ymmärrettävissä. Vastaus saa olla enintään 200 sanaa pitkä.

// Anna vastaus pelkkänä tekstinä ilman mitään Markdown-muotoilua, kuten tähtiä *, alaviivoja tai muita erikoismerkkejä.

// Keskity tarkasti esitettyyn ongelmaan. Jos tarkkaa ohjetta ei ole saatavilla, anna paras mahdollinen neuvo annetun kontekstin pohjalta. Jos et tiedä vastausta, ilmaise se kohteliaasti.

// Vastaa annetun kontekstin perusteella:

// <context>
//   {context}
// </context>

// Alkuperäinen ongelma: {issue_description}

// Kysymys: {question}
// `;

const FI_ANSWER_TEMPLATE = `
Olet Piiroisen huonekalujen asiantuntijajärjestelmä, jonka tehtävänä on auttaa Helsingin koulujen kohdevastaavia tekemään alustava arvio ja toteuttamaan huolto- ja korjaustyö huonekalulle. Tehtäväsi on tarjota tarkka ja käytännöllinen huolto- ja korjausohje sekä tietoa huonekalujen osista (jos saatavilla). Kaikki vastaukset tulee antaa suomeksi.

Tehtäväsi on:
1. Tarkistaa annetusta kontekstista kyseisen huonekalun viralliset huolto- ja tarkistusohjeet
2. Arvioida ongelman vakavuus ja kiireellisyys huolto-ohjeiden perusteella
3. Arvioida huonekalun käyttöturvallisuus nykyisessä tilassa
4. Määritellä, mitkä toimenpiteet voi tehdä itse ja mitkä vaativat huoltopalvelua
5. Antaa huoltotarpeen mukaiset ohjeet huonekalun korjaamiseen tai huoltoon

Huomioi seuraavat asiat:
- Sisällytä KAIKKI kontekstista löytyvät olennaiset tarkistus- ja huoltokohdat vastaukseen
- Kerro myös muut kontekstista löytyvät huomiot kyseisen ongelman yhteydessä
- Jos ohjeissa ei ole mainittu tiettyä toimenpidettä, mainitse siitä selkeästi
- Jos kyseessä on yksinkertainen tarkistus tai säätö, anna tarkat ohjeet
- Jos vika vaatii Piiroisen huoltoa ohjeiden mukaan, ohjaa suoraan huoltopalveluun
- Mainitse selkeästi, jos vika vaatii välitöntä käytöstä poistoa
- Jos et ole varma yksityiskohdasta, suosittele ammattilaisen arviota

Vastaa annetun kontekstin perusteella:

<context>
  {context}
</context>

Alkuperäinen ongelma: {issue_description}

Anna vastauksessa selkeässä järjestyksessä:
1. Ongelman vakavuusaste ja mahdollinen käytöstä poiston tarve
2. Selkeät vaiheittaiset tarkistus- ja korjausohjeet mahdollisimman kattavasti kontekstin mukaan (jos mahdollista tehdä itse)
3. Muut huolto-ohjeissa mainitut tarkistettavat asiat kyseiseen ongelmaan liittyen
4. Ohjeet jatkotoimenpiteistä (korjaus itse / yhteydenotto huoltopalveluun)
5. Mahdolliset huonekalun käyttöön liittyvät suositukset (merkitseminen, siirtäminen pois käytöstä jne.)

Anna vastaus pelkkänä tekstinä ilman mitään Markdown-muotoilua tai erikoismerkkejä. Vastaus saa olla enintään 250 sanaa pitkä. Lopeta vastaus viimeiseen ohjeeseen tai toimenpiteeseen, älä lisää yleisiä huomioita tai neuvoja loppuun.

Kysymys: {question}
`;

const answerPrompt = PromptTemplate.fromTemplate(FI_ANSWER_TEMPLATE);

// Template kysymyksen tiivistämiseen standalone-kysymykseksi.
const STANDALONE_QUESTION_TEMPLATE = `Given the following furniture information and issue description, rephrase the follow up question to be a standalone question, in its original language, that can be used to retrieve relevant maintenance and repair information from a database.
----------
Furniture Name: {furniture_name}
----------
Issue Description: {issue_description}
----------
Standalone question:`;

const standAloneQuestionPrompt = PromptTemplate.fromTemplate(
  STANDALONE_QUESTION_TEMPLATE,
);

interface GenerateInstructionParams {
  furniture_name: string;
  furnitureProblem: string;
}

export async function generateAIinstruction({
  furniture_name,
  furnitureProblem,
}: GenerateInstructionParams): Promise<string> {
  if (!furniture_name || furniture_name.trim() === "") {
    return "Huonekalun nimeä ei ole annettu. Tarvitsen huonekalun mallin (esim. Arena 022) voidakseni antaa tarkkoja huolto-ohjeita. Ole hyvä ja tarkenna huonekalun tiedoissa, mistä Piiroisen huonekalumallista on kyse.";
  }

  // Tarkistetaan furnitureProblem
  if (!furnitureProblem || furnitureProblem.trim() === "") {
    return "Vikailmoituksessa ei ole kerrottu Huoltotarpeen kuvausta. Kerro tarkemmin, mikä huonekalussa on vialla, kohdassa 'Huoltotarpeen kuvaus' niin voin auttaa ongelman ratkaisussa. Huom! Muista painaa 'Tallenna muutokset' vikailmoituksesta kun olet täydentänyt kuvauksen ennen kuin voin auttaa.";
  }

  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4.1-2025-04-14",
      temperature: 0.2,
      // verbose: true, // Tulostaa lisätietoja, jos true
      streaming: true,
    });

    // Alustetaan StringOutputParser mallille
    const modelWithParser = RunnableSequence.from([
      model,
      new StringOutputParser(),
    ]);

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "piiroinen_chairs",
      queryName: "match_huolto_ohjeet",
    });

    const standaloneQuestionChain = RunnableSequence.from([
      standAloneQuestionPrompt,
      modelWithParser,
    ]);

    // 1. Luodaan standalone-kysymys
    const standalone_question = await standaloneQuestionChain.invoke({
      furniture_name,
      issue_description: furnitureProblem,
    });

    // 2. Haetaan dokumentit
    const retriever = vectorstore.asRetriever({
      k: 8,
      // callbacks: [
      //   {
      //     handleRetrieverEnd(documents: Document<Record<string, any>>[]) {
      //       console.log("Haetut dokumentit:", documents.length);
      //     },
      //   },
      // ],
    });
    const docs = await retriever.invoke(standalone_question);
    const context = formatDocumentsAsString(docs);

    // 3. Generoidaan vastaus
    const answerChain = await answerPrompt.format({
      context,
      issue_description: furnitureProblem,
      question: standalone_question,
    });

    const answer = await modelWithParser.invoke(answerChain);

    return answer;
  } catch (e: any) {
    console.error("Virhe huolto-ohje suosituksen generoinnissa:", e);
    return "Huolto-ohje suosituksen luonti epäonnistui. Tarkista vikailmoituksen tiedot ja yritä uudelleen. Jos ongelma jatkuu, ota yhteyttä järjestelmän ylläpitoon.";
  }
}
