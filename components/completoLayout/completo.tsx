"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";

import DatosDesmoldeo from "./desmoldeo/datosDesmoldeo";
import EstadoDesmoldeo from "./desmoldeo/estadoDesmoldeo";
import DatosEncajonado from "./encajonado/datosEncajonado";
import EstadoEncajonado from "./encajonado/estadoEncajonado";
import DatosPaletizado from "./paletizado/datosPaletizado";
import EstadoPaletizado from "./paletizado/estadoPaletizado";

const LayoutCompleto = () => {
  const sections = [
    {
      id: 1,
      name: "Desmoldeo",
      path: "/desmoldeo",
      position: { top: "36.2%", left: "0%", width: "35.3%", height: "63.8%" },
      styleClass: "secciondesbloqueada",
    },
    {
      id: 2,
      name: "Encajonado",
      path: "/encajonado",
      position: { top: "0.3%", left: "35.3%", width: "59.5%", height: "48%" },
      styleClass: "seccionbloqueada",
    },
    {
      id: 3,
      name: "Paletizado",
      path: "/paletizado",
      position: { top: "32.8%", left: "62.8%", width: "37.2%", height: "34%" },
      styleClass: "seccionbloqueada",
    },
    {
      id: 4,
      name: "Datos",
      path: "/",
      position: {
        top: "67.5%",
        left: "36.5%",
        width: "61.3%",
        height: "31.5%",
      },
      styleClass: "secciondatos",
    },
  ];

  const getSectionClasses = (styleClass: string) => {
    const baseClasses =
      "absolute p-0 cursor-pointer ease-in-out bg-transparent";

    switch (styleClass) {
      case "secciondesbloqueada":
        return `${baseClasses} rounded-lg z-0 border-2 border-green-500 hover:bg-white/30 hover:shadow-[0px_0px_15px_10px_rgba(255,255,255,0.8)]`;
      case "seccionbloqueada":
        return `${baseClasses} rounded-lg bg-gray-500 border border-black opacity-50 z-0 pointer-events-none hover:bg-[rgba(17,17,17,0.815)]`;
      case "secciondatos":
        return `${baseClasses} rounded-lg bg-transparent z-10 flex gap-2.5 shadow-none cursor-default hover:bg-transparent`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="relative w-auto h-[50rem]">
      <div className="relative w-full h-full">
        <Image
          priority
          alt="Layout"
          className="object-contain rounded-lg"
          height={801}
          sizes="80vh"
          src="/layout/layoutcompleto.png"
          style={{
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
          width={1287}
        />
      </div>

      {sections.slice(0, 3).map((section) => (
        <Link key={section.id} href={section.path}>
          <div
            className={getSectionClasses(section.styleClass)}
            style={section.position}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black p-[5px] rounded-lg text-xs opacity-0 transition-opacity ease-in-out group-hover:opacity-100">
              {section.name}
            </span>

            {section.id === 1 && <EstadoDesmoldeo />}
            {section.id === 2 && <EstadoEncajonado />}
            {section.id === 3 && <EstadoPaletizado />}
          </div>
        </Link>
      ))}

      <div
        className="absolute rounded-lg z-10 flex gap-2"
        style={sections[3].position}
      >
        <DatosDesmoldeo />
        <DatosEncajonado />
        <DatosPaletizado />
      </div>
    </div>
  );
};

export default LayoutCompleto;
