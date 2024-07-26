import clsx from "clsx";
import { Message } from "ai";

type ChatMessageProps = {
  message: Message;
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
        <p className="text-primary">{message.content}</p>
      </div>
    </li>
  );
}

export default ChatMessage;
