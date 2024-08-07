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

// Määritellään maksimi keskusteluhistorian pituus
const MAX_CHAT_HISTORY_LENGTH = 14;

// Apufunktio keskusteluhistorian formaatoinnille viestien roolien mukaan.
const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const recentChatHistory = chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH);
  const formattedDialogueTurns = recentChatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
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
const ENG_ANSWER_TEMPLATE = `
You are a Finnish-speaking AI assistant specializing in Piiroinen furniture maintenance and repair. You're assisting a caretaker with furniture care instructions. Answer the question based only on the given context and chat history. If you don't know the answer, say so directly.

Respond concisely and clearly, using simple sentences and lists. Do not use special characters or formatting.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
Answer:
`;

const answerPrompt = PromptTemplate.fromTemplate(ENG_ANSWER_TEMPLATE);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? []; // Ottaa viestit pyynnön rungosta tai tyhjän taulukon, jos viestejä ei ole
    const previousMessages = messages.slice(0, -1); // Ottaa kaikki viestit paitsi viimeisen
    const currentMessageContent = messages[messages.length - 1].content; // Ottaa viimeisen viestin sisällön

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
      modelName: "gpt-4o",
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

    // let resolveWithDocuments: (value: Document[]) => void;

    // Hakee dokumentit Supabase-tietokannasta.
    const retriever = vectorstore.asRetriever({
      k: 2,
      // callbacks: [
      //   {
      //     handleRetrieverEnd(documents: Document<Record<string, any>>[]) {
      //       // console.log("documents", documents); // Tulostaa kaikki haetut dokumentit
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
          return standaloneQuestionChain.invoke(input);
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

// const getFurnitureType = (question: string) => {
//   // Yksinkertainen esimerkki, voit laajentaa tätä tarpeen mukaan
//   const furnitureTypes = ["tuoli", "pöytä", "kaappi", "sohva"];
//   return furnitureTypes.find(type => question.toLowerCase().includes(type)) || "yleinen";
// };

// // Käytä tätä funktiota ennen vektorihakua
// const furnitureType = getFurnitureType(currentMessageContent);
// // Muokkaa retriever-kutsua käyttämään furnitureType-muuttujaa haussa

// const FI_ANSWER_TEMPLATE = `
// Olet tekoälyavustaja, joka auttaa huonekalujen kunnossapidossa ja korjaamisessa. Olet suomenkielinen avustaja, joten kaikki vastaukset tulee antaa suomeksi. Tehtäväsi on antaa selkeitä ja käytännöllisiä huolto- ja korjausohjeita huonekaluille sekä tietoa niiden käytetyistä osista.

// Muotoile vastauksesi tarkasti ja selkeästi. Tarjoa käytännön neuvoja, jotka auttavat pidentämään huonekalujen käyttöikää ja toimivuutta. Käytä ammattimaista mutta lähestyttävää sävyä, varmistaen, että ohjeet ovat helposti ymmärrettävissä.

// Anna vastaus pelkässä tekstimuodossa ilman mitään Markdown-muotoilua, kuten tähtiä, alaviivoja tai muita erikoismerkkejä. Käytä yksinkertaisia lauseita ja listoja.

// Vastaa kysymykseen alla olevan kontekstin ja keskusteluhistorian perusteella (jos niitä on). Jos et tiedä vastausta, sano vain, ettet tiedä, älä yritä keksiä vastausta:

// <context>
//   {context}
// </context>

// <chat_history>
//   {chat_history}
// </chat_history>

// Kysymys: {question}
// `;
// const ENG_ANSWER_TEMPLATE = `
// You are an AI assistant designed to assist in maintaining and repairing furniture. You are a Finnish-speaking assistant, so all responses should be in Finnish. Your primary tasks include providing detailed maintenance and repair instructions for various furniture pieces, as well as information on the parts they use.

// As you formulate your responses, consider the principles of precision and clarity. Offer thorough and practical advice that helps in extending the lifespan and functionality of the furniture. Use a tone that is professional yet approachable, ensuring that the instructions are easy to follow and understand.

// **Please provide the response in plain text without any Markdown formatting, including asterisks, underscores, or other special characters. Use simple sentences and lists.**

// Answer the question based only on the following context and chat history (if any). Do not make up an answer. If you don't know the answer, just say that you don't know:

// <context>
//   {context}
// </context>

// <chat_history>
//   {chat_history}
// </chat_history>

// Question: {question}
// `;
