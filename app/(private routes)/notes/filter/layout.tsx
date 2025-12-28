import type { ReactNode } from "react";
import css from "./LayoutNotes.module.css";

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function NotesFilterLayout({ children, sidebar }: Props) {
  return (
    <section className={css.notesWrapper}>
      <aside>{sidebar}</aside>
      <div>{children}</div>
    </section>
  );
}
