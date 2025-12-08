import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  // ⭐ Load user from storage on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await SecureStore.getItemAsync("user");
        if (stored) {
          const parsed: User = JSON.parse(stored);
          setUser(parsed);
        }
      } catch (err) {
        console.warn("Could not restore session:", err);
      }
    };

    loadUser();
  }, []);

  function login(u: User) {
    SecureStore.setItemAsync("user", JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    SecureStore.deleteItemAsync("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
