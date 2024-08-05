"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Message } from "ai";
import { Send, Mic } from "lucide-react";
import { getWhisperTranscription } from "@/lib/actions/ai-actions";
import { TailSpin, Rings } from "react-loader-spinner";
import clsx from "clsx";
import ChatMessage from "@/components/chat-message";
import { useChatMessages } from "@/lib/hooks/UseChatMessages";
import { useTextToSpeech } from "@/lib/hooks/useTextToSpeech";
import { useAudioRecording } from "@/lib/hooks/useAudioRecording";

interface TTSResponse {
  audioURL: string;
  tempFilePath: string;
}

export default function ChatComponent({
  initialSessionUserId,
}: {
  initialSessionUserId: number | null;
}) {
  const {
    primaryMessages,
    append,
    clearChatHistory,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChatMessages(initialSessionUserId);
  const {
    ttsEnabled,
    isPreparingAudio,
    isPlaying,
    toggleTTS,
    playTextToSpeech,
  } = useTextToSpeech();
  const {
    recording,
    isProcessingAudio,
    handleStartRecording,
    handleStopRecording,
  } = useAudioRecording();

  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  const handleAudioSubmit = useCallback(async () => {
    const transcriptionText = await handleStopRecording();
    if (transcriptionText) {
      append({
        role: "user",
        content: transcriptionText,
      });
    }
  }, [handleStopRecording, append]);

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
    <div className="flex flex-col w-full flex-grow max-h-dvh ">
      <div className="p-4 w-full max-w-3xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-md text-nowrap sm:text-2xl lg:text-3xl font-bold text-center flex-1">
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
              onClick={recording ? handleAudioSubmit : handleStartRecording}
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

// Text to speech -ominaisuuksien käsittely
// onFinish: async (message: { role: string; content: string; }) => {
//   if (message.role === "assistant" && ttsEnabled) {
//     console.log("Assistant message received:", message.content);
//     setIsPreparingAudio(true);
//     try {
//       const ttsResponse: TTSResponse = await getSpeechFromText(
//         message.content
//       );

//       const audio = new Audio(ttsResponse.audioURL);
//       audio.oncanplaythrough = () => {
//         setIsPreparingAudio(false);
//         setIsPlaying(true);
//         audio.play();
//       };

//       audio.onended = async () => {
//         await deleteTempFile(ttsResponse.tempFilePath);
//         setIsPlaying(false);
//       };
//     } catch (error) {
//       console.error("Error preparing audio:", error);
//       setIsPreparingAudio(false);
//     }
//   }
// },
