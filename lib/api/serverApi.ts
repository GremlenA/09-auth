import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";

const serverApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

/**
 * ⚠️ ВАЖНО:
 * cookies() — async
 */
async function withCookies() {
  const cookieStore = await cookies();

  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

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
    ...(await withCookies()),
  });

  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await serverApi.get<Note>(
    `/notes/${id}`,
    await withCookies()
  );

  return data;
}
