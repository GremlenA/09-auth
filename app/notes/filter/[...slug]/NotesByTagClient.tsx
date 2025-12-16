"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import { fetchNotes } from "../../../../lib/api";
import type { FetchNotesResponse } from "../../../../lib/api";
import css from "./NotesPage.module.css";

interface Props {
  initialTag: string;
}

export default function NotesByTagClient({ initialTag }: Props) {
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ▸ Тег берем из пропсов, он фиксирован для этой страницы.
  const tag = initialTag === "all" ? undefined : initialTag;

  const queryKey = ["notes", page, tag] as const;

  const { data, isLoading, isError, isFetching } = useQuery<
    FetchNotesResponse,
    Error,
    FetchNotesResponse,
    readonly [string, number, string | undefined]
  >({
    queryKey,
    queryFn: () => fetchNotes({ page, tag }),
    placeholderData: keepPreviousData,
    staleTime: 2000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading && !isFetching) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <h2 className={css.title}>
          {initialTag === "all" ? "All notes" : `Tag: ${initialTag}`}
        </h2>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 ? (
        <NoteList
          notes={notes}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
        />
      ) : (
        !isFetching && <p className={css.empty}>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
