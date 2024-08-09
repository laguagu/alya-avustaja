import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import { insertChatMessageAction } from "../actions/actions";

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4 MB
const MESSAGE_EXPIRATION_TIME = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

export function useChatMessages(initialSessionUserId: number | null) {
  const loadedRef = useRef(false);
  const [sessionUserId, setSessionUserId] = useState(initialSessionUserId);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
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
    api: `/api/supabase`,
    initialMessages: savedMessages,
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

  useEffect(() => {
    // Tarkista, onko komponentti ladattu aiemmin
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
        (message) => message.role === "assistant",
      );
      if (firstAssistantMessage && firstAssistantMessage.createdAt) {
        const firstMessageTime = new Date(
          firstAssistantMessage.createdAt,
        ).getTime();
        if (Date.now() - firstMessageTime > MESSAGE_EXPIRATION_TIME) {
          console.warn(
            "Ensimmäinen assistant-viesti on vanhentunut. Tyhjennetään koko viestihistoria.",
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
            "Ensimmäinen assistant-viesti oli vanhentunut, joten koko viestihistoria tyhjennettiin.",
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
  const clearChatHistory = useCallback(() => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
    setSavedMessages([]);
  }, [setMessages]);

  return {
    primaryMessages,
    append,
    clearChatHistory,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}
