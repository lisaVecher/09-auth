import css from "./SearchBox.module.css";
import type { ChangeEvent } from "react";

interface SearchBoxProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={onChange}
    />
  );
}
