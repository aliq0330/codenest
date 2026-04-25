import type { Metadata } from "next";
import { PostDetailPage } from "@/modules/post/PostDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Post" };

export default async function PostDetail({ params }: Props) {
  const { id } = await params;
  return <PostDetailPage postId={id} />;
}
