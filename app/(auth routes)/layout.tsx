"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore(
    (s) => s.clearIsAuthenticated
  );

  useEffect(() => {
    let isMounted = true;

    router.refresh();

    (async () => {
      try {
        const session = await checkSession();
        if (!isMounted) return;

        if (session) {
          const me = await getMe();
          if (!isMounted) return;

          setUser(me);
          router.push("/");
          return;
        }

        clearIsAuthenticated();
      } catch {
        clearIsAuthenticated();
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [router, setUser, clearIsAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
