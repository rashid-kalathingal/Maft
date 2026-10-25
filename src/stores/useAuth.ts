import { create } from "zustand";
import { loadJSON, removeKey, saveJSON, STORAGE_KEYS } from "@/lib/storage";

/**
 * DEMO authentication only. localStorage is NOT real security — replace this
 * with a real server-side auth flow before any production use.
 */
const DEMO_EMAIL = "admin@maftmarketing.com";
const DEMO_PASSWORD = "Admin@123";

interface AuthSession {
  email: string;
  loggedInAt: string;
}

interface AuthState {
  session: AuthSession | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  session: loadJSON<AuthSession | null>(STORAGE_KEYS.auth, null),

  login: (email, password) => {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return { ok: false, error: "Invalid email or password." };
    }
    const session: AuthSession = { email: DEMO_EMAIL, loggedInAt: new Date().toISOString() };
    saveJSON(STORAGE_KEYS.auth, session);
    set({ session });
    return { ok: true };
  },

  logout: () => {
    removeKey(STORAGE_KEYS.auth);
    set({ session: null });
  },
}));

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
