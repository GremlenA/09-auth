import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "../../../../components/getQueryClient";
import { getNoteById} from "@/lib/api/serverApi";

import NotePreviewClient from "./NotePreview.client";

interface ModalParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function ModalNotePage({ params }: ModalParams) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
