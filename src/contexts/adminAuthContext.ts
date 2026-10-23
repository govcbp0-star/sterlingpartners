import { createContext } from "react";
import type { User } from "firebase/auth";

export interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export const AdminAuthContext = createContext<AdminAuthState | null>(null);
