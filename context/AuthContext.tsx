"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

import { WebSocketResponse } from "../interfaces/websocket";

import { WebSocketProvider, useWebSocketContext } from "./WebSocketContext";

interface LoginResponse {
  role: string;
  access_token: string;
  token_type: string;
}

interface User {
  access_token: string;
  token_type: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  equipoSeleccionado: string | null;
  setEquipoSeleccionado: (equipo: string | null) => void;
  websocketData: {
    data: WebSocketResponse | null;
    isConnected: boolean;
    error: Error | null;
    reconnect: () => void;
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  equipoSeleccionado: null,
  setEquipoSeleccionado: () => {},
  websocketData: {
    data: null,
    isConnected: false,
    error: null,
    reconnect: () => {},
  },
});

export const useAuth = () => useContext(AuthContext);

const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(
    "Default",
  );
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  const websocketData = useWebSocketContext();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user_data");

      return storedUser ? JSON.parse(storedUser) : null;
    }

    return null;
  });

  useEffect(() => {
    const publicRoutes = ["/login", "/", "/login/recuperacion"];
    const acceso = sessionStorage.getItem("acceso");

    if (!publicRoutes.includes(pathname || "") && !acceso) {
      router.push("/login");
    }

    if (publicRoutes.includes(pathname || "") && acceso) {
      router.push("/");
    }
  }, [pathname, router]);

  useEffect(() => {
    if (pathname !== "/desmoldeo/equipos") {
      setEquipoSeleccionado("Default");
    }
  }, [pathname]);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post<LoginResponse>(
      `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/usuario/login`,
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const { role, access_token, token_type } = response.data;

    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    sessionStorage.setItem(
      "user_data",
      JSON.stringify({ access_token, token_type, role }),
    );
    Cookies.set("token", access_token, { secure: false, sameSite: "lax" });

    setUser({ access_token, token_type, role });
  };

  const logout = () => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_data");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("acceso");
    Cookies.remove("token");

    router.push("/login");
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    equipoSeleccionado,
    setEquipoSeleccionado,
    websocketData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <WebSocketProvider pollId="datos">
      <AuthProviderInner>{children}</AuthProviderInner>
    </WebSocketProvider>
  );
};

export default AuthContext;
