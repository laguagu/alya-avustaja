import clsx from "clsx";
import { Message } from "ai";

type ChatMessageProps = {
  message: Message;
};

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div>
      <li
        className={clsx("flex", {
          "flex-row": message.role === "user",
          "flex-row-reverse": message.role !== "user",
        })}
      >
        <div
          className={clsx("rounded-xl p-4 bg-background shadow-md flex", {
            "w-3/4": message.role === "assistant",
          })}
        >
          <p className="text-primary">{message.content}</p>
        </div>
      </li>
    </div>
  );
}

export default ChatMessage;
