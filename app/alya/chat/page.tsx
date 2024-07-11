"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Message } from "ai";
import { Send, Mic, VolumeX, Volume2 } from "lucide-react";
import {
  deleteTempFile,
  getSpeechFromText,
  getWhisperTranscription,
} from "@/lib/ai-actions";
import { TailSpin, Rings } from "react-loader-spinner";
import clsx from "clsx";
import ChatMessage from "@/components/chat-message";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4 MB
const MESSAGE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface TTSResponse {
  audioURL: string;
  tempFilePath: string;
}

export default function Chat() {
  const [ttsEnabled, setTTSEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const loadedRef = useRef(false);
  const chatParent = useRef<HTMLUListElement>(null);

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
      if (message.role === "assistant" && ttsEnabled) {
        console.log("Assistant message received:", message.content);
        setIsPreparingAudio(true);
        try {
          const ttsResponse: TTSResponse = await getSpeechFromText(
            message.content
          );

          const audio = new Audio(ttsResponse.audioURL);
          audio.oncanplaythrough = () => {
            setIsPreparingAudio(false);
            setIsPlaying(true);
            audio.play();
          };

          audio.onended = async () => {
            await deleteTempFile(ttsResponse.tempFilePath);
            setIsPlaying(false);
          };
        } catch (error) {
          console.error("Error preparing audio:", error);
          setIsPreparingAudio(false);
        }
      }
    },
  });

  useEffect(() => {
    if (!loadedRef.current) {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setSavedMessages(parsedMessages);
        setMessages(parsedMessages);
      }
      loadedRef.current = true;
    }
  }, [setMessages]);

  // Poista vanhimpia viestejä, jos viestihistoria ylittää tallennuskoon rajan
  const trimMessages = useCallback((messages: Message[], maxSize: number) => {
    let size = JSON.stringify(messages).length;
    while (size > maxSize && messages.length > 0) {
      messages.shift();
      size = JSON.stringify(messages).length;
    }
    return messages;
  }, []);

  // Tarkista ja poista vanhentuneet viestit
  const checkAndClearExpiredMessages = useCallback((messages: Message[]) => {
    if (messages.length > 0) {
      const firstAssistantMessage = messages.find(
        (message) => message.role === "assistant"
      );
      if (firstAssistantMessage && firstAssistantMessage.createdAt) {
        const firstMessageTime = new Date(
          firstAssistantMessage.createdAt
        ).getTime();
        if (Date.now() - firstMessageTime > MESSAGE_EXPIRATION_TIME) {
          console.warn(
            "Ensimmäinen assistant-viesti on vanhentunut. Tyhjennetään koko viestihistoria."
          );
          return [];
        }
      }
    }
    return messages;
  }, []);

  // Karsi viestejä, jos ne ylittävät tallennuskoon rajan tai ovat vanhentuneita
  useEffect(() => {
    if (primaryMessages.length > 0) {
      let updatedMessages = checkAndClearExpiredMessages([...primaryMessages]);
      updatedMessages = trimMessages(updatedMessages, MAX_STORAGE_SIZE);
      try {
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      } catch (error) {
        console.error("Failed to save messages to localStorage:", error);
      }
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

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  // Lataa viestit localStorage:sta komponentin alustuksen yhteydessä
  const clearChatHistory = useCallback(() => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
    setSavedMessages([]);
  }, [setMessages]);

  const handleStartRecording = useCallback(() => {
    audioChunksRef.current = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.start();
      setRecording(true);
    }).catch((error) => {
      console.error("Error starting recording:", error);
    });
  }, []);
  

  const handleStopRecording = useCallback(async () => {
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
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        const transcriptionText = await getWhisperTranscription(formData);
        setIsProcessingAudio(false);
        if (transcriptionText) {
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
  }, [append]);
  ;

  const toggleTTS = useCallback(() => {
    setTTSEnabled((prev) => !prev);
  }, []);

  const isDisabled =
    isLoading || isPlaying || isProcessingAudio || isPreparingAudio;

    const chatMessages = useMemo(() => 
      primaryMessages.map((m) => <ChatMessage key={m.id} message={m} />),
      [primaryMessages]
    );

  return (
    <div className="flex flex-col w-full flex-grow max-h-dvh ">
      <div className="p-4 w-full max-w-3xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-md text-nowrap sm:text-2xl lg:text-3xl font-bold text-center flex-1">
            Chatbot - Älyä-avustaja
          </h1>
          <Button
            onClick={toggleTTS}
            type="button"
            className="ml-auto"
            variant={"outline"}
            disabled={isDisabled || recording}
          >
            {ttsEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl shadow-sm border rounded-b-lg">
        <ul
          ref={chatParent}
          className="h-1 p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4"
        >
          {/* {primaryMessages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))} */}
          {chatMessages}
          {(isProcessingAudio || isLoading || isPreparingAudio) && (
            <li
              className={clsx("flex", {
                "flex-row-reverse": isLoading || isPreparingAudio,
              })}
            >
              <div className="flex items-center">
                <TailSpin
                  height="28"
                  width="28"
                  color="black"
                  ariaLabel="loading"
                />
                {isPreparingAudio && (
                  <span className="ml-2 text-sm text-gray-600">
                    Valmistellaan ääntä...
                  </span>
                )}
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
            disabled={isDisabled || recording}
            onChange={handleInputChange}
          />
          <div className="flex gap-2 items-center">
            <Button
              className="ml-2"
              type="submit"
              disabled={isDisabled || recording}
              variant={"secondary"}
            >
              <Send className="h-5 w-5 mr-2" />
              Lähetä
            </Button>

            <Button
              aria-label={recording ? "Lopeta nauhoitus" : "Aloita nauhoitus"}
              type="button"
              variant={"secondary"}
              onClick={recording ? handleStopRecording : handleStartRecording}
              disabled={isDisabled && !recording}
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
        <Button
          onClick={clearChatHistory}
          className="absolute top-0 right-0 mt-2 mr-4 md:static md:mt-0 md:mr-0"
          variant={"secondary"}
        >
          Tyhjennä viestihistoria
        </Button>
      </div>
    </div>
  );
}
