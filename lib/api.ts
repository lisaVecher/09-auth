import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: NoteTag;
}

const START_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const noteHubApi = axios.create({
  baseURL: START_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number,
  search = "",
  tag?: NoteTag,
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (search) {
    params.search = search;
  }
  if (tag) {
    params.tag = tag;
  }

  const response = await noteHubApi.get<FetchNotesResponse>("/notes", {
    params,
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await noteHubApi.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (newNote: CreateNoteProps): Promise<Note> => {
  const response = await noteHubApi.post<Note>("/notes", newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await noteHubApi.delete<Note>(`/notes/${id}`);
  return response.data;
};
