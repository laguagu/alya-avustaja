"use server";
import { StreamingTextResponse, LangChainAdapter } from "ai";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Template kysymyksen tiivistämiseen standalone-kysymykseksi.
const STANDALONE_QUESTION_TEMPLATE = `Given the following furniture information and issue description, generate a standalone question that can be used to retrieve relevant maintenance and repair information from a database.

Furniture Name: {furniture_name}
Issue Description: {issue_description}

Standalone question:`;

const standAloneQuestionPrompt = PromptTemplate.fromTemplate(
  STANDALONE_QUESTION_TEMPLATE
);

// Vastausmalli, joka käyttää aiempaa keskusteluhistoriaa ja kontekstia vastauksen generoimiseen.
const ANSWER_TEMPLATE = `
You are an AI assistant designed to assist in maintaining and repairing furniture. You are a Finnish-speaking assistant, so all responses should be in Finnish. Your primary tasks include providing detailed maintenance and repair instructions for various furniture pieces, as well as information on the parts they use.

As you formulate your responses, consider the principles of precision and clarity. Offer thorough and practical advice that helps in extending the lifespan and functionality of the furniture. Use a tone that is professional yet approachable, ensuring that the instructions are easy to follow and understand.

**Please provide the response in plain text without any Markdown formatting, including asterisks, underscores, or other special characters. Use simple sentences and lists.**

Answer the question based only on the following context and chat history (if any). Do not make up an answer. If you don't know the answer, just say that you don't know:

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;

const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export async function generateAIinstruction(name: string): Promise<string> {
 
  try {
    // Vaiheet 1. Ota body rungon mukana tiedot huonekalusta
    // 2. Muodosta standalone-kysymys jolla haet vastauksen supabasesta perustuen furnitureInfoon
    // 3.

    // Alustaa OpenAI-mallin ja Supabase-asiakasohjelman.
    const model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.0,
      verbose: true, // Tulostaa lisätietoja, jos true
      streaming: true,
    });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!
    );

    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "piiroinen_chairs", // Tietokantataulun nimi
      queryName: "matching_documents", // Kysely funktion nimi
    });

    // Muodostaa LangChain-ketjuja tiedonhaulle ja vastausten generoinnille.
    const standaloneQuestionChain = RunnableSequence.from([
      standAloneQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const standaloneAnswer = await standaloneQuestionChain.invoke({
      furniture_name: "Arena 022",
      issue_description: "Minulla on piiroisen sininen lipasto mitä sillä pitäisi tehdä jos haluan korjata sen nyt tänään"
      })
      
    console.log("Vastaus",standaloneAnswer);
    
    return "success";
    let resolveWithDocuments: (value: Document[]) => void;
    // const documentPromise = new Promise<Document[]>((resolve) => {
    //   resolveWithDocuments = resolve;
    // });

    // Hakee dokumentit Supabase-tietokannasta.
    const retriever = vectorstore.asRetriever({
      k: 2,
      callbacks: [
        {
          handleRetrieverEnd(documents: Document<Record<string, any>>[]) {
            console.log("documents", documents); // Tulostaa kaikki haetut dokumentit
            resolveWithDocuments(documents); // Kun dokumentit on haettu, ratkaisee lupauksen dokumenteilla
          },
        },
      ],
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
        question: standaloneQuestionChain, // Saa standalone-kysymyksen ketjusta
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

    const aiStream = LangChainAdapter.toAIStream(stream);
    return new StreamingTextResponse(aiStream);
  } catch (e: any) {
    console.error(e);
    return e;
  }
}
