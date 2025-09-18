"use client";

import { createContext, useState, useContext, ReactNode } from "react";

import { WebSocketProvider, useWebSocketContext } from "./WebSocketContext";

interface AppContextType {
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
  equipoSeleccionado: null,
  setEquipoSeleccionado: () => {},
  websocketData: {
    data: null,
    isConnected: false,
    error: null,
    reconnect: () => {},
  },
});

// Helper hook for components to easily access the context
export const useApp = () => useContext(AppContext);

const AppProviderInner = ({ children }: { children: ReactNode }) => {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(
    "Default",
  );

  const websocketData = useWebSocketContext();

  const contextValue: AppContextType = {
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
