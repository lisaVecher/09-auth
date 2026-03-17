// lib/api/serverApi.ts

import api from "./api";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages?: number;
  page?: number;
  perPage?: number;
  total?: number;
}

function buildCookieHeader(
  accessToken?: string,
  refreshToken?: string,
): string | undefined {
  const cookieParts: string[] = [];

  if (accessToken) {
    cookieParts.push(`accessToken=${accessToken}`);
  }

  if (refreshToken) {
    cookieParts.push(`refreshToken=${refreshToken}`);
  }

  return cookieParts.length ? cookieParts.join("; ") : undefined;
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<NotesResponse> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = buildCookieHeader(accessToken, refreshToken);

  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      search: params.search,
      tag: params.tag,
    },
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = buildCookieHeader(accessToken, refreshToken);

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return data;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = buildCookieHeader(accessToken, refreshToken);

  const { data } = await api.get<User>("/users/me", {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return data;
}

export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = buildCookieHeader(accessToken, refreshToken);

  const response = await api.get<User | null>("/auth/session", {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return response;
}