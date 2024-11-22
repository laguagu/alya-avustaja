import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

function preprocessMarkdown(text: string): string {
  return text
    .replace(/\n{3,}/g, "\n\n") // Korvaa kolme tai useampi peräkkäinen rivinvaihto kahdella
    .replace(/^#\s/gm, "# ") // Varmista, että otsikoiden ja tekstin välissä on yksi välilyönti
    .replace(/^(#+)\s*(.+)$/gm, (_, hashes, title) => `${hashes} ${title}\n`) // Lisää tyhjä rivi otsikon jälkeen
    .trim();
}
function combineShortChunks(chunks: string[], minLength: number): string[] {
  const result: string[] = [];
  let currentChunk = "";

  for (const chunk of chunks) {
    if (currentChunk.length + chunk.length < minLength) {
      // Yhdistä chunkit, jos pituus ei ylitä minimipituutta
      console.log("Yhdistetään chunkit: ", currentChunk, chunk);
      currentChunk += (currentChunk ? "\n" : "") + chunk;
    } else {
      if (currentChunk) {
        result.push(currentChunk);
      }
      currentChunk = chunk;
    }
  }

  if (currentChunk) {
    result.push(currentChunk);
  }

  return result;
}

export async function POST(req: NextRequest) {
  // Samanlainen kuin seed/route.ts, mutta käytetään markdown-tiedostoa ja splitataan pienempiin osiin. Poista aikainen return NextResponse.json({ ok: true }, { status: 200 });
  // ja lisää autentikointi ennen kuin käytät tätä tuotannossa.
  return NextResponse.json({ ok: true }, { status: 200 });
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "comprehensive-piiroinen-huolto-ohjeet.md",
    );
    const markdownContent = await fs.readFile(filePath, "utf8");

    const preprocessedContent = preprocessMarkdown(markdownContent);

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 1500,
      chunkOverlap: 200,
      separators: ["\n# ", "\n## ", "\n### ", "\n#### ", "\n", " ", ""],
    });

    let splitChunks = await splitter.splitText(preprocessedContent);
    console.log("Chunk count: ", splitChunks.length);
    // Yhdistä lyhyet chunkit
    splitChunks = combineShortChunks(splitChunks, 500);
    console.log("Yhdistetty chunk count: ", splitChunks.length);
    const splitDocuments = splitChunks.map((chunk) => ({
      pageContent: chunk,
      metadata: {
        source: "piiroinen_huolto_ohjeet",
        title: "Piiroisen Huonekalujen Huolto-Ohjeet",
      },
    }));

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
