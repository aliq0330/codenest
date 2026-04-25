import type { Metadata } from "next";
import { FeaturedPage } from "@/modules/featured/FeaturedPage";

export const metadata: Metadata = { title: "Featured" };

export default function Featured() {
  return <FeaturedPage />;
}
