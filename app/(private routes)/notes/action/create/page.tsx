import type { Metadata } from "next";
import CreateNote from "./CreateNote";

export const metadata: Metadata = {
  title: "NoteHub Create Note Page",
  description: "Page to create note",
  openGraph: {
    title: "NoteHub Create Note Page",
    description: "Page to create note",
    url: "/home",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub App",
      },
    ],
  },
};

function CreateNotePage() {
  return <CreateNote />;
}

export default CreateNotePage;
