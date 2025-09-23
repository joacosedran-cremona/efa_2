"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

import { WebSocketProvider, useWebSocketContext } from "./WebSocketContext";

interface User {
  access_token: string;
  token_type: string;
  role: string;
}

interface LoginResponse {
  role: string;
  access_token: string;
  token_type: string;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  equipoSeleccionado: string | null;
  setEquipoSeleccionado: (equipo: string | null) => void;
  websocketData: {
    data: any | null;
    isConnected: boolean;
    error: Error | null;
    reconnect: () => void;
  };
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextType>({
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

export const useApp = () => useContext(AppContext);

const AppProviderInner = ({ children }: { children: ReactNode }) => {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(
    "Default",
  );
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const websocketData = useWebSocketContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user_data");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    const publicRoutes = ["/login", "/login/recuperacion"];
    const acceso = sessionStorage.getItem("acceso");

    if (!publicRoutes.includes(pathname || "") && !acceso) {
      router.push("/login");
    }
  }, [pathname, router]);

  const login = async (username: string, password: string): Promise<void> => {
    const formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post<LoginResponse>(
      `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/usuario/login`,
      formData,
    );

    const { role, access_token, token_type } = response.data;

    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    sessionStorage.setItem(
      "user_data",
      JSON.stringify({ access_token, token_type, role }),
    );

    sessionStorage.setItem("token", access_token);

    setUser({ access_token, token_type, role });
    setToken(access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    delete axios.defaults.headers.common["Authorization"];

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_data");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("acceso");

    router.push("/login");
  };

  const contextValue: AppContextType = {
    user,
    token,
    login,
    logout,
    equipoSeleccionado,
    setEquipoSeleccionado,
    websocketData,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <WebSocketProvider pollId="datos">
      <AppProviderInner>{children}</AppProviderInner>
    </WebSocketProvider>
  );
};

export default AppContext;
