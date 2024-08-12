// Tämä koodi käyttää LangChaini uutta LangChain Expression Language (LCEL) raknnetta https://js.langchain.com/docs/expression_language/
import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, LangChainAdapter } from "ai";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import RelevanceThresholdRetriever from "@/lib/retrievers/CustomRetviever";

export const dynamic = "force-dynamic";
// Määritellään maksimi keskusteluhistorian pituus
const MAX_CHAT_HISTORY_LENGTH = 14;

// Apufunktio keskusteluhistorian formaatoinnille viestien roolien mukaan.
const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const recentChatHistory = chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH);
  const formattedDialogueTurns = recentChatHistory.map((message) => {
    if (message.role === "user") {
      return `Käyttäjä: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Avustaja: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

// Template kysymyksen tiivistämiseen standalone-kysymykseksi.
const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

// Vastausmalli, joka käyttää aiempaa keskusteluhistoriaa ja kontekstia vastauksen generoimiseen.
// const ANSWER_TEMPLATE = `
// You are a Finnish-speaking AI assistant specializing in Piiroinen furniture maintenance and repair. You're assisting a caretaker with furniture care instructions. The user is asking about {furniture_name}. Answer the question based on the given context and chat history, applying the general instructions to the specific furniture when possible. If you don't know the answer or if the information isn't applicable to the specific furniture, say so directly.

// Respond concisely and clearly, using simple sentences and lists. Do not use special characters or formatting.

// <context>
//   {context}
// </context>

// <chat_history>
//   {chat_history}
// </chat_history>

// Question about {furniture_name}: {question}
// Answer in Finnish:
// `;
const SUOMI_VASTAUS_MALLI = `
Olet suomenkielinen tekoälyavustaja, joka on erikoistunut Piiroisen huonekalujen huoltoon ja korjaukseen. Tehtäväsi on auttaa huoltohenkilöstöä huonekalujen hoito-ohjeissa. Käyttäjä kysyy tietoja huonekalusta nimeltä {furniture_name}.

Ohjeet vastaamiseen:
1. Lue huolellisesti annettu konteksti ja keskusteluhistoria.
2. Aloita vastaus aina positiivisesti ja ystävällisesti."
3. Vastaa kysymykseen selkeästi ja ytimekkäästi käyttäen yksinkertaisia lauseita ja tarvittaessa listoja.
4. Tarjoa aina konkreettisia ohjeita seuraavasti:
   a) Anna vähintään 3-4 askelta tai vinkkiä kysyttyyn huoltotoimenpiteeseen, jotka soveltuvat erityisesti {furniture_name}-huonekalulle.
   b) Mainitse mahdollisia työkaluja tai materiaaleja, joita toimenpiteessä saatetaan tarvita.
   c) Kerro mahdollisista varotoimenpiteistä tai huomioitavista asioista liittyen {furniture_name}-huonekaluun.
5. Jos et tiedä tarkkaa vastausta tai tieto ei täysin sovellu {furniture_name}-huonekaluun:
   a) Ilmaise se kohteliaasti, mutta tarjoa silti hyödyllisiä yleisiä ohjeita, jotka voisivat soveltua kyseiseen huonekaluun.
   b) Kerro, miten yleisiä ohjeita voisi soveltaa {furniture_name}-huonekaluun.
   c) Ehdota, mistä käyttäjä voisi saada lisätietoa (esim. Piiroisen verkkosivut tai asiakaspalvelu).
6. Jos käyttäjä pyytää ottamaan yhteyttä Piiroisen huoltoon:
   a) Tarjoa ensin vaihtoehtoja, kuten yleisiä huolto-ohjeita tai vinkkejä ongelman ratkaisemiseksi itse.
   b) Jos ongelma vaatii ammattilaisen apua, kerro, miten ja mistä voi saada yhteyden huoltopalveluun {furniture_name}-huonekalua varten.
7. Pyri aina tarjoamaan jotain hyödyllistä ja käytännöllistä tietoa {furniture_name}-huonekalusta, vaikka se ei olisi suora vastaus kysymykseen.
8. Päätä vastauksesi aina rohkaisevaan kommenttiin tai tarjoukseen auttaa lisää tarvittaessa, esimerkiksi "Toivottavasti tämä auttaa {furniture_name}-huonekalusi kanssa. Jos tarvitset lisätietoja, kysy ihmeessä!"

Muista: Älä koskaan sano "valitettavasti en voi antaa tarkkoja ohjeita". Sen sijaan, tarjoa aina hyödyllisiä ohjeita, jotka soveltuvat mahdollisimman hyvin {furniture_name}-huonekaluun.

Älä käytä erikoismerkkejä tai muotoiluja. Vastaa aina selkeällä ja ymmärrettävällä suomen kielellä.

<konteksti>
  {context}
</konteksti>

<keskusteluhistoria>
  {chat_history}
</keskusteluhistoria>

Kysymys koskien {furniture_name}-huonekalua: {question}
Vastaus:
`;
const answerPrompt = PromptTemplate.fromTemplate(SUOMI_VASTAUS_MALLI);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? []; // Ottaa viestit pyynnön rungosta tai tyhjän taulukon, jos viestejä ei ole
    const previousMessages = messages.slice(0, -1); // Ottaa kaikki viestit paitsi viimeisen
    const currentMessageContent = messages[messages.length - 1].content; // Ottaa viimeisen viestin sisällön
    const furnitureName = body.furnitureName ?? "unknown furniture";

    const checkQuestionClarity = (question: string) => {
      if (question.length < 5) {
        return "Voisitko tarkentaa kysymystäsi? Yritä muotoilla se kokonaisena kysymyslauseena.";
      }
      return null;
    };

    // Tarkista kysymyksen selkeys
    const clarificationNeeded = checkQuestionClarity(currentMessageContent);
    if (clarificationNeeded) {
      // Create a ReadableStream from the clarificationNeeded string
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(clarificationNeeded);
          controller.close();
        },
      });

      // Palaa striimattuna, jos kysymys ei ole riittävän selkeä
      return LangChainAdapter.toDataStreamResponse(stream);
    }

    // Alustaa OpenAI-mallin ja Supabase-asiakasohjelman.
    const model = new ChatOpenAI({
      modelName: "gpt-4o-2024-08-06",
      temperature: 0.0,
      // verbose: true, // Tulostaa lisätietoja, jos true
      streaming: true,
    });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "piiroinen_chairs", // Tietokantataulun nimi
      queryName: "matching_documents", // Kysely funktion nimi
    });

    // Muodostaa LangChain-ketjuja tiedonhaulle ja vastausten generoinnille.
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const getKValue = (question: string) =>
      question.length < 50 ? 3 : question.length <= 100 ? 4 : 5;

    const customRetriever = new RelevanceThresholdRetriever(
      vectorstore,
      getKValue(currentMessageContent),
      0.75, // Increased threshold for more relevant results
    );

    const retrievalChain = RunnableSequence.from([
      (input) => {
        return typeof input === "string"
          ? input
          : `${input.furniture_name}: ${input.question}`;
      },
      customRetriever.getRelevantDocuments.bind(customRetriever),
      formatDocumentsAsString,
    ]);

    // Alustaa ketjun vastauksen generoimiseen.
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
        furniture_name: (input) => input.furniture_name,
      },
      answerPrompt,
      model,
    ]);

    // Suorittaa ketjun, joka tuottaa vastauksen käyttäjän kysymykseen.
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
        furniture_name: (input) => input.furniture_name,
      },
      answerChain,
    ]);

    // Lähettää vastauksen streamattuna takaisin klientille.
    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages), // Muotoilee keskusteluhistorian
      furniture_name: furnitureName,
    });

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
