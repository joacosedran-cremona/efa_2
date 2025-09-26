"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoDotFill } from "react-icons/go";
import { useTranslation } from "react-i18next";

const Navbar2 = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const DESAC_CLASS = "opacity-50 cursor-not-allowed pointer-events-none";

  const opcionesBotones = [
    {
      id: 1,
      path: "/",
      text: t("mayus.completo"),
      styleClass: "",
    },
    {
      id: 2,
      path: ["/desmoldeo", "/desmoldeo/equipos"],
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
              } ${styleClass === "desac" ? DESAC_CLASS : styleClass}`}
            >
              <Link
                className="flex items-center gap-2 hover:text-texto2"
                href={Array.isArray(path) ? path[0] : path}
              >
                {isActive ? (
                  <GoDotFill className="text-green-500" />
                ) : (
                  <GoDotFill className="text-gray-500" />
                )}
                <p>{text}</p>
              </Link>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar2;
