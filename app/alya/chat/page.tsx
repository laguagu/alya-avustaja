import ChatComponent from "@/components/chat/chat-component";
import { Suspense } from "react";
import { verifySession } from "@/app/_auth/sessions";

export default async function Page() {
  const session = await verifySession();
  const sessionUserId = session ? session.userId : null;
  return (
    <Suspense fallback={<div>Chatbot sivua ladataan...</div>}>
      <ChatComponent initialSessionUserId={sessionUserId} />
    </Suspense>
  );
}
