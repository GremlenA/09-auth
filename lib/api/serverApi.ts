import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const serverApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

async function withCookies() {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

/* ========= NOTES ========= */

export async function fetchNotes(params?: {
  page?: number;
  search?: string;
  tag?: string;
}) {
  const cookieConfig = await withCookies();

  const { data } = await serverApi.get("/notes", {
    params: {
      ...params,
      perPage: 12,
    },
    ...cookieConfig,
  });

  return data;
}

export async function fetchNoteById(id: string) {
  const cookieConfig = await withCookies();

  const { data } = await serverApi.get<Note>(`/notes/${id}`, cookieConfig);
  return data;
}

/* ========= AUTH ========= */

export async function checkSession(): Promise<User | null> {
  try {
    const cookieConfig = await withCookies();
    const { data } = await serverApi.get<User | null>("/auth/session", cookieConfig);
    return data;
  } catch {
    return null;
  }
}
