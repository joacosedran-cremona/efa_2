"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoDotFill } from "react-icons/go"; //Punto
import { useTranslation } from "react-i18next";

const SubNav = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const opcionesBotones = [
    {
      id: 1,
      path: "/completo",
      text: t("mayus.completo"),
      styleClass: "",
    },
    {
      id: 2,
      path: ["/desmoldeo", "/desmoldeo/equipox"],
      text: t("mayus.desmoldeo"),
      styleClass: "",
    },
    {
      id: 3,
      path: "/encajonado",
      text: t("mayus.encajonado"),
      styleClass: "desac",
    },
    {
      id: 4,
      path: "/paletizado",
      text: t("mayus.paletizado"),
      styleClass: "desac",
    },
  ];

  return (
    <div className="w-full bg-background2 shadow-sm flex flex-row justify-center">
      <ul className="flex flex-row items-center gap-6">
        {opcionesBotones.map(({ id, path, text, styleClass }) => {
          const isActive = Array.isArray(path)
            ? path.includes(pathname)
            : pathname === path;

          return (
            <li
              key={id}
              className={`relative py-3 transition-colors ${
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
