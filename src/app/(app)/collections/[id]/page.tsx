import type { Metadata } from "next";
import { CollectionDetailPage } from "@/modules/collections/CollectionDetailPage";

export const metadata: Metadata = { title: "Collection" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetail({ params }: Props) {
  const { id } = await params;
  return <CollectionDetailPage collectionId={id} />;
}
