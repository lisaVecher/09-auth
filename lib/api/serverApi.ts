import axios from "axios";
import { baseURL } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
  cookie?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages?: number;
  page?: number;
  perPage?: number;
  total?: number;
}

interface ServerRequestOptions {
  cookie?: string;
}

export async function fetchNotes(params: FetchNotesParams): Promise<NotesResponse> {
  const { page = 1, perPage = 12, search, tag, cookie } = params;

  const { data } = await axios.get<NotesResponse>(`${baseURL}/notes`, {
    params: {
      page,
      perPage,
      search,
      tag,
    },
    headers: cookie ? { Cookie: cookie } : undefined,
    withCredentials: true,
  });

  return data;
}

export async function fetchNoteById(
  id: string,
  options?: ServerRequestOptions,
): Promise<Note> {
  const { data } = await axios.get<Note>(`${baseURL}/notes/${id}`, {
    headers: options?.cookie ? { Cookie: options.cookie } : undefined,
    withCredentials: true,
  });

  return data;
}

export async function getMe(options?: ServerRequestOptions): Promise<User> {
  const { data } = await axios.get<User>(`${baseURL}/users/me`, {
    headers: options?.cookie ? { Cookie: options.cookie } : undefined,
    withCredentials: true,
  });

  return data;
}

export async function checkSession(options?: ServerRequestOptions): Promise<User | null> {
  const { data } = await axios.get<User | null>(`${baseURL}/auth/session`, {
    headers: options?.cookie ? { Cookie: options.cookie } : undefined,
    withCredentials: true,
  });

  return data;
}