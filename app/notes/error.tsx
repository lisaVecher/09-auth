"use client";

type Props = {
  error: Error & { digest?: string };
};

export default function NotesError({ error }: Props) {
  return <p>Could not fetch the list of notes. {error.message}</p>;
}
