"use server";

import { generateObject, streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { ReactNode } from "react";
import { OpenAI } from "openai";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { nanoid } from "nanoid";
import path from "path";
import { repairRequestSchema } from "../schemas";

export interface Message {
  role: "user" | "assistant";
  content: string;
  display?: ReactNode; // [!code highlight]
}

export async function processAudioTranscription(transcription: string) {
  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o-2024-08-06"),
      system: `Olet tekoälyavustaja, joka auttaa täyttämään Piiroisen huonekalujen vikailmoituslomaketta äänitranskription perusteella. 
      Käytä annettuja kentän kuvauksia ohjenuorana täyttäessäsi lomaketta.
      Muista, että huolto-ohjeen tulee olla lyhyt ja ytimekäs, korkeintaan parin lauseen mittainen.`,
      prompt: `Analysoi seuraava äänitranskriptio ja täytä sen perusteella Piiroisen huonekalujen vikailmoituslomake:
      "${transcription}"
      
      Täytä lomake huolellisesti käyttäen annettuja kentän kuvauksia ohjeena.`,
      schema: repairRequestSchema,
    });
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
    stream.done();
  })();

  return { object: stream.value };
}

export async function getWhisperTranscription(
  formData: FormData,
): Promise<string> {
  "use server";

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    throw new Error("OpenAI API key is not configured");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const file = formData.get("file") as File;
  if (!file) {
    console.error("No file found in formData");
    throw new Error("No file found in the request");
  }

  try {
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "fi",
      prompt:
        "Tämä on suomenkielinen äänitys. Kirjoita teksti suomeksi käyttäen oikeaa kielioppia ja välimerkkejä.",
      response_format: "json",
    });

    return response.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio");
  }
}

export async function getSpeechFromText(text: string) {
  "use server";
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.audio.speech.create({
    input: text,
    voice: "shimmer", // Valitse haluamasi ääni
    model: "tts-1-hd",
  });

  // Save the audio file to a temporary location
  const tempDir = path.join(process.cwd(), "public", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  const uniqueId = nanoid();
  const tempFilePath = path.join(tempDir, `tts_output_${uniqueId}.mp3`);

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(tempFilePath, new Uint8Array(buffer));

  // Return the path to the audio file
  const audioURL = `/temp/tts_output_${uniqueId}.mp3`;
  return { audioURL, tempFilePath };
}

export async function deleteTempFile(filePath: string) {
  try {
    await fsPromises.access(filePath);
    await fsPromises.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    console.log(`File ${filePath} does not exist or cannot be accessed`);
  }
}
