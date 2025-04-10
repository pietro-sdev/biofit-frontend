"use client";

import { ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";  // Importa o js-cookie
import { useUserStore } from "@/store/userStore";

interface JwtPayload {
  sub: string;
  role: "ADMIN" | "ESTOQUISTA" | "CLIENTE";
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token); 
        setUser(decoded.sub, decoded.role);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, [setUser]);

  return <>{children}</>;
}
