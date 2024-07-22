import { getSessionAction } from "@/lib/actions";
import ChatComponent from "@/components/chat/chat-component";

export default async function Page() {
  const session = await getSessionAction();
  const sessionUserId = session ? session.userId : null;
  return <ChatComponent initialSessionUserId={sessionUserId} />;
}
