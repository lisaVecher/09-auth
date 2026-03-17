import { Note } from "@/types/note";
import Link from "next/link";

type Props = {
  item: Note;
};

export default function NoteItem({ item }: Props) {
  return (
    <li>
      <p>{item.title}</p>
      <Link href={`/notes/${item.id}`}>View details</Link>
    </li>
  );
}
