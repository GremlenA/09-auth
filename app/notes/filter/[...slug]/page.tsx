import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "../../../../getQueryClient";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesByTagClient from "./NotesByTagClient";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug?.[0] ?? "all";
  const url = `http://localhost:3000/notes/filter/${tag}`;

  return {
    title: `Tag Filter — ${tag}`,
    description: `Notes filtered by tag: ${tag}`,
    openGraph: {
      title: `Tag Filter — ${tag}`,
      description: `Notes filtered by tag: ${tag}`,
      url,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Filtered by tag: ${tag}`,
        },
      ],
    },
  };
}

export default async function NotesByTagPage({ params }: PageProps) {
  const { slug } = await params;

  const tag = slug?.[0] ?? "all";
  const queryTag = tag === "all" ? undefined : tag;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, queryTag],
    queryFn: () => fetchNotes({ page: 1, tag: queryTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesByTagClient initialTag={tag} />
    </HydrationBoundary>
  );
}
