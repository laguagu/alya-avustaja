import { getSessionAction } from "@/lib/actions";
import ChatComponent from "@/components/chat/chat-component";
import { Suspense } from "react";

export default async function Page() {
  const session = await getSessionAction();
  const sessionUserId = session ? session.userId : null;
  return (
    <Suspense fallback={<div>Chatbot sivua ladataan...</div>}>
      <ChatComponent initialSessionUserId={sessionUserId} />
    </Suspense>
  );
}
