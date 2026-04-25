import type { Metadata } from "next";
import { ArticleDetailPage } from "@/modules/articles/ArticleDetailPage";

export const metadata: Metadata = { title: "Article" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetail({ params }: Props) {
  const { id } = await params;
  return <ArticleDetailPage articleId={id} />;
}
