"use server";

import { generateObject, streamObject  } from "ai";
import { createStreamableValue } from 'ai/rsc';
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { ReactNode } from "react";
import { OpenAI } from "openai";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { nanoid } from "nanoid";
import path from "path";

export interface Message {
  role: "user" | "assistant";
  content: string;
  display?: ReactNode; // [!code highlight]
}

export async function processAudioTranscription(transcription: string) {
  const stream = createStreamableValue();
  
  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-4-turbo'),
      system: 'You are an AI assistant helping to fill out a maintenance request form based on an audio transcription.',
      prompt: `Based on the following transcription, generate appropriate values for a maintenance request form: "${transcription}"`,
      schema: z.object({
        priority: z.enum(["Ei kiireellinen", "Huomioitava", "Kiireellinen"]),
        type: z.enum([
          "Puuttuu liukunasta (t)",
          "Kiristysruuvi löysällä",
          "Kiristysruuvi puuttuu",
          "Runko heiluu",
          "Selkänoja heiluu",
          "Istuin heiluu",
          "Materiaali vioittunut",
          "Ilkivalta",
          "Vaatii puhdistuksen",
          "Muu vika"
        ]),
        problem_description: z.string(),
        instruction: z.string(),
        missing_equipments: z.string(),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
    stream.done();
  })();

  return { object: stream.value };
}

export async function getWhisperTranscription(formData: FormData) {
  "use server";
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const file = formData.get("file") as File;
  if (!file) {
    console.error("No file found in formData");
    return "No file found";
  }

  try {
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "fi",
      prompt: "Tämä on suomenkielinen äänitys. Kirjoita teksti suomeksi käyttäen oikeaa kielioppia ja välimerkkejä.",
      response_format: "json",
    });

    return response.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return "Error transcribing audio";
  }
}

export async function getSpeechFromText(text: string) {
  "use server";
  console.log("getSpeechFromText called with text: ", text);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("getTextToSpeech called with text: ", text);

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
  fs.writeFileSync(tempFilePath, buffer);

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
