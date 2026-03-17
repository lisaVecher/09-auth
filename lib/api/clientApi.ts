import api from "./api";
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

interface AuthCredentials {
  email: string;
  password: string;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}

interface UpdateUserData {
  username: string;
}

export async function fetchNotes(params: FetchNotesParams): Promise<NotesResponse> {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      search: params.search,
      tag: params.tag,
    },
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(userData: UpdateUserData): Promise<User> {
  const { data } = await api.patch<User>("/users/me", userData);
  return data;
}