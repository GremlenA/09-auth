"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const PRIVATE_PREFIXES = ["/notes", "/profile"];

function isPrivateRoute(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);

      try {

        const session = await checkSession();

        if (!session) {
         
          clearIsAuthenticated();

          if (isPrivateRoute(pathname)) {
            try {
              await logout(); 
            } catch {
              
            }
            if (!cancelled) router.replace("/sign-in");
          }
          return;
        }

       
        const me = await getMe();
        setUser(me);
      } catch {
        clearIsAuthenticated();

        if (isPrivateRoute(pathname)) {
          try {
            await logout();
          } catch {
          
          }
          if (!cancelled) router.replace("/sign-in");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return <p>Loading...</p>;


  if (isPrivateRoute(pathname) && !useAuthStore.getState().isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
