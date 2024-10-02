"use server";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
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
  try {
    // Vaihe 1: Alustetaan OpenAI-malli ja Supabase-asiakasohjelma
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
      queryName: "match_huolto_ohjeet", // Kysely funktion nimi
    });

    // Vaihe 2: Muodostetaan standalone-kysymys
    const standaloneQuestionChain = RunnableSequence.from([
      standAloneQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    // let resolveWithDocuments: (value: Document[]) => void;
    // Vaihe 3: Hakee dokumentit Supabase-tietokannasta
    const retriever = vectorstore.asRetriever({
      k: 2,
      // callbacks: [
      //   {
      //     handleRetrieverEnd(documents: Document<Record<string, any>>[]) {
      //       console.log("documents", documents); // Tulostaa kaikki haetut dokumentit
      //       resolveWithDocuments(documents); // Kun dokumentit on haettu, ratkaisee lupauksen dokumenteilla
      //     },
      //   },
      // ],
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
