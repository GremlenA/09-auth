import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/components/getQueryClient";
import { fetchNotes } from "@/lib/api/clientApi";
import NotesClient from "../../../../(private routes)/notes/filter/[...slug]/Notes.client";
import type { Metadata } from "next";

type PageProps = {
  params: { slug?: string[] };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const tag = params.slug?.[0] ?? "all";

  return {
    title: `Tag Filter — ${tag}`,
    description: `Notes filtered by tag: ${tag}`,
  };
}

export default async function NotesByTagPage({ params }: PageProps) {
  const tag = params.slug?.[0] ?? "all";
  const queryTag = tag === "all" ? undefined : tag;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, queryTag],
    queryFn: () => fetchNotes({ page: 1, tag: queryTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
