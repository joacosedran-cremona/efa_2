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
  clientIP: string | null;
  targetAddress: string | null;
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
  clientIP: null,
  targetAddress: null,
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
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("token");
    }

    return null;
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user_data");

      return storedUser ? JSON.parse(storedUser) : null;
    }

    return null;
  });
  const [clientIP, setClientIP] = useState<string | null>(null);
  const [targetAddress, setTargetAddress] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const websocketData = useWebSocketContext();

  useEffect(() => {
    const determineTargetFromURL = () => {
      if (typeof window !== "undefined") {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const hostname = url.hostname;

        let target = null;

        if (hostname === "192.168.10.115") {
          target = "192.168.10.115:8000";
          setClientIP("192.168.10.115");
        } else if (hostname === "192.168.20.41") {
          target = "192.168.20.41:8000";
          setClientIP("192.168.20.41");
        } else if (hostname.startsWith("192.168.")) {
          const parts = hostname.split(".");

          if (parts.length === 4) {
            const segmento = parts[2];

            target = `192.168.20.46:8000`;
            //target = `192.168.${segmento}.115:8000`;
            setClientIP(hostname);
          }
        } else {
          setClientIP(hostname);
        }

        if (target) {
          setTargetAddress(target);
          localStorage.setItem("targetAddress", target);
          localStorage.setItem("clientIP", hostname);
        } else {
          localStorage.removeItem("targetAddress");
          localStorage.removeItem("clientIP");
        }
      }
    };

    determineTargetFromURL();
  }, []);

  useEffect(() => {
    const publicRoutes = ["/login", "/login/recuperacion"];
    const acceso = sessionStorage.getItem("acceso");

    if (!publicRoutes.includes(pathname || "") && !acceso) {
      router.push("/login");
    }
  }, [pathname, router]);

  const login = async (username: string, password: string): Promise<void> => {
    if (!targetAddress) {
      throw new Error("Target address not available");
    }
    const formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post<LoginResponse>(
      `http://${targetAddress}/usuario/login`,
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
    clientIP,
    targetAddress,
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
