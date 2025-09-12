"use client";
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { usePathname } from "next/navigation";

import { WebSocketResponse } from "../interfaces/websocket";

import { WebSocketProvider, useWebSocketContext } from "./WebSocketContext";

interface AuthContextType {
  equipoSeleccionado: string;
  setEquipoSeleccionado: (equipo: string) => void;
  streamInitialized: boolean;
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
  equipoSeleccionado: "Default",
  setEquipoSeleccionado: () => {},
  streamInitialized: false,
  websocketData: {
    data: null,
    isConnected: false,
    error: null,
    reconnect: () => {},
  },
});

export const useAuth = () => useContext(AuthContext);

const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const [equipoSeleccionado, setEquipoSeleccionado] =
    useState<string>("Default");
  const pathname = usePathname();
  const [streamInitialized, setStreamInitialized] = useState<boolean>(false);

  const websocketData = useWebSocketContext();

  useEffect(() => {
    const initializeStream = async () => {
      if (!streamInitialized) {
        try {
          await fetch("/api/cleanup", { method: "POST" });
          await fetch("/api/stream");
          setStreamInitialized(true);
        } catch (error) {
          console.error("Error initializing stream:", error);
        }
      }
    };

    initializeStream();
  }, [streamInitialized, pathname]);

  useEffect(() => {
    if (pathname !== "/desmoldeo/equipox") {
      setEquipoSeleccionado("Default");
    }
  }, [pathname]);

  const contextValue: AuthContextType = {
    equipoSeleccionado,
    setEquipoSeleccionado,
    streamInitialized,
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
