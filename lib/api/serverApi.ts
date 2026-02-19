// fetchNotes
// fetchNoteById
// getMe
// checkSession.
import type { Note } from "@/types/note";
import { instance } from "./api";
import { cookies } from "next/headers";
import { User } from "@/types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

async function fetchServerNotes(
  currentPage: number,
  searchQuery: string,
  tag?: string,
): Promise<FetchNotesResponse> {
  const params: {
    page: number;
    perPage: number;
    search?: string;
    tag?: string | undefined;
  } = {
    page: currentPage,
    perPage: 12,
  };

  if (searchQuery.trim() !== "") {
    params.search = searchQuery;
  }

  if (tag && tag !== "all") {
    params.tag = tag;
  }
  const cookieStore = await cookies();

  const { data } = await instance.get<FetchNotesResponse>(`/notes`, {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

async function fetchServerNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const { data } = await instance.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

async function getServerMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await instance.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

async function checkServerSession() {
  const cookieStore = await cookies();
  const res = await instance.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return res;
}

export {
  fetchServerNotes,
  fetchServerNoteById,
  getServerMe,
  checkServerSession,
};
