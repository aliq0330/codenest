import type { Metadata } from "next";
import { SearchPage } from "@/modules/search/SearchPage";

export const metadata: Metadata = { title: "Search" };

export default function Search() {
  return <SearchPage />;
}
