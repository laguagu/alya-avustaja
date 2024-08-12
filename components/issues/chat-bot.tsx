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
  const { isPreparingAudio, isPlaying } = useTextToSpeech();
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
    const result = await handleStopRecording();
    console.log("Recording result:", result);
    if (result && result.transcriptionText) {
      append({
        role: "user",
        content: result.transcriptionText,
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
    <div className="flex flex-col w-full xl:max-w-[900px] min-h-[400px] h-[80vh] lg:h-[calc(100vh-15rem)] border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
      <div className="p-4 w-full max-w-3xl mx-auto border-b border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Älyäavustaja
        </h1>
      </div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <ul
          ref={chatParent}
          className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {chatMessages}
          {(isProcessingAudio || isLoading || isPreparingAudio) && (
            <li
              className={clsx("flex", {
                "justify-end": isLoading || isPreparingAudio,
              })}
            >
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <TailSpin
                  height="24"
                  width="24"
                  color="#6B7280"
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
      </div>

      <div className="border-t border-gray-200">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center p-4 space-y-2 sm:space-y-0 sm:space-x-2"
        >
          <Input
            className="flex-grow min-h-[48px] rounded-md px-4 border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
            placeholder="Kirjoita kysymyksesi tänne..."
            type="text"
            value={input}
            disabled={isDisabled || recording}
            onChange={handleInputChange}
          />
          <div className="flex gap-2 items-center">
            <Button
              type="submit"
              disabled={isDisabled || recording}
              variant="default"
              className="rounded-md px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white"
            >
              <Send className="h-5 w-5 mr-2" />
              Lähetä
            </Button>
            <Button
              aria-label={recording ? "Lopeta nauhoitus" : "Aloita nauhoitus"}
              type="button"
              variant="outline"
              className="rounded-md px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={recording ? handleAudioSubmit : handleStartRecording}
              disabled={isDisabled && !recording}
            >
              {recording ? (
                <Rings color="#6B7280" height={24} width={24} />
              ) : (
                <Mic className="h-5 w-5 mr-2" />
              )}
              {recording ? "Lopeta" : "Nauhoita"}
            </Button>
          </div>
        </form>
      </div>
      <div className="p-2 bg-gray-50">
        <p className="text-center text-xs text-gray-500">
          Älyäavustaja voi tehdä virheitä. Suosittelemme tarkastamaan tärkeät
          tiedot.
        </p>
      </div>
    </div>
  );
}
