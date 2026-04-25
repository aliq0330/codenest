import type { Metadata } from "next";
import { ConversationPage } from "@/modules/messages/ConversationPage";

export const metadata: Metadata = { title: "Messages" };

interface Props {
  params: Promise<{ conversationId: string }>;
}

export default async function Conversation({ params }: Props) {
  const { conversationId } = await params;
  return <ConversationPage conversationId={conversationId} />;
}
