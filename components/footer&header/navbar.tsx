"use client";

import { Navbar as HeroUINavbar } from "@heroui/navbar";
import { useTranslation } from "react-i18next";
import { VscBell } from "react-icons/vsc";
import { GoGear } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";

import { ThemeSwitch } from "@/components/theme-switch";
import DropdownBanderas from "@/components/traduccion/dropdownBanderas";
import Desloguear from "@/components/botones/desloguear";

interface Header1Props {
  currentPath: string;
}

interface OpcionIcono {
  id: number;
  url?: string;
  icon: JSX.Element | React.ReactNode;
}

interface OpcionMenu {
  id: number;
  url: string;
  text: string;
}

const opcionesIconos: OpcionIcono[] = [
  { id: 1, icon: <Desloguear /> },
  {
    id: 2,
    url: "/alertas",
    icon: (
      <Link
        className="group relative flex items-center justify-center w-[25px] h-[25px] ease-in-out"
        href="/alertas"
      >
        {/* Efecto de glow */}
        <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />

        {/* Icono con escala */}
        <VscBell className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
      </Link>
    ),
  },
  {
    id: 3,
    icon: (
      <Link
        className="group relative flex items-center justify-center w-[25px] h-[25px] ease-in-out"
        href="/alertas"
      >
        {/* Efecto de glow */}
        <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />

        {/* Icono con escala */}
        <GoGear className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
      </Link>
    ),
  },
  { id: 4, icon: <DropdownBanderas /> },
  { id: 5, icon: <ThemeSwitch /> },
];

export const Navbar: React.FC<Header1Props> = ({ currentPath }) => {
  const { t } = useTranslation();

  const opcionesMenu: OpcionMenu[] = [{ id: 1, url: "/", text: t("min.home") }];

  return (
    <HeroUINavbar className="bg-headerbg text-textoheader" maxWidth="full" position="sticky">
      <div className="flex flex-row h-[100%] w-[30%] justify-start gap-[30px] items-center">
        {opcionesIconos.map(({ id, icon }) => (
          <div
            key={id}
            className="flex items-center justify-center cursor-pointer"
          >
            {icon}
          </div>
        ))}
      </div>

      <p className="flex w-[40%] justify-center header">{t("min.titulo")}</p>

      <div className="flex flex-row w-[30%] justify-end">
        <ul className="flex flex-row w-full h-[100%] gap-[30px] justify-end">
          {opcionesMenu.map(({ id, url, text }) => (
            <li key={id} className="h-[100%]">
              <Link
                className={currentPath === url ? "activeLink" : ""}
                href={url}
              >
                <span className="header">{text}</span>
              </Link>
            </li>
          ))}
          <Link
            href="https://creminox.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="Creminox"
              className="h-[100%] w-[105px]"
              height={1000}
              src="/logo/creminox.png"
              width={1000}
            />
          </Link>
        </ul>
      </div>
    </HeroUINavbar>
  );
};
