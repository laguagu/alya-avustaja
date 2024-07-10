"use server";

import { generateObject, streamObject, streamText, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { createStreamableValue, createStreamableUI } from "ai/rsc";
import { ReactNode } from "react";
import { DefaultValues } from "../app/form/page";
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
  console.log("getWhisperTranscription called with file: ", file.name, );
  if (!file) {
    console.error("No file found in formData");
    return "No file found";
  }
  // Luodaan väliaikainen tiedosto
  const tempDir = path.join(process.cwd(), "public", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  const uniqueId = nanoid();
  const tempFilePath = path.join(tempDir, `Temp_${uniqueId}.webm`);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(tempFilePath, buffer);

  // Lähetä tiedosto Whisper API:lle
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tempFilePath),
    model: "whisper-1",
  });

  // Poistetaan väliaikainen tiedosto
  fs.unlinkSync(tempFilePath);
  
  return response.text;
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

export async function continueConversation(history: Message[]) {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      system:
        "You are a dude that doesn't drop character until the DVD commentary.",
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
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
