import type { Metadata } from "next";
import { FeedPage } from "@/modules/feed/FeedPage";

export const metadata: Metadata = { title: "Home Feed" };

export default function Feed() {
  return <FeedPage />;
}
