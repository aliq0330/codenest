import type { Metadata } from "next";
import { EditorPage } from "@/modules/editor/EditorPage";

export const metadata: Metadata = { title: "Editor" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditorWithId({ params }: Props) {
  const { id } = await params;
  return <EditorPage projectId={id} />;
}
