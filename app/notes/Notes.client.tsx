"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../lib/api";
import type { FetchNotesResponse } from "../../lib/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import css from "./NotesPage.module.css";

const Pagination = dynamic(
  () => import("../../components/Pagination/Pagination"),
  { ssr: false }
);

type NotesClientProps = {
  tag: string;
};

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [debouncedSearch] = useDebounce(search, 500);

  
  const normalizedTag = tag === "all" ? undefined : tag;

  const queryKey = ["notes", page, debouncedSearch, normalizedTag] as const;

  const { data, isLoading, isError, isFetching } = useQuery<
    FetchNotesResponse,
    Error,
    FetchNotesResponse,
    readonly [string, number, string, string?]
  >({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        tag: normalizedTag,
      }),
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
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage: number) => setPage(nextPage)}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 ? (
        <NoteList
          notes={notes}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
        />
      ) : (
        !isFetching && <p className={css.empty}>Not found</p>
      )}
    </div>
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }
}
