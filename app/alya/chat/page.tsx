"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import { Message } from "ai";
import { nanoid } from "nanoid";
import { Send, Mic } from "lucide-react";
import { getWhisperTranscription } from "@/app/actions";
import { TailSpin, Rings } from "react-loader-spinner";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import piiroinenHuoltoOhjeet from "@/data/piiroinen-huolto-ohjeet";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL", API_URL);
interface TTSResponse {
  audioURL: string;
  tempFilePath: string;
}

export default function Chat() {
  const [lastAssistantMessage, setLastAssistantMessage] = useState<
    string | null
  >(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const {
    messages: primaryMessages,
    input,
    append,
    setMessages,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
    stop,
  } = useChat({
    api: `${API_URL}example2`,
    onError: (e) => {
      console.log(e);
    },
    // onFinish: async (message) => {
    //   if (message.role === "assistant") {
    //     console.log("Assistant message received:", message.content);
    //     setLastAssistantMessage(message.content);
    //     const ttsResponse: TTSResponse = await getSpeechFromText(
    //       message.content
    //     );

    //     const audio = new Audio(ttsResponse.audioURL);
    //     audio.oncanplaythrough = () => {
    //       console.log("Playing audio");
    //       audio.play();
    //     };

    //     audio.onended = async () => {
    //       console.log("Deleting temporary audio file");
    //       await deleteTempFile(ttsResponse.tempFilePath);
    //     };
    //   }
    // },
  });

  async function sendMessageToAPI(messages: Message[], API_URL: string) {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send message", response);
      return null;
    }

    const responseText = await response.text();
    const uniqueId = nanoid();
    // const gptAnswer = responseText;

    if (responseText !== null) {
      setMessages([
        ...messages,
        {
          id: uniqueId,
          role: "assistant",
          content: responseText,
        },
      ]);
    }
    return responseText;
  }

  const handleAudioData = (data: BlobPart) => {
    const audioBlob = new Blob([data], { type: "audio/webm" });
    const audioURL = URL.createObjectURL(audioBlob);
    return { audioBlob, audioURL };
  };

  const addUserMessage = (messages: Message[], id: string, content: string) => {
    return messages.concat({
      id,
      content,
      role: "user",
    });
  };

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      const uniqueId = nanoid();

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const { audioBlob, audioURL } = handleAudioData(event.data);

          if (audioBlob.size > 25415) {
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.webm");
            const transcriptionText = await getWhisperTranscription(formData);

            append({
              role: "user",
              content: transcriptionText,
            });

            setLastAssistantMessage(null); // Reset last assistant message
          }
        }
      };
      mediaRecorder.start();
      setRecording(true);
    });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent sending empty messages or multiple messages while loading
    const uniqueId = nanoid();

    let messagesWithUserReply: Message[] = addUserMessage(
      primaryMessages,
      uniqueId,
      input
    );

    setMessages(messagesWithUserReply);
    setInput("");

    await sendMessageToAPI(
      messagesWithUserReply,
      "http://localhost:3000/api/example2"
    );
  };

  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  return (
    <div className="flex flex-col w-full flex-grow max-h-dvh">
      <div className="p-4 border-b w-full max-w-3xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-center pl-4 md:pl-0">
          Chatbot - Älyä-avustaja
        </h1>
      </div>

      <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl">
        <ul
          ref={chatParent}
          className="h-1 p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4"
        >
          {primaryMessages.map((m, index) => (
            <div key={index}>
              {m.role === "user" ? (
                <li key={m.id} className="flex flex-row">
                  <div className="rounded-xl p-4 bg-background shadow-md flex">
                    <p className="text-primary">{m.content}</p>
                  </div>
                </li>
              ) : (
                <li key={m.id} className="flex flex-row-reverse">
                  <div className="rounded-xl p-4 bg-background shadow-md flex w-3/4">
                    <p className="text-primary">{m.content}</p>
                  </div>
                </li>
              )}
            </div>
          ))}
          {isLoading && (
            <li className="flex flex-row-reverse">
              <div className="">
                <TailSpin
                  height="28"
                  width="28"
                  color="black"
                  ariaLabel="loading"
                />
              </div>
            </li>
          )}
        </ul>
      </section>

      <section className="p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col sm:flex-row max-w-3xl mx-auto items-center space-y-2 sm:space-y-0"
        >
          <Input
            className="flex-1 min-h-[40px]"
            placeholder="Kirjoita kysymyksesi tänne..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <div className="flex ">
            <Button className="ml-2" type="submit" disabled={isLoading}>
              <Send className="h-5 w-5 mr-2" />
              Lähetä
            </Button>

            <Button
              className="ml-2"
              onClick={recording ? handleStopRecording : handleStartRecording}
              disabled={isLoading}
            >
              {recording ? (
                <Rings color="white" height={100} width={20} />
              ) : (
                <Mic className="h-5 w-5 mr-2" />
              )}
              {recording ? "Lopeta Nauhoitus" : "Aloita Nauhoitus"}
            </Button>
          </div>
        </form>
      </section>
      <div>
        <p className="text-center sm:text-base text-sm tracking-tight sm:mb-5">
          Älyä-avustaja voi tehdä virheitä. Suosittelemme tarkastamaan tärkeät
          tiedot.
        </p>
      </div>
    </div>
  );
}

async function testSplitter() {
  const text = piiroinenHuoltoOhjeet;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1600,
    chunkOverlap: 0,
  });

  const output = await splitter.createDocuments([text]);
  console.log(output);
}
