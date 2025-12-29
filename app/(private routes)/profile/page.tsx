import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { checkSession } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

/* ---------- METADATA ---------- */
export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page",
};

/* ---------- PAGE ---------- */
export default async function ProfilePage() {
  const response = await checkSession();
  const user = response.data;

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className={css.profile}>
      <div className={css.card}>
        <Image
          src={user.avatar}
          alt={user.username}
          width={120}
          height={120}
          className={css.avatar}
        />

        <h1 className={css.username}>{user.username}</h1>
        <p className={css.email}>{user.email}</p>

        <Link href="/profile/edit" className={css.editLink}>
          Edit profile
        </Link>
      </div>
    </main>
  );
}
