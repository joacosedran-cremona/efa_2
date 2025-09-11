"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoDotFill } from "react-icons/go"; //Punto

const SubNav = () => {
  const pathname = usePathname();

  const opcionesBotones = [
    {
      id: 1,
      path: "/completo",
      text: "COMPLETO",
      styleClass: "text-gray-800", // secciondesbloqueada
    },
    {
      id: 2,
      path: ["/desmoldeo", "/desmoldeo/equipox"],
      text: "DESMOLDEO",
      styleClass: "text-gray-800", // secciondesbloqueada
    },
    {
      id: 3,
      path: "/encajonado",
      text: "ENCAJONADO",
      styleClass: "text-gray-400", // seccionbloqueada
    },
    {
      id: 4,
      path: "/paletizado",
      text: "PALETIZADO",
      styleClass: "text-gray-400", // seccionbloqueada
    },
  ];

  return (
    <div className="w-full bg-background2 shadow-sm flex flex-row justify-center">
        <ul className="flex flex-row items-center gap-6">
          {opcionesBotones.map(({ id, path, text, styleClass }) => {
            // Verifica si pathname coincide con alguna de las rutas
            const isActive = Array.isArray(path)
              ? path.includes(pathname) // Si path es un array, verifica si pathname está en él
              : pathname === path; // Si path es una cadena, compara directamente

            return (
              <li
                key={id}
                className={`relative py-3 transition-colors text-texto duration-200 ${
                  isActive ? "font-semibold" : "font-normal"
                } ${styleClass}`}
              >
                <Link
                  href={Array.isArray(path) ? path[0] : path}
                  className="flex items-center gap-2 hover:text-gray-900"
                >
                  {isActive ? (
                    <GoDotFill className="text-green-500" />
                  ) : (
                    <GoDotFill className="text-gray-500" />
                  )}
                  <span>{text}</span>
                </Link>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"></div>
                )}
              </li>
            );
          })}
        </ul>
    </div>
  );
};

export default SubNav;
