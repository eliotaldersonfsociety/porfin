"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

interface SessionContextType {
  session: User | null;
  setUserSession: (user: User, token: string) => void;
  clearUserSession: () => void;
  sessionLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const setUserSession = (user: User, token: string) => {
    setSession(user);
    localStorage.setItem("userToken", token);
    setSessionLoading(false);
  };

  const clearUserSession = () => {
    setSession(null);
    localStorage.removeItem("userToken");
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setUserSession,
        clearUserSession,
        sessionLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
