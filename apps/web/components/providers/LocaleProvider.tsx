"use client";
import { useEffect } from "react";
import { useLocaleStore } from "@/store/locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate locale from localStorage only on the client after mount.
    // This prevents SSR/client hydration mismatches while still persisting
    // the user's language preference across sessions.
    useLocaleStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
