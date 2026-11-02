import { create } from "zustand";
import { loadJSON, removeKey, saveJSON, STORAGE_KEYS } from "@/lib/storage";
import { api, apiEnabled, setToken } from "@/services/api";
import { useData } from "@/stores/useData";

/**
 * Authenticates against the Spring Boot backend (JWT). A backend
 * (VITE_API_URL) is required — there is no demo/offline login.
 */
interface AuthSession {
  email: string;
  loggedInAt: string;
}

interface AuthState {
  session: AuthSession | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  session: loadJSON<AuthSession | null>(STORAGE_KEYS.auth, null),

  login: async (username, password) => {
    if (!apiEnabled) {
      return { ok: false, error: "Login is unavailable: backend is not configured." };
    }
    try {
      const res = await api.login(username.trim(), password);
      setToken(res.token);
      const session: AuthSession = { email: res.email, loggedInAt: new Date().toISOString() };
      saveJSON(STORAGE_KEYS.auth, session);
      set({ session });
      // Pull admin-only data (e.g. inquiries) now that we have a token.
      void useData.getState().hydrateFromApi();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Login failed." };
    }
  },

  logout: () => {
    setToken(null);
    removeKey(STORAGE_KEYS.auth);
    set({ session: null });
  },
}));
