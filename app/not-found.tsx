import css from "@/app/Home.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub App",
  description: "App to manage and oraganize notes efficiently",
  openGraph: {
    title: "Not found",
    description: "Not found page",
    url: "https://09-auth-liard-omega.vercel.app//not-found",
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

function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}

export default NotFound;
