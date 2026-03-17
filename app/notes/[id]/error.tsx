"use client";

type Props = {
  error: Error & { digest?: string };
};

export default function NoteDetailsError({ error }: Props) {
  return <p>Could not fetch note details. {error.message}</p>;
}
