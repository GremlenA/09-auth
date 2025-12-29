"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

type Props = {
  id?: string;
};

export default function NoteDetailsClient({ id }: Props) {
  const params = useParams<{ id: string }>();

  const noteId = id ?? params.id;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading note</p>;
  if (!note) return null;

  return (
    <article>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <span>{note.tag}</span>
    </article>
  );
}
