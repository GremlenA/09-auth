"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
        } else if (pathname.startsWith("/profile")) {
          clearIsAuthenticated();
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return <>{children}</>;
}
