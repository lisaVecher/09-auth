"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const privatePaths = ["/profile", "/notes"];
const authPaths = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return privatePaths.some((path) => pathname.startsWith(path));
}

function isAuthPath(pathname: string) {
  return authPaths.some((path) => pathname.startsWith(path));
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);

          if (isAuthPath(pathname)) {
            router.replace("/profile");
            return;
          }
        } else {
          clearIsAuthenticated();

          if (isPrivatePath(pathname)) {
            router.replace("/sign-in");
            return;
          }
        }
      } catch {
        clearIsAuthenticated();

        if (isPrivatePath(pathname)) {
          router.replace("/sign-in");
          return;
        }
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}