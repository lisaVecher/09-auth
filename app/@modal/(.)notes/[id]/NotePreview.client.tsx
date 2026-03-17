"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  function handleClose() {
    router.back();
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {isLoading && <p>Loading, please wait...</p>}

        {isError && <p>Something went wrong.</p>}

        {data && (
          <>
            <div className={css.header}>
              <h2 className={css.title}>{data.title}</h2>
              <span className={css.tag}>{data.tag}</span>
            </div>

            <p className={css.content}>{data.content}</p>

            <p className={css.date}>
              {new Date(data.createdAt).toLocaleDateString()}
            </p>

            <button className={css.button} onClick={handleClose}>
              Close
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
