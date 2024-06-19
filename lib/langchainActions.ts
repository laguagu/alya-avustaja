"use server";
import { StreamingTextResponse, LangChainAdapter } from "ai";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { RunnableSequence, RunnablePassthrough  } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
// Template kysymyksen tiivistämiseen standalone-kysymykseksi.
const STANDALONE_QUESTION_TEMPLATE = `Given the following furniture information and issue description, rephrase the follow up question to be a standalone question, in its original language, that can be used to retrieve relevant maintenance and repair information from a database.
----------
Furniture Name: {furniture_name}
----------
Issue Description: {issue_description}
----------
Standalone question:`;

const standAloneQuestionPrompt = PromptTemplate.fromTemplate(
  STANDALONE_QUESTION_TEMPLATE
);

// Vastausmalli, joka käyttää kontekstia vastauksen generoimiseen.
const ANSWER_TEMPLATE = `
You are an AI assistant designed to assist in maintaining and repairing furniture. You are a Finnish-speaking assistant, so all responses should be in Finnish. Your primary tasks include providing detailed maintenance and repair instructions for various furniture pieces, as well as information on the parts they use.

As you formulate your responses, consider the principles of precision and clarity. Offer thorough and practical advice that helps in extending the lifespan and functionality of the furniture. Use a tone that is professional yet approachable, ensuring that the instructions are easy to follow and understand.

**Please provide the response in plain text without any Markdown formatting, including asterisks, underscores, or other special characters. Use simple sentences and lists.**

Answer the question based only on the following context. Do not make up an answer. If you don't know the answer, just say that you don't know:

<context>
  {context}
</context>

Question: {question}
`;

const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

interface GenerateInstructionParams {
  furniture_name: string;
  furnitureProblem: string;
}

export async function generateAIinstruction({
  furniture_name,
  furnitureProblem,
}: GenerateInstructionParams): Promise<string> {
  try {
     // Vaihe 1: Alustetaan OpenAI-malli ja Supabase-asiakasohjelma
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

    // Vaihe 2: Muodostetaan standalone-kysymys
    const standaloneQuestionChain = RunnableSequence.from([
      standAloneQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    // Kutsutaan standalone-kysymyksen ketjua ja saadaan standalone-kysymys
    const standaloneQuestion  = await standaloneQuestionChain.invoke({
      furniture_name,
      issue_description: furnitureProblem,
    });
    
    // Vaihe 3: Hakee dokumentit Supabase-tietokannasta
    const retriever = vectorstore.asRetriever({
      k: 2,
    });

    // Muotoillaan haetut dokumentit
    const retrievedDocs = await retriever.invoke(standaloneQuestion);
    const formattedDocs = formatDocumentsAsString(retrievedDocs);

    const retrievalChain = retriever.pipe(formatDocumentsAsString);

    // Vaihe 4: Alustetaan ketju vastauksen generoimiseen
    const answerChain = RunnableSequence.from([
      new RunnablePassthrough(),
      {
        context: async () => formattedDocs,
        question: async (input: any) => input,
      },
      answerPrompt,
      model,
    ]);

    // Kutsutaan vastausketjua ja saadaan lopullinen vastaus
    const finalAnswer = await answerChain.invoke({
      context: formattedDocs,
      question: standaloneQuestion,
    });
    
    console.log("Final Answer: ", finalAnswer);
    return "success";

    // Suorittaa ketjun, joka tuottaa vastauksen käyttäjän kysymykseen.
    // const conversationalRetrievalQAChain = RunnableSequence.from([
    //   {
    //     question: standaloneQuestionChain, // Saa standalone-kysymyksen ketjusta
    //     chat_history: (input) => input.chat_history, // Saa keskusteluhistorian syötteenä
    //   },
    //   answerChain,
    //   // new BytesOutputParser(), // Striimaa vastauksen
    //   // new StringOutputParser(), // Ei striimaukseen sendMessage kanssa frontendissa
    // ]);

    // Lähettää vastauksen streamattuna takaisin klientille.
    // const stream = await conversationalRetrievalQAChain.stream({
    //   furniture_name: furniture_name,
    //   issue_description: furnitureProblem,
    // });

    const aiStream = LangChainAdapter.toAIStream(stream);
  } catch (e: any) {
    console.error(e);
    return e;
  }
}
