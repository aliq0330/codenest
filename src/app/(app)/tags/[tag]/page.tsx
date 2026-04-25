import type { Metadata } from "next";
import { TagPage } from "@/modules/explore/TagPage";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}` };
}

export default async function Tag({ params }: Props) {
  const { tag } = await params;
  return <TagPage tag={tag} />;
}
