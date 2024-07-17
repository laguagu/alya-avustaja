"use server";

import { generateObject,  } from "ai";
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

export async function getNotifications(input: string): Promise<{
  notifications: { name: string; message: string; minutesAgo: number }[];
}> {
  "use server";
  console.log("getNotifications called");

  const { object: notifications } = await generateObject({
    model: openai("gpt-4-turbo"),
    system: "You generate one notifications for a messages app.",
    prompt: input,
    schema: z.object({
      notifications: z.array(
        z.object({
          name: z.string().describe("Name of a fictional person."),
          message: z.string().describe("Do not use emojis or links."),
          minutesAgo: z.number(),
        })
      ),
    }),
  });
  console.log(notifications);
  return notifications;
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
