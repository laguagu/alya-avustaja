"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Message } from "ai";
import { Send, Mic } from "lucide-react";
import { getWhisperTranscription } from "@/lib/actions/ai-actions";
import { TailSpin, Rings } from "react-loader-spinner";
import ChatMessage from "../chat-message";
import clsx from "clsx";

interface TTSResponse {
  audioURL: string;
  tempFilePath: string;
}

export default function ChatBot({ furnitureName }: { furnitureName: string }) {
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
    api: `/api/chatbot`,
    initialMessages: savedMessages,
    body: { furnitureName },
    onError: (e: any) => {
      console.log(e);
    },
  });

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  const handleStartRecording = useCallback(() => {
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
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
      })
      .catch((error) => {
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
  const toggleTTS = useCallback(() => {
    setTTSEnabled((prev) => !prev);
  }, []);

  const isDisabled =
    isLoading || isPlaying || isProcessingAudio || isPreparingAudio;

  const chatMessages = useMemo(
    () =>
      primaryMessages.map((m: Message) => (
        <ChatMessage key={m.id} message={m} />
      )),
    [primaryMessages],
  );

  return (
    <div className="flex flex-col w-full xl:max-w-[900px] h-[calc(62vh-4rem)] md:h-full">
      <div className="p-4 w-full max-w-3xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-md text-nowrap sm:text-xl lg:text-2xl font-bold text-center flex-1">
            Chatbot - Älyäavustaja
          </h1>
          {/* <Button
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
            </Button> */}
        </div>
      </div>
      <section className="container flex flex-col flex-grow px-0 pb-10 gap-4 mx-auto w-full max-h-[calc(62vh-4rem)] h-[800px]">
        <ul
          ref={chatParent}
          className="p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4"
        >
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
          Älyäavustaja voi tehdä virheitä. Suosittelemme tarkastamaan tärkeät
          tiedot.
        </p>
      </div>
    </div>
  );
}
