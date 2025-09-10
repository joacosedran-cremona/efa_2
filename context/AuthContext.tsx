"use client";
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { usePathname } from "next/navigation";
import { WebSocketProvider, useWebSocketContext } from "./WebSocketContext";
import { WebSocketResponse } from "../interfaces/websocket";

// Define enhanced types for our context
interface AuthContextType {
  equipoSeleccionado: string;
  setEquipoSeleccionado: (equipo: string) => void;
  streamInitialized: boolean;
  // Add WebSocket data to AuthContext
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

// Create context with default values
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

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Inner component that can access WebSocket context
const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const [equipoSeleccionado, setEquipoSeleccionado] =
    useState<string>("Default");
  const pathname = usePathname();
  const [streamInitialized, setStreamInitialized] = useState<boolean>(false);

  // Access WebSocket context values
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
    websocketData, // Pass WebSocket data through context
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Main provider component that wraps WebSocketProvider around our inner provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <WebSocketProvider pollId="datos">
      <AuthProviderInner>{children}</AuthProviderInner>
    </WebSocketProvider>
  );
};

export default AuthContext;
