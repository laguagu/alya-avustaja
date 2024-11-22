/**
 * Database Seed Route
 *
 * This API route is responsible for seeding the vector database with maintenance
 * documentation for Piiroinen chairs. It processes the input documentation by:
 * 1. Taking the raw text from piiroinen-huolto-ohjeet
 * 2. Splitting it into smaller, manageable chunks
 * 3. Creating embeddings for each chunk
 * 4. Storing these embeddings in Supabase's vector store
 *
 * Prerequisites:
 * - Supabase setup with pgvector extension
 * - OpenAI API key for creating embeddings
 * - Environment variables:
 *   - SUPABASE_URL
 *   - SUPABASE_PRIVATE_KEY
 *   - OPENAI_API_KEY
 *
 * Security Note:
 * This route should be protected in production to prevent unauthorized database seeding.
 * Currently returns early with 200 status for safety.
 *
 * Vector Store Schema:
 * - Table: piiroinen_chairs
 * - Query: matching_documents
 */

import piiroinenHuoltoOhjeet from "@/data/piiroinen-huolto-ohjeet";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
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
  // TODO: Tarkista että käyttäjä on esim admin ennen kuin suoritat tämän koodin tuotannossa. Siksi lisätty aikainen Return NextResponse.json({ ok: true }, { status: 200 });
  return NextResponse.json({ ok: true }, { status: 200 });
  const text = piiroinenHuoltoOhjeet;

  try {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1900,
      chunkOverlap: 0,
      separators: ["\n\n", "\n", " ", ""],
    });

    const splitDocuments = await splitter.createDocuments([text]);
    console.log("Split documents: ", splitDocuments);
    console.log("Split documents length: ", splitDocuments.length);
    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings({ model: "text-embedding-3-small" }),
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
