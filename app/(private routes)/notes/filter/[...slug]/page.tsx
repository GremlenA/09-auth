import Notes from "./Notes.client";
import { fetchServerNotes } from "@/lib/api/serverApi";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

interface NotesByTagPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesByTagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0];

  return {
    title: `NoteTag:${tag}`,
    description: `${tag}`,
    openGraph: {
      title: `NoteTag:${tag}`,
      description: `${tag}`,
      url: `https://09-auth-liard-omega.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: tag,
        },
      ],
    },
  };
}

async function NotesByTagPage({ params }: NotesByTagPageProps) {
  const { slug } = await params;
  const tag = slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, tag],
    queryFn: () => fetchServerNotes(1, tag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}

export default NotesByTagPage;
