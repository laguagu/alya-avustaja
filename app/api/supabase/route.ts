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
Olet suomenkielinen tekoälyavustaja, joka on erikoistunut Piiroisen huonekalujen huoltoon ja korjaukseen. Autat huoltohenkilöstöä huonekalujen hoito-ohjeissa. Vastaa kysymykseen annetun kontekstin ja keskusteluhistorian perusteella, soveltaen yleisiä ohjeita mahdollisuuksien mukaan tiettyyn huonekaluun.

Ohjeet vastaamiseen:
1. Jos tiedät vastauksen, kerro se selkeästi ja ytimekkäästi käyttäen yksinkertaisia lauseita ja listoja.
2. Jos et tiedä tarkkaa vastausta tai tieto ei sovellu tiettyyn huonekaluun:
   a) Ilmaise selvästi, ettet pysty vastaamaan suoraan kysymykseen.
   b) Tarjoa yleisiä huolto-ohjeita kyseiselle huonekalutyypille, jos mahdollista.
   c) Ehdota jatkokysymystä, kuten "Haluaisitko kuulla yleisiä huolto-ohjeita tälle huonekalutyypille?" tai "Voinko auttaa jonkin toisen Piiroisen huonekalun kanssa?"
3. Jos käyttäjä pyytää ottamaan yhteyttä Piiroisen huoltoon, tarjoa ensin muita vaihtoehtoja ja anna yhteystiedot vain, jos muut vaihtoehdot eivät ole sopivia.
4. Pyri aina tarjoamaan jotain hyödyllistä tietoa, vaikka se ei olisi suora vastaus kysymykseen.

Älä käytä erikoismerkkejä tai muotoiluja. Vastaa aina suomeksi.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Kysymys: {question}
Vastaus suomeksi:
`;

const answerPrompt = PromptTemplate.fromTemplate(FI_ANSWER_TEMPLATE);

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

    // let resolveWithDocuments: (value: Document[]) => void;
    const getKValue = (question: string) => {
      if (question.length < 50) return 3;
      if (question.length <= 100) return 4;
      return 5;
    };
    // Hakee dokumentit Supabase-tietokannasta.
    const retriever = vectorstore.asRetriever({
      k: getKValue(currentMessageContent),
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
