"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  WebSocketResponse,
  MachineStatus,
  ProcessData,
  TechnicalData,
  Alarm,
} from "../interfaces/websocket";

// Define the shape of the context
interface WebSocketContextType {
  data: WebSocketResponse | null;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
}

// Create the context with default values
const WebSocketContext = createContext<WebSocketContextType>({
  data: null,
  isConnected: false,
  error: null,
  reconnect: () => {},
});

// Hook to use the WebSocket context
export const useWebSocketContext = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
  pollId: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  pollId,
}) => {
  const [data, setData] = useState<WebSocketResponse | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const wsUrl = `ws://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/ws/${pollId}`;
      const socket = new WebSocket(wsUrl);

      socketRef.current = socket;

      // Event: Connection opened
      socket.onopen = () => {
        console.log(`WebSocket connected: ${wsUrl}`);
        setIsConnected(true);
        setError(null);

        // Clear any reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      // Event: Message received
      socket.onmessage = (event: MessageEvent) => {
        if (
          socketRef.current !== socket ||
          socket.readyState !== WebSocket.OPEN
        ) {
          return;
        }

        try {
          const rawData = JSON.parse(event.data);

          // Process the data according to the expected structure
          if (Array.isArray(rawData) && rawData.length >= 5) {
            const formattedData: WebSocketResponse = {
              machineStatus: rawData[0] as MachineStatus,
              processData: rawData[1] as ProcessData,
              technicalData: rawData[2] as TechnicalData,
              alarms: rawData[3] as Alarm[],
              extraData: rawData[4] as any[],
            };

            setData(formattedData);
          } else {
            console.warn("WebSocket data format unexpected:", rawData);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
          setError(new Error(`Failed to parse WebSocket data: ${err}`));
        }
      };

      // Event: Connection closed
      socket.onclose = (event: CloseEvent) => {
        if (socketRef.current !== socket) {
          return;
        }

        console.log(`WebSocket disconnected: ${event.code} - ${event.reason}`);
        setIsConnected(false);
        socketRef.current = null;

        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connect();
        }, 3000);
      };

      // Event: Error occurred
      socket.onerror = (event: Event) => {
        console.error("WebSocket error:", event);
        setError(new Error("WebSocket connection error"));
      };
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [pollId]);

  // Initial connection
  useEffect(() => {
    connect();

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connect]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    connect();
  }, [connect]);

  // Context value
  const contextValue: WebSocketContextType = {
    data,
    isConnected,
    error,
    reconnect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
