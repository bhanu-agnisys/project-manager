import { create } from 'zustand';
import { getBackendApiUrl } from '../lib/api';
import type { AuthSession, AuthUser } from '../types/auth';

const AUTH_TOKEN_KEY = 'project-manager-auth-token';

type AuthStatus = 'bootstrapping' | 'guest' | 'authenticated' | 'submitting';

type AuthStore = {
  status: AuthStatus;
  token: string | null;
  user: AuthUser | null;
  error: string | null;
  hydrateSession: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

function persistSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, session.token);
}

function clearSession() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function requestAuth<T>(path: string, init: RequestInit = {}) {
  const baseUrl = await getBackendApiUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data as T;
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'bootstrapping',
  token: null,
  user: null,
  error: null,
  hydrateSession: async () => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      set({ status: 'guest', token: null, user: null, error: null });
      return;
    }

    try {
      const data = await requestAuth<{ user: AuthUser }>('/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      set({ status: 'authenticated', token, user: data.user, error: null });
    } catch (error) {
      clearSession();
      set({
        status: 'guest',
        token: null,
        user: null,
        error: error instanceof Error ? error.message : 'Unable to restore session'
      });
    }
  },
  login: async ({ email, password }) => {
    set({ status: 'submitting', error: null });

    try {
      const session = await requestAuth<AuthSession>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      persistSession(session);
      set({
        status: 'authenticated',
        token: session.token,
        user: session.user,
        error: null
      });
    } catch (error) {
      clearSession();
      set({
        status: 'guest',
        token: null,
        user: null,
        error: error instanceof Error ? error.message : 'Unable to log in'
      });
    }
  },
  signup: async ({ fullName, email, password }) => {
    set({ status: 'submitting', error: null });

    try {
      const session = await requestAuth<AuthSession>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password })
      });

      persistSession(session);
      set({
        status: 'authenticated',
        token: session.token,
        user: session.user,
        error: null
      });
    } catch (error) {
      clearSession();
      set({
        status: 'guest',
        token: null,
        user: null,
        error: error instanceof Error ? error.message : 'Unable to sign up'
      });
    }
  },
  logout: () => {
    clearSession();
    set({ status: 'guest', token: null, user: null, error: null });
  }
}));
