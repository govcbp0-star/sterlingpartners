import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { User } from "firebase/auth";
import { AdminAuthContext } from "./adminAuthContext";
import { adminUid } from "../lib/firebase";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");
  const [authState, setAuthState] = useState<{ user: User | null; ready: boolean }>({
    user: null,
    ready: false,
  });

  useEffect(() => {
    if (!isAdminRoute) return;

    let active = true;
    let unsubscribe: (() => void) | undefined;

    void import("../lib/firebaseAuth").then(({ auth }) => {
      if (!active) return;
      if (!auth) {
        setAuthState({ user: null, ready: true });
        return;
      }

      return import("firebase/auth").then(({ onAuthStateChanged }) => {
        if (!active) return;
        unsubscribe = onAuthStateChanged(
          auth,
          (user) => setAuthState({ user, ready: true }),
          () => setAuthState({ user: null, ready: true }),
        );
      });
    }).catch(() => {
      if (active) setAuthState({ user: null, ready: true });
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [isAdminRoute]);

  const value = useMemo(
    () => ({
      user: authState.user,
      isAdmin: Boolean(authState.user && adminUid && authState.user.uid === adminUid),
      loading: isAdminRoute && !authState.ready,
    }),
    [authState, isAdminRoute],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
