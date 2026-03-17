import css from "./not-found.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | NoteHub",
  description:
    "The page you are trying to access does not exist in the NoteHub application.",
  openGraph: {
    title: "404 - Page Not Found | NoteHub",
    description:
      "The page you are trying to access does not exist in the NoteHub application.",
    url: "https://08-zustand-jade-nu.vercel.app/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub preview",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </main>
  );
}
