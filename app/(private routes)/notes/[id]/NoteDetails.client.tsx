"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !data) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>{data.title}</h1>
        <span className={css.tag}>{data.tag}</span>
      </div>

      <p className={css.content}>{data.content}</p>

    <p className={css.date}>
  {data.createdAt
    ? new Date(data.createdAt).toLocaleDateString()
    : "No date"}
</p>
    </div>
  );
}
