"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth as useApiAuth } from "@/lib/hooks/useAuth";

// Re-export the hook from the API layer
export function useAuth() {
  return useApiAuth();
}

// Simple provider that just wraps children
// The actual auth logic is now handled by React Query in useAuth hook
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}