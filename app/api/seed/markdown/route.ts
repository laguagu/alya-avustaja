import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "comprehensive-piiroinen-huolto-ohjeet.md",
    );
    const markdownContent = await fs.readFile(filePath, "utf8");

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocuments = await splitter.createDocuments(
      [markdownContent],
      [
        {
          source: "piiroinen_huolto_ohjeet",
          title: "Piiroisen Huonekalujen Huolto-Ohjeet",
        },
      ],
    );

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "piiroinen_huolto_ohjeet",
        queryName: "match_huolto_ohjeet",
      },
    );

    return NextResponse.json(
      { ok: true, chunkCount: splitDocuments.length },
      { status: 200 },
    );
  } catch (e: any) {
    console.error("Detailed Error: ", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
