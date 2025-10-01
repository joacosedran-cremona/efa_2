"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BiReceipt } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { BiCabinet } from "react-icons/bi";
import { GrResources } from "react-icons/gr";
import { TbBowl } from "react-icons/tb";
import { FaWeightHanging } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { MdPrecisionManufacturing } from "react-icons/md";

import { useApp } from "@/context/AppContext";

interface NavOption {
  id: number;
  nombre: string;
}

interface DatoTiempoReal {
  id: number;
  nombre: string;
  dato: string | number | null;
  icono: any;
  isReactIcon?: boolean;
}

const DatosLaterales: React.FC = () => {
  const { t } = useTranslation();

  const { websocketData } = useApp();

  const machineStatus = websocketData?.data?.machineStatus;

  const idRecetaProxima = machineStatus?.idRecetaProxima ?? null;
  const CodigoProducto = machineStatus?.CodigoProducto ?? null;
  const TotalNiveles = machineStatus?.TotalNiveles ?? null;
  const TipoMolde = machineStatus?.TipoMolde ?? null;
  const estadoMaquina = machineStatus?.estadoMaquina ?? null;
  const PesoPorNivel = machineStatus?.PesoPorNivel ?? null;
  const TiempoTranscurrido = machineStatus?.TiempoTranscurrido ?? null;
  const sdda_nivel_actual = machineStatus?.sdda_nivel_actual ?? null;
  const NGripperActual = machineStatus?.NGripperActual ?? null;
  const PesoActualDesmoldado = machineStatus?.PesoActualDesmoldado ?? null;
  const TorreActual = machineStatus?.TorreActual ?? null;

  const opcionesAlarma: NavOption[] = [
    { id: 1, nombre: t("mayus.layout") },
    { id: 2, nombre: t("mayus.productividad") },
    { id: 3, nombre: t("mayus.graficosHistoricos") },
  ];

  const datosTiempoReal: DatoTiempoReal[] = [
    {
      id: 1,
      nombre: t("min.recetaActual"),
      dato: CodigoProducto || "",
      icono: BiReceipt,
      isReactIcon: true,
    },
    {
      id: 2,
      nombre: t("min.nroMolde"),
      dato: TipoMolde || "",
      icono: TbBowl,
      isReactIcon: true,
    },
    {
      id: 3,
      nombre: t("min.nroGripperActual"),
      dato: NGripperActual || "",
      icono: MdPrecisionManufacturing,
      isReactIcon: true,
    },
    {
      id: 4,
      nombre: t("min.nroTorreActual"),
      dato: TorreActual || "",
      icono: BiCabinet,
      isReactIcon: true,
    },
    {
      id: 5,
      nombre: t("min.pesoFila"),
      dato: PesoPorNivel ? `${PesoPorNivel} kg` : "",
      icono: FaWeightHanging,
      isReactIcon: true,
    },
    {
      id: 6,
      nombre: t("min.pesoDesmoldado"),
      dato:
        estadoMaquina === "CICLO INACTIVO"
          ? "0 kg"
          : PesoActualDesmoldado != null
            ? `${PesoActualDesmoldado} kg`
            : "",
      icono: FaWeightHanging,
      isReactIcon: true,
    },
    {
      id: 7,
      nombre: t("min.torreNivelActual"),
      dato:
        sdda_nivel_actual != null && TotalNiveles != null
          ? `${sdda_nivel_actual}/${TotalNiveles}`
          : "",
      icono: GrResources,
      isReactIcon: true,
    },
    {
      id: 8,
      nombre: t("min.tiempoTranscurrido"),
      dato:
        TiempoTranscurrido != null
          ? TiempoTranscurrido === "0"
            ? "00:00 mm:ss"
            : TiempoTranscurrido
          : "",
      icono: FaRegClock,
      isReactIcon: true,
    },
    {
      id: 9,
      nombre: t("min.idProxReceta"),
      dato: idRecetaProxima || "",
      icono: PiChefHat,
      isReactIcon: true,
    },
  ];

  const [activeSection, setActiveSection] = useState<number>(1);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        let closestSection = null;
        let closestDistance = Infinity;

        opcionesAlarma.forEach(({ id }) => {
          const section = document.getElementById(`section${id}`);

          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;

            const offsetMargin = 200;
            const distanceFromTop = Math.abs(sectionTop);

            if (
              sectionTop < window.innerHeight + offsetMargin &&
              sectionBottom >= 0 - offsetMargin
            ) {
              if (distanceFromTop < closestDistance) {
                closestDistance = distanceFromTop;
                closestSection = id;
              }
            }
          }
        });

        if (closestSection) {
          setActiveSection(closestSection);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleScrollClick = (id: number) => {
    const section = document.getElementById(`section${id}`);

    if (section) {
      const offset = -133;
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(id);
    }
  };

  return (
    <div className="fixed left-0 w-[270px] bg-background2 p-5 z-[998] flex flex-col h-[calc(100vh-112px)] overflow-auto">
      <ul className="flex flex-col gap-2 list-none">
        {opcionesAlarma.map(({ id, nombre }) => (
          <li key={id} className="gap-[10px]">
            <Link
              className={`block p-[5px] text-center  no-underline rounded-lg font-semibold border ${
                activeSection === id
                  ? " border-blue bg-datosblueback hover:bg-datosbluebackhover"
                  : "bg-background3 hover:bg-background4 border-background6"
              }`}
              href={`#section${id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollClick(id);
              }}
            >
              {nombre}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="w-[98%] flex mx-auto my-[20px]" />

      <div className="overflow-auto flex flex-col h-full gap-5">
        <p className="font-semibold block flex text-center justify-center text-lg">
          {t("mayus.datosGenerales")}
        </p>
        <ul className="flex flex-col gap-2" lang="es">
          {datosTiempoReal.map(({ id, nombre, dato, icono }) => (
            <Link key={id} className="block" href="/desmoldeo/equipos">
              <li className="flex flex-row items-center justify-between border border-background6 bg-background3 rounded-lg p-[5px]">
                <p className="flex flex-col text-md font-bold">
                  {nombre} <span className="text-sm">{dato}</span>
                </p>
                {React.createElement(icono, { size: 24 })}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatosLaterales;
