import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";



function withCookies() {
  const cookieStore = cookies();

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
  const response = await api.get("/notes", {
    params: {
      ...params,
      perPage: 12,
    },
    ...withCookies(),
  });

  return response.data;
}

export async function fetchNoteById(
  id: string
): Promise<Note> {
  const response = await api.get<Note>(
    `/notes/${id}`,
    withCookies()
  );

  return response.data;
}



export async function checkSession(): Promise<
  AxiosResponse<User | null>
> {
  return api.get<User | null>(
    "/auth/session",
    withCookies()
  );
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await api.get<User>(
    "/users/me",
    withCookies()
  );

  return response.data;
}