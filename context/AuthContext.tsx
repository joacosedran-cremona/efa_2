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
  const pathname = usePathname();

  const websocketData = useWebSocketContext();

  useEffect(() => {
    if (pathname !== "/desmoldeo/equipos") {
      setEquipoSeleccionado("Default");
    }
  }, [pathname]);

  const contextValue: AuthContextType = {
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
