// Tämä koodi käyttää LangChaini uutta LangChain Expression Language (LCEL) raknnetta https://js.langchain.com/docs/expression_language/
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { LangChainAdapter, Message as VercelChatMessage } from "ai";
import { formatDocumentsAsString } from "langchain/util/document";
import { NextRequest, NextResponse } from "next/server";
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
2. Huomioi käyttäjän aiemmat kysymykset ja antamasi vastaukset välttääksesi toistoa.
3. Älä mainitse tai viittaa tiettyyn tuolimalliin (kuten Arena 022), ellei käyttäjä ole sitä erikseen maininnut.
4. Aloita vastaus tilanteeseen sopivalla tavalla. Vaihtele aloitustapojasi, esimerkiksi:
   a) Esitä tarkentava kysymys: "Tarkistetaanpa ensin, onko kyseessä [tietty ongelma]?"
   b) Tarjoa välitön toimintaehdotus: "Aloitetaan tarkistamalla [ensimmäinen askel]."
   c) Anna lyhyt yleiskatsaus: "Huonekalun [osa] huollossa on muutama tärkeä vaihe."
5. Vastaa kysymykseen selkeästi ja ytimekkäästi. Käytä yksinkertaisia lauseita ja tarvittaessa listoja.
6. Tarjoa konkreettisia ohjeita seuraavasti:
   a) Anna 3-4 täsmällistä askelta tai vinkkiä kysyttyyn huoltotoimenpiteeseen.
   b) Mainitse tarvittavat työkalut tai materiaalit.
   c) Korosta erityisiä varotoimenpiteitä tai huomioitavia asioita.
7. Jos et löydä tarkkaa vastausta annetusta kontekstista:
   a) Ilmaise se rehellisesti, mutta tarjoa silti hyödyllisiä yleisiä ohjeita.
   b) Ehdota luovia ratkaisuja perustuen yleisiin huonekalujen huolto-ohjeisiin.
   c) Suosittele lisätiedon lähteitä (esim. Piiroisen verkkosivut tai asiakaspalvelu).
8. Käytä ammattimaista, mutta ystävällistä kieltä. Vältä liian teknistä jargonia.
9. Sisällytä vastaukseen käytännön esimerkkejä tai vertauksia helpottamaan ymmärtämistä.
10. Päätä vastauksesi vaihtoehtoisilla tavoilla:
    a) Kysy, tarvitseeko käyttäjä lisätietoja jostakin tietystä vaiheesta.
    b) Rohkaise kokeilemaan annettuja ohjeita ja pyydä palautetta tuloksista.
    c) Ehdota seuraavaa askelta tai ennakoi mahdollisia jatkokysymyksiä.

Muista: Jokaisen vastauksen tulee olla yksilöllinen ja tilanteeseen räätälöity. Vältä geneerisiä vastauksia ja keskity käyttäjän spesifiseen ongelmaan.

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
      modelName: "gpt-4.1-2025-04-14",
      temperature: 0.3,
      // verbose: true, // Tulostaa lisätietoja, jos true
      streaming: true,
    });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const vectorstore = new SupabaseVectorStore(
      new OpenAIEmbeddings({ model: "text-embedding-3-small" }),
      {
        client,
        tableName: "piiroinen_chairs",
        queryName: "match_huolto_ohjeet",
      },
    );

    // Muodostaa LangChain-ketjuja tiedonhaulle ja vastausten generoinnille.
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);
    /*
    Määrää k:n arvon dokumenttien haulle kysymyksen pituuden perusteella.
    TODO: Tietokannassa on aika vähän dataa, joten k arvon voi nostaa vaikka 10:een.
    */
    const getKValue = (question: string) => {
      if (question.length < 50) return 3;
      if (question.length <= 100) return 4;
      return 5;
    };
    // Hakee dokumentit Supabase-tietokannasta.
    // let resolveWithDocuments: (value: {
    // documents: Document[];
    //   topScore: number;
    // }) => void;
    const retriever = vectorstore.asRetriever({
      k: getKValue(currentMessageContent),
      // callbacks: [ // Käytä, jos haluat lisätä lisätoimintoja haun jälkeen esim. tulostuksen haetuista dokumenteista
      //   {
      //     handleRetrieverEnd(documents: Document<Record<string, any>>[]) {
      //       console.log("Retrieved documents:", documents);
      //       const topScore = Math.max(
      //         ...documents.map((doc) => doc.metadata.similarity || 0),
      //       );
      //       console.log("Top similarity score:", topScore);
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
