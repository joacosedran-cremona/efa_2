"use client";
//import Cookies from "js-cookie";
import { createContext, useState, useEffect, ReactNode } from "react";
//import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { WebSocketProvider } from "./WebSocketContext";

// Define types for our context
interface User {
  access_token: string;
  token_type: string;
  role: string;
}

interface AuthContextType {
  //user: User | null;
  //login: (username: string, password: string) => Promise<void>;
  //logout: () => void;
  equipoSeleccionado: string;
  setEquipoSeleccionado: (equipo: string) => void;
  streamInitialized: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  //user: null,
  //login: async () => {},
  //logout: () => {},
  equipoSeleccionado: "Default",
  setEquipoSeleccionado: () => {},
  streamInitialized: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [equipoSeleccionado, setEquipoSeleccionado] =
    useState<string>("Default");
  const router = useRouter();
  const pathname = usePathname();
  const [streamInitialized, setStreamInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user_data");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  {
    /*useEffect(() => {
    const publicRoutes = ["/login", "/signup", "/login/recuperacion"];
    const blockedRoutes = ["/encajonado", "/paletizado"];

    if (typeof window !== "undefined") {
      // Redirigir al login si no hay usuario y la ruta no es pública
      if (!user && !publicRoutes.includes(pathname || "")) {
        router.push("/login");
      }
      // Bloquear rutas sin importar si el usuario está autenticado o no
      if (blockedRoutes.includes(pathname || "")) {
        router.push("/error"); // O cualquier otra página que indique acceso denegado
      }
    }
  }, [user, pathname, router]);
  */}

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

  {/*const login = async (username: string, password: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post<{
        role: string;
        access_token: string;
        token_type: string;
      }>(
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/usuario/login`,
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { role, access_token, token_type } = response.data;
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      const userData: User = { access_token, token_type, role };

      // Almacenar en sessionStorage solo el token y el token_type, excluyendo el role
      sessionStorage.setItem("user_data", JSON.stringify(userData));

      Cookies.set("token", access_token, { secure: false, sameSite: "lax" });

      // Guardar el role únicamente en el estado del contexto
      setUser(userData);

      router.push("/completo");
    } catch (error) {
      throw new Error("Credenciales inválidas");
    }
  };*/}

  const logout = (): void => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_data");
    sessionStorage.removeItem("username");
    router.push("/login");
  };

  const contextValue: AuthContextType = {
    //user,
    //login,
    //logout,
    equipoSeleccionado,
    setEquipoSeleccionado,
    streamInitialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <WebSocketProvider pollId="datos">{children}</WebSocketProvider>
    </AuthContext.Provider>
  );
};

export default AuthContext;
