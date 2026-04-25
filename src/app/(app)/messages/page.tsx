import type { Metadata } from "next";
import { MessagesPage } from "@/modules/messages/MessagesPage";

export const metadata: Metadata = { title: "Messages" };

export default function Messages() {
  return <MessagesPage />;
}
