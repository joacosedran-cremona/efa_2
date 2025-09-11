"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import style from "./SubNav.module.css";

import { GoDotFill } from "react-icons/go"; //Punto

const SubNav = () => {
  const pathname = usePathname();

  const opcionesBotones = [
    {
      id: 1,
      path: "/completo",
      text: "COMPLETO",
      styleClass: style.secciondesbloqueada,
    },
    {
      id: 2,
      path: ["/desmoldeo", "/desmoldeo/equipox"],
      text: "DESMOLDEO",
      styleClass: style.secciondesbloqueada,
    },
    {
      id: 3,
      path: "/encajonado",
      text: "ENCAJONADO",
      styleClass: style.seccionbloqueada,
    },
    {
      id: 4,
      path: "/paletizado",
      text: "PALETIZADO",
      styleClass: style.seccionbloqueada,
    },
  ];

  return (
    <div className={style.contenedor}>
      <div className={style.SubNav}>
        <ul className={style.navLinks}>
          {opcionesBotones.map(({ id, path, text, styleClass }) => {
            // Verifica si pathname coincide con alguna de las rutas
            const isActive = Array.isArray(path)
              ? path.includes(pathname) // Si path es un array, verifica si pathname está en él
              : pathname === path; // Si path es una cadena, compara directamente

            return (
              <li
                key={id}
                className={`${style.itemNav} ${
                  isActive ? style.active : ""
                } ${styleClass}`}
              >
                <Link href={Array.isArray(path) ? path[0] : path}>
                  {isActive ? (
                    <GoDotFill className="text-green-500" />
                  ) : (
                    <GoDotFill className="text-gray-500" />
                  )}
                  <span className={styleClass}>{text}</span>
                </Link>
                {isActive && <div className={style.barraSeleccionada}></div>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SubNav;
