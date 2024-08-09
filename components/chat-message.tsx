import clsx from "clsx";
import { Message } from "ai";
import React from "react";

type ChatMessageProps = {
  message: Message;
};

// Funktio, joka käsittelee lihavoinnit ja numeroidut listat
const formatMessage = (content: string) => {
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

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <li
      className={clsx("flex", {
        "justify-end": !isUser,
      })}
    >
      <div
        className={clsx(
          "rounded-xl p-4 bg-background shadow-md",
          "max-w-[75%] break-words", // Lisätty maksimileveys ja sanojen rivitys
          {
            "ml-auto": !isUser, // Siirtää viestin oikealle, jos ei ole käyttäjä
          },
        )}
      >
        <p className="text-primary">{formatMessage(message.content)}</p>
      </div>
    </li>
  );
}

export default ChatMessage;
