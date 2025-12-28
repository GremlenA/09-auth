import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const serverApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

function withCookies() {
  const cookieStore = cookies();
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
  const { data } = await serverApi.get("/notes", {
    params: {
      ...params,
      perPage: 12,
    },
    ...withCookies(),
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await serverApi.get<Note>(
    `/notes/${id}`,
    withCookies()
  );
  return data;
}

/* ========= AUTH ========= */

export async function checkSession(): Promise<User | null> {
  try {
    const { data } = await serverApi.get<User | null>(
      "/auth/session",
      withCookies()
    );
    return data;
  } catch {
    return null;
  }
}
