import css from "./LayoutNotes.module.css";

interface NotesFilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <main className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.content}>{children}</section>
    </main>
  );
}
