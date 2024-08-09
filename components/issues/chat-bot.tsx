"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { Message } from "ai";
import { Send, Mic } from "lucide-react";
import { TailSpin, Rings } from "react-loader-spinner";
import ChatMessage from "../chat-message";
import clsx from "clsx";
import { insertChatMessageAction } from "@/lib/actions/actions";
import { useTextToSpeech } from "@/lib/hooks/useTextToSpeech";
import { useAudioRecording } from "@/lib/hooks/useAudioRecording";

interface ChatBotProps {
  furnitureName: string;
  sessionUserId: number | null;
}

export default function ChatBot({
  furnitureName,
  sessionUserId,
}: ChatBotProps) {
  const chatParent = useRef<HTMLUListElement>(null);
  const {
    isPreparingAudio,
    isPlaying,
  } = useTextToSpeech();
  const {
    recording,
    isProcessingAudio,
    handleStartRecording,
    handleStopRecording,
  } = useAudioRecording();
  const {
    messages: primaryMessages,
    input,
    append,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: `/api/chatbot`,
    body: { furnitureName },
    onError: (e: any) => {
      console.log(e);
    },
    onFinish: async (message: { role: string; content: string }) => {
      if (sessionUserId) {
        try {
          const combinedContent = [
            { role: "user", message: input },
            { role: message.role, message: message.content },
          ];
          await insertChatMessageAction({
            userId: sessionUserId,
            role: message.role,
            content: combinedContent,
            createdAt: new Date(),
          });
        } catch (error) {
          console.error("Error saving message to database:", error);
        }
      } else {
        console.error("User not authenticated");
      }
    },
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

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

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
      </div>
    </div>
  );
}
