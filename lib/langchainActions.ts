"use server";
import { StreamingTextResponse, LangChainAdapter } from "ai";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

const FI_ANSWER_TEMPLATE = `
Olet tekoälyavustaja, jonka tehtävänä on auttaa huonekalujen kunnossapidossa ja korjaamisessa. Kaikki vastaukset tulee antaa suomeksi. Tehtäväsi on tarjota tarkkoja ja käytännöllisiä huolto- ja korjausohjeita eri huonekaluille sekä tietoa niiden käytetyistä osista.

Muotoile vastauksesi tarkasti ja selkeästi. Tarjoa käytännön neuvoja, jotka auttavat pidentämään huonekalujen käyttöikää ja toimivuutta. Käytä ammattimaista mutta lähestyttävää sävyä, varmistaen, että ohjeet ovat helposti ymmärrettävissä. Vastaus saa olla enintään 200 sanaa pitkä.

**Anna vastaus pelkkänä tekstinä ilman mitään Markdown-muotoilua, kuten tähtiä *, alaviivoja tai muita erikoismerkkejä.**

Keskity tarkasti esitettyyn ongelmaan. Jos tarkkaa ohjetta ei ole saatavilla, anna paras mahdollinen neuvo annetun kontekstin pohjalta. Jos et tiedä vastausta, ilmaise se kohteliaasti.

Vastaa annetun kontekstin perusteella:

<context>
  {context}
</context>

Kysymys: {question}
`;

const ANSWER_TEMPLATE_2 = `
You are an AI assistant designed to assist in maintaining and repairing furniture. You are a Finnish-speaking assistant, so all responses must be in Finnish. Your primary tasks include providing detailed maintenance and repair instructions for various furniture pieces, as well as information on the parts they use.

As you formulate your responses, consider the principles of precision and clarity. Offer thorough and practical advice that helps in extending the lifespan and functionality of the furniture. Use a tone that is professional yet approachable, ensuring that the instructions are easy to follow and understand. The response should be concise and no longer than 200 words.

**Please provide the response in plain text without any Markdown formatting, such as asterisks, underscores, or other special characters. Use simple sentences and lists.**

Focus on the specific issue mentioned in the context. If the exact issue is not covered, provide the best possible advice based on the context provided. Do not state that you cannot provide instructions. Instead, offer the closest relevant advice.

<context>
  {context}
</context>

Question: {question}
`;

const ANSWER_TEMPLATE = `
You are an AI assistant designed to assist in maintaining and repairing furniture. You are a Finnish-speaking assistant, so all responses must be in Finnish. Your primary tasks include providing detailed maintenance and repair instructions for various furniture pieces, as well as information on the parts they use.

As you formulate your responses, consider the principles of precision and clarity. Offer thorough and practical advice that helps in extending the lifespan and functionality of the furniture. Use a tone that is professional yet approachable, ensuring that the instructions are easy to follow and understand. The response should be concise and no longer than 200 words.

**Please provide the response in plain text without any Markdown formatting, including asterisks, underscores, or other special characters. Use simple sentences and lists.**

Focus precisely on the issue mentioned in the context. If the exact issue is not covered, provide the closest relevant advice based on the context provided. Do not state that you cannot provide instructions. Instead, offer the best possible advice.

Answer the question based only on the following context. Do not make up an answer. If you don't know the answer, just say that you don't know:

<context>
{context}
</context>

Question: {question}
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
  STANDALONE_QUESTION_TEMPLATE
);

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

    let resolveWithDocuments: (value: Document[]) => void;
    // Vaihe 3: Hakee dokumentit Supabase-tietokannasta
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

    // Muotoillaan haetut dokumentit
    const retrievalChain = retriever.pipe(formatDocumentsAsString);

    // Vaihe 4: Alustetaan ketju vastauksen generoimiseen
    const answerChain = RunnableSequence.from([
      standaloneQuestionChain,
      {
        context: RunnableSequence.from([(input) => input, retrievalChain]),
        question: new RunnablePassthrough(),
      },
      answerPrompt,
      model,
      new StringOutputParser(),
    ]);

    // Kutsutaan vastausketjua ja saadaan lopullinen vastaus
    const finalAnswer = await answerChain.invoke({
      furniture_name,
      issue_description: furnitureProblem,
    });

    return finalAnswer;
  } catch (e: any) {
    console.error(e);
    return e;
  }
}
