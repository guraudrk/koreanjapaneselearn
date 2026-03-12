import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSettings {
  learningMode: "KR" | "JP" | "BOTH";
  notifications: boolean;
}

interface User {
  id: string;
  email: string;
  nativeLanguage: string;
  settings: UserSettings | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  setLearningMode: (mode: "KR" | "JP" | "BOTH") => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
      },

      // Used by the axios interceptor after a silent token refresh
      updateTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      setLearningMode: (mode) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                settings: { ...(state.user.settings ?? { notifications: true }), learningMode: mode },
              }
            : null,
        }));
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        // Clear persist storage explicitly so stale data can't be rehydrated
        if (typeof window !== "undefined") {
          localStorage.removeItem("lingua-auth");
        }
      },

      isAuthenticated: () => !!get().accessToken,
    }),
    { name: "lingua-auth" }
  )
);
