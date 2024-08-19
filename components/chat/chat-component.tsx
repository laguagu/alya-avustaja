"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { Message } from "ai";
import { Send, Mic, X } from "lucide-react";
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
  const { isPreparingAudio, isPlaying } = useTextToSpeech();
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
  }, [primaryMessages]);

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
    <div
      className="flex mx-auto flex-col w-full xl:max-w-[900px] border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6
    min-h-[400px] 
    sm:min-h-[500px] 
    md:min-h-[600px] 
    lg:min-h-[650px] 
    xl:min-h-[650px] 
    h-[calc(100vh-6rem)] 
    sm:h-[calc(100vh-8rem)] 
    md:h-[calc(100vh-10rem)] 
    lg:h-[calc(100vh-12rem)] 
    xl:h-[calc(100vh-15rem)]"
    >
      <div className="p-4 w-full bg-secondary border-b border-gray-200 ">
        <div className="flex items-center justify-between ">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Älyäavustaja
          </h1>
          <Button
            onClick={clearChatHistory}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4 mr-2" />
            Tyhjennä historia
          </Button>
        </div>
      </div>

      <section className="flex-grow flex flex-col overflow-hidden ">
        <div className="h-full w-full dark:bg-black bg-white dark:bg-dot-white/[0.1] bg-dot-black/[0.2] overflow-hidden">
          <ul
            ref={chatParent}
            className="h-full flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {chatMessages}
            {(isProcessingAudio || isLoading || isPreparingAudio) && (
              <li
                className={clsx("flex", {
                  "justify-end": isLoading || isPreparingAudio,
                })}
              >
                <div className="flex items-center bg-secondary/65 rounded-full px-4 py-2">
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
      </section>

      <section className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2"
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
      </section>
      <div className="p-2 bg-secondary border-t border-gray-200">
        <p className="text-center text-xs text-gray-500">
          Älyäavustaja voi tehdä virheitä. Suosittelemme tarkastamaan tärkeät
          tiedot.
        </p>
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
