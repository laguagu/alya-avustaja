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
import { Document } from "@langchain/core/documents";
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
// const ENG_ANSWER_TEMPLATE = `
// You are a Finnish-speaking AI assistant specializing in Piiroinen furniture maintenance and repair. You're assisting a caretaker with furniture care instructions. Answer the question based on the given context and chat history, applying the general instructions to the specific furniture when possible. If you don't know the answer or if the information isn't applicable to the specific furniture, say so directly.

// Respond concisely and clearly, using simple sentences and lists. Do not use special characters or formatting.

// <context>
//   {context}
// </context>

// <chat_history>
//   {chat_history}
// </chat_history>

// Question: {question}
// Answer in Finnish:
// `;
const FI_ANSWER_TEMPLATE = `
Olet suomenkielinen tekoälyavustaja, joka on erikoistunut Piiroisen huonekalujen huoltoon ja korjaukseen. Tehtäväsi on auttaa huoltohenkilöstöä huonekalujen hoito-ohjeissa. 

Ohjeet vastaamiseen:
1. Lue huolellisesti annettu konteksti ja keskusteluhistoria.
2. Huomioi käyttäjän aiemmat kysymykset ja antamasi vastaukset.
3. Älä koskaan mainitse tai viittaa tiettyyn tuolimalliin (kuten Arena 022), ellei käyttäjä ole sitä erikseen maininnut.
4. Aloita vastaus aina yleisillä ohjeilla tai tiedoilla, jotka pätevät useimpiin Piiroisen tuoleihin.
5. Vastaa kysymykseen selkeästi ja ytimekkäästi käyttäen yksinkertaisia lauseita ja tarvittaessa listoja.
6. Tarjoa aina konkreettisia, yleisiä ohjeita seuraavasti:
   a) Anna vähintään 3-4 yleistä askelta tai vinkkiä kysyttyyn huoltotoimenpiteeseen.
   b) Mainitse yleisiä työkaluja tai materiaaleja, joita toimenpiteessä saatetaan tarvita.
   c) Kerro mahdollisista varotoimenpiteistä tai huomioitavista asioista.
7. Jos et tiedä tarkkaa vastausta:
   a) Ilmaise se kohteliaasti, mutta tarjoa silti hyödyllisiä yleisiä ohjeita.
   b) Ehdota, mistä käyttäjä voisi saada lisätietoa (esim. Piiroisen verkkosivut tai asiakaspalvelu).
8. Kannusta käyttäjää ottamaan yhteyttä Piiroisen asiakaspalveluun vain, jos toimenpide vaikuttaa monimutkaiselta tai vaaralliselta tehdä itse.
9. Päätä vastauksesi aina rohkaisevaan kommenttiin tai tarjoukseen auttaa lisää tarvittaessa.

Muista: Älä koskaan sano "valitettavasti en voi antaa tarkkoja ohjeita". Sen sijaan, tarjoa aina yleisiä, hyödyllisiä ohjeita.

Älä käytä erikoismerkkejä tai muotoiluja. Vastaa aina suomeksi.

<annettu_konteksti>
{context}
</annettu_konteksti>

<keskusteluhistoria>
{chat_history}
</keskusteluhistoria>

Käyttäjän kysymys: {question}
Vastauksesi suomeksi:
`;
const answerPrompt = PromptTemplate.fromTemplate(FI_ANSWER_TEMPLATE);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? []; // Ottaa viestit pyynnön rungosta tai tyhjän taulukon, jos viestejä ei ole
    const previousMessages = messages.slice(0, -1); // Ottaa kaikki viestit paitsi viimeisen
    const currentMessageContent = messages[messages.length - 1].content; // Ottaa viimeisen viestin sisällön
    console.log("Kaikki viestit:", formatVercelMessages(previousMessages));
    const checkQuestionClarity = (question: string) => {
      if (question.length < 5) {
        return "Voisitko tarkentaa kysymystäsi? Yritä muotoilla se kokonaisena kysymyslauseena ja mainitse, mitä Piiroisen huonekalua kysymys koskee.";
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

    const getKValue = (question: string) => {
      if (question.length < 50) return 3;
      if (question.length <= 100) return 4;
      return 5;
    };
    // Hakee dokumentit Supabase-tietokannasta.
    // let resolveWithDocuments: (value: Document[]) => void;
    const retriever = vectorstore.asRetriever({
      k: getKValue(currentMessageContent),
      // callbacks: [
      //   {
      //     handleRetrieverEnd(documents: Document<Record<string, any>>[]) {
      //       console.log("documents", documents); // Tulostaa kaikki haetut dokumentit
      //       resolveWithDocuments(documents); // Kun dokumentit on haettu, ratkaisee lupauksen dokumenteilla
      //     },
      //   },
      // ],
    });

    const retrievalChain = retriever.pipe(formatDocumentsAsString); // Kombinoi haetut dokumentit yhdeksi tekstiksi

    // Alustaa ketjun vastauksen generoimiseen.
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    // Suorittaa ketjun, joka tuottaa vastauksen käyttäjän kysymykseen.
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: (input) => {
          // Saa standalone-kysymyksen ketjusta
          if (input.question.split(" ").length <= 10) {
            return Promise.resolve(input.question);
          }
          return standaloneQuestionChain.invoke({
            question: input.question,
            chat_history: input.chat_history,
          });
        },
        chat_history: (input) => input.chat_history, // Saa keskusteluhistorian syötteenä
      },
      answerChain,
      // new BytesOutputParser(), // Striimaa vastauksen
      // new StringOutputParser(), // Ei striimaukseen sendMessage kanssa frontendissa
    ]);

    // Lähettää vastauksen streamattuna takaisin klientille.
    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages), // Muotoilee keskusteluhistorian
    });

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (e: any) {
    console.error("Tarkka virhe:", e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
