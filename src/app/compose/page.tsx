import type { Metadata } from "next";
import { ComposePage } from "@/modules/post-composer/ComposePage";

export const metadata: Metadata = { title: "New Post" };

export default function Compose() {
  return <ComposePage />;
}
