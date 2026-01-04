import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";



async function withCookies() {
  const cookieStore = await cookies();

  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}



export interface FetchNotesParams {
  page?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>(
    "/notes",
    {
      params: {
        ...params,
        perPage: 12,
      },
      ...(await withCookies()),
    }
  );

  return response.data;
}

export async function getNotes(params?: {
  page?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>(
    "/notes",
    {
      params: {
        ...params,
        perPage: 12,
      },
      ...(await withCookies()),
    }
  );

  return response.data;
}

export async function getNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(
    `/notes/${id}`,
    await withCookies()
  );

  return response.data;
}

export async function createNote(data: {
  title: string;
  content: string;
  tag?: string;
}): Promise<Note> {
  const response = await api.post<Note>(
    "/notes",
    data,
    await withCookies()
  );

  return response.data;
}



export async function checkSession(): Promise<
  AxiosResponse<User | null>
> {
  return api.get<User | null>(
    "/auth/session",
    await withCookies()
  );
}


export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>(
    "/users/me",
    await withCookies()
  );

  return response.data;
}
