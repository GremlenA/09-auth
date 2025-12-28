import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "../../../getQueryClient";
import { fetchNoteById } from "@/lib/api/serverApi";
import NotePreviewClient from "../../@modal/(.)notes/[id]/NotePreview.client";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;

  
  const note = await fetchNoteById(id);

  const title = `Note — ${note.title}`;
  const description = note.content.slice(0, 100);
  const url = `http://localhost:3000/notes/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "NoteHub",
      type: "article",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { id } = await  params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
