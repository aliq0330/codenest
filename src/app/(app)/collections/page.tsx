import type { Metadata } from "next";
import { CollectionsPage } from "@/modules/collections/CollectionsPage";

export const metadata: Metadata = { title: "Collections" };

export default function Collections() {
  return <CollectionsPage />;
}
