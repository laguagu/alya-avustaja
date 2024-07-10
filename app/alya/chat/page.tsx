"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { Message } from "ai";
import { Send, Mic } from "lucide-react";
import {
  deleteTempFile,
  getSpeechFromText,
  getWhisperTranscription,
} from "@/lib/ai-actions";
import { TailSpin, Rings } from "react-loader-spinner";
import clsx from "clsx";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4 MB
const MESSAGE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface TTSResponse {
  audioURL: string;
  tempFilePath: string;
}

export default function Chat() {
  const [lastAssistantMessage, setLastAssistantMessage] = useState<
    string | null
  >(null);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
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
    api: `${API_URL}simple`,
    initialMessages: savedMessages,
    onError: (e) => {
      console.log(e);
    },
    onFinish: async (message) => {
      console.log("Assistant message received:", message.content);
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

  const trimMessages = useCallback((messages: Message[], maxSize: number) => {
    let size = JSON.stringify(messages).length;
    while (size > maxSize && messages.length > 0) {
      messages.shift();
      size = JSON.stringify(messages).length;
    }
    return messages;
  }, []);

  const checkAndClearExpiredMessages = useCallback((messages: Message[]) => {
    if (messages.length > 0) {
      const firstAssistantMessage = messages.find(
        (message) => message.role === "assistant"
      );
      if (firstAssistantMessage && firstAssistantMessage.createdAt) {
        const firstMessageTime = new Date(
          firstAssistantMessage.createdAt
        ).getTime();
        const now = Date.now();
        console.log("firstMessageTime", firstMessageTime);
        if (now - firstMessageTime > MESSAGE_EXPIRATION_TIME) {
          console.warn(
            "Ensimmäinen assistant-viesti on vanhentunut. Tyhjennetään koko viestihistoria."
          );
          return [];
        }
      }
    }
    return messages;
  }, []);

  // Karsi viestejä, jos ne ylittävät tallennuskoon rajan
  useEffect(() => {
    if (typeof window !== "undefined" && primaryMessages.length > 0) {
      let updatedMessages = checkAndClearExpiredMessages([...primaryMessages]);
      updatedMessages = trimMessages(updatedMessages, MAX_STORAGE_SIZE);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      if (updatedMessages.length < primaryMessages.length) {
        setMessages(updatedMessages);
        if (updatedMessages.length === 0) {
          console.warn(
            "Ensimmäinen assistant-viesti oli vanhentunut, joten koko viestihistoria tyhjennettiin."
          );
        } else {
          console.warn("Vanhimpia viestejä poistettiin tilan säästämiseksi.");
        }
      }
    }
  }, [
    primaryMessages,
    setMessages,
    trimMessages,
    checkAndClearExpiredMessages,
  ]);

  // Lataa viestit localStorage:sta komponentin alustuksen yhteydessä
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;

    const loadMessages = () => {
      if (typeof window !== "undefined") {
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          setSavedMessages(parsedMessages);
          setMessages(parsedMessages);
        }
      }
    };

    loadMessages();
    loadedRef.current = true;
  }, [setMessages]);

  const clearChatHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
      setMessages([]); // Tyhjennä myös nykyinen viestihistoria
      setSavedMessages([]);
    }
  };

  const handleStartRecording = () => {
    try {
      audioChunksRef.current = []; // Tyhjennä audioChunks uutta nauhoitusta varten

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current = null;
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
        setRecording(true);
      });
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) {
      console.error("MediaRecorder not initialized");
      return;
    }

    mediaRecorderRef.current.stop();
    setRecording(false);

    // Odota hetki, jotta kaikki audioChunks on varmasti lisätty
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      if (audioBlob.size > 25415) {
        setIsProcessingAudio(true);
        console.log("Processing audio");
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        const transcriptionText = await getWhisperTranscription(formData);
        setIsProcessingAudio(false);
        if (transcriptionText) {
          console.log("Transcription:", transcriptionText);
          append({
            role: "user",
            content: transcriptionText,
          });
        }
      } else {
        console.log("Audio too short, not processing");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    }

    // Tyhjennä audioChunks seuraavaa nauhoitusta varten
    audioChunksRef.current = [];
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
          {(isProcessingAudio || isLoading) && (
            <li className={clsx("flex", { "flex-row-reverse": isLoading })}>
              <div>
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
          <div className="flex gap-2">
            <Button className="ml-2" type="submit" disabled={isLoading}>
              <Send className="h-5 w-5 mr-2" />
              Lähetä
            </Button>

            <Button
              aria-label={recording ? "Lopeta nauhoitus" : "Aloita nauhoitus"}
              type="button"
              className=""
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
      <div className="flex flex-col items-center justify-center">
        <p className="text-center sm:text-base text-sm tracking-tight sm:mb-5">
          Älyä-avustaja voi tehdä virheitä. Suosittelemme tarkastamaan tärkeät
          tiedot.
        </p>
        <Button onClick={clearChatHistory} className="hidden md:block">
          Tyhjennä viestihistoria
        </Button>
      </div>
    </div>
  );
}
