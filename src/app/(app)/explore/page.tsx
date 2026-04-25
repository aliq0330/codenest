import type { Metadata } from "next";
import { ExplorePage } from "@/modules/explore/ExplorePage";

export const metadata: Metadata = { title: "Explore" };

export default function Explore() {
  return <ExplorePage />;
}
