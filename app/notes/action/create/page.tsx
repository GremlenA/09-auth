import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "Create Note — Notes App",
  description:
    "Create a new note by filling out the title, content and tag fields.",
  openGraph: {
    title: "Create Note — Notes App",
    description: "Create a new note using a simple and intuitive form.",
    url: "/notes/action/create",
    images: [
      {
        url: "/og/create-note.png",
        width: 1200,
        height: 630,
        alt: "Create note page preview",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>

        <NoteForm />
      </div>
    </main>
  );
}
