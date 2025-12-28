import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { checkSession } from "@/lib/api/serverApi";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default async function PrivateLayout({
  children,
}: PrivateLayoutProps) {
  const user = await checkSession();

  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
