import { getUser } from "@/app/_auth/dal";
import arena033HuoltoOhje from "@/data/arena-033-ohje";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
<<<<<<< HEAD
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
=======
import piiroinenHuoltoOhjeet from "@/data/piiroinen-huolto-ohjeet";
import arena022HuoltoOhjeet from "@/data/arena-022-ohjeet";
import { getUser } from "@/app/_auth/dal";

>>>>>>> 02c38e38fccb08fda62b2b65f4c2828e628a8cfa
export const dynamic = "force-dynamic";

// Before running, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/recursive_text_splitter
 * https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase
 */
// Helper function to preprocess data
function preprocessText(text: string): string {
  // Remove extra whitespace, special characters, etc.
  return text.replace(/\s+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  // const user = await getUser();

  // if (!user || user.role !== "admin") {
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });
  // }
  //   function replaceMarkdownLinks(careInstructionsText: string) {
  //     // This will replace markdown links with the format "Link Text (URL)"
  //     return careInstructionsText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
  //   }
  //   const replacedMarkdownText = replaceMarkdownLinks(careInstructionsText);

<<<<<<< HEAD
  // const text = piiroinenHuoltoOhjeet;
  const text = arena033HuoltoOhje;
=======
  const text = arena022HuoltoOhjeet;
>>>>>>> 02c38e38fccb08fda62b2b65f4c2828e628a8cfa

  try {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const splitter = new RecursiveCharacterTextSplitter({
<<<<<<< HEAD
      chunkSize: 1900,
=======
      chunkSize: 1800,
>>>>>>> 02c38e38fccb08fda62b2b65f4c2828e628a8cfa
      chunkOverlap: 0,
      separators: ["\n\n", "\n", " ", ""],
    });

    const splitDocuments = await splitter.createDocuments([text]);

    // console.log("Split documents: ", splitDocuments);
    // console.log("Number of split documents: ", splitDocuments.length);
    // return NextResponse.json({ ok: true }, { status: 200 });

    // Metadatan kanssa
    // const splitDocuments = await splitter.createDocuments(
    //   [text],
    //   [{ source: "piiroinen_care_instructions" }]
    // );
    console.log("Split documents: ", splitDocuments);
    console.log("Split documents length: ", splitDocuments.length);
    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "piiroinen_chairs",
        queryName: "matching_documents",
      },
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("Detailed Error: ", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
