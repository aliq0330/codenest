import type { Metadata } from "next";
import { EditorPage } from "@/modules/editor/EditorPage";

export const metadata: Metadata = { title: "New Project" };

export default function NewEditor() {
  return <EditorPage />;
}
