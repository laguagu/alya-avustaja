"use client";
import { Message } from "ai";
import clsx from "clsx";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

type ChatMessageProps = {
  message: Message;
  onFeedback?: (isPositive: string) => void;
  showFeedback?: boolean;
};

// Funktio, joka käsittelee lihavoinnit ja numeroidut listat
export const formatMessage = (content: string) => {
  const lines = content.split("\n");

  return lines.map((line, lineIndex) => {
    // Käsittele lihavoinnit
    const boldParts = line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`bold-${lineIndex}-${partIndex}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    // Tarkista, onko rivi numeroitu lista-alkio
    const listMatch = line.match(/^(\d+)\.\s(.+)/);
    if (listMatch) {
      const [, number, text] = listMatch;
      const formattedText = text
        .split(/(\*\*.*?\*\*)/g)
        .map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={`bold-${lineIndex}-${partIndex}`}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

      return (
        <div key={`list-item-${lineIndex}`} className="flex items-start mb-2">
          <span className="mr-2 font-bold">{number}.</span>
          <span>{formattedText}</span>
        </div>
      );
    } else if (line.trim().startsWith("-")) {
      // Käsittele alaluettelot
      const listItemText = line
        .trim()
        .substring(1)
        .trim()
        .split(/(\*\*.*?\*\*)/g)
        .map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={`bold-${lineIndex}-${partIndex}`}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

      return (
        <div
          key={`sublist-item-${lineIndex}`}
          className="ml-6 flex items-start mb-2"
        >
          <span className="mr-2">•</span>
          <span>{listItemText}</span>
        </div>
      );
    } else {
      return (
        <p key={`line-${lineIndex}`} className="mb-2">
          {boldParts}
        </p>
      );
    }
  });
};

function ChatMessage({
  message,
  onFeedback,
  showFeedback = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (isPositive: boolean) => {
    if (onFeedback && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onFeedback(isPositive.toString());
        setFeedbackGiven(isPositive);
      } catch (error) {
        console.error("Error submitting feedback:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // formatMessage-funktio pysyy samana

  return (
    <li
      className={clsx("flex", {
        "justify-end": !isUser,
      })}
    >
      {isUser ? (
        <div
          className={clsx(
            "rounded-xl p-4 bg-background shadow-md",
            "max-w-[75%] break-words",
          )}
        >
          <div className="text-primary">{formatMessage(message.content)}</div>
        </div>
      ) : (
        <div className="flex flex-col items-end">
          <div
            className={clsx(
              "rounded-xl p-4 bg-background shadow-md",
              "max-w-[75%] break-words",
            )}
          >
            <div className="text-primary">{formatMessage(message.content)}</div>
          </div>
          {showFeedback && feedbackGiven === null && (
            <div className="mt-2 flex space-x-2">
              <Button
                onClick={() => handleFeedback(true)}
                variant="outline"
                size="sm"
                disabled={isSubmitting}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Hyvä vastaus
              </Button>
              <Button
                onClick={() => handleFeedback(false)}
                variant="outline"
                size="sm"
                disabled={isSubmitting}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Huono vastaus
              </Button>
            </div>
          )}
          {feedbackGiven !== null && (
            <div className="mt-2 text-sm text-gray-500">
              {feedbackGiven
                ? "Kiitos positiivisesta palautteesta!"
                : "Kiitos palautteesta. Pahoittelemme, että vastaus ei ollut hyödyllinen."}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default ChatMessage;
