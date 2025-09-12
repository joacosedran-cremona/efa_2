"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Image from "next/image";

// React Icons imports
import { BiReceipt } from "react-icons/bi"; // Receta
import { PiChefHat } from "react-icons/pi"; // Receta 2
import { BiCabinet } from "react-icons/bi"; // Torre
import { GrResources } from "react-icons/gr"; // Nivel
import { TbBowl } from "react-icons/tb"; // Molde
import { FaWeightHanging } from "react-icons/fa"; // Peso
import { FaRegClock } from "react-icons/fa"; // Reloj
import { MdPrecisionManufacturing } from "react-icons/md"; // Gripper

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
  // Use translation hook
  const { t } = useTranslation();

  // Use the updated AuthContext hook
  const { websocketData } = useAuth();

  // Access machine status data from the websocket response
  const machineStatus = websocketData?.data?.machineStatus;

  // Get values with null as default for undefined values
  const idRecetaActual = machineStatus?.idRecetaActual ?? null;
  const idRecetaProxima = machineStatus?.idRecetaProxima ?? null;
  const CodigoProducto = machineStatus?.CodigoProducto ?? null;
  const TotalNiveles = machineStatus?.TotalNiveles ?? null;
  const TipoMolde = machineStatus?.TipoMolde ?? null;
  const estadoMaquina = machineStatus?.estadoMaquina ?? null;
  const desmoldeoBanda = machineStatus?.desmoldeoBanda ?? null;
  const PesoProducto = machineStatus?.PesoProducto ?? null;
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
      dato: PesoProducto || "",
      icono: FaWeightHanging,
      isReactIcon: true,
    },
    {
      id: 6,
      nombre: t("min.pesoDesmoldado"),
      dato:
        estadoMaquina === "CICLO INACTIVO"
          ? "0"
          : PesoActualDesmoldado != null
            ? PesoActualDesmoldado
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
          ? TiempoTranscurrido === "0" || TiempoTranscurrido === 0 // Fixed comparison to check for both string "0" and number 0
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
              href={`#section${id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollClick(id);
              }}
              className={`block p-[5px] text-center  no-underline rounded-lg font-semibold border ${
                activeSection === id
                  ? " border-blue bg-datosblueback hover:bg-datosbluebackhover"
                  : "bg-background3 hover:bg-background4 border-background6"
              }`}
            >
              {nombre}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="w-[98%] flex mx-auto my-[20px]" />

      <div className="overflow-auto h-full">
        <p className="font-bold block text-center">
          {t("mayus.datosGenerales")}
        </p>
        <ul className="list-none p-0 m-0 flex flex-col gap-2" lang="es">
          {datosTiempoReal.map(({ id, nombre, dato, icono, isReactIcon }) => (
            <Link href="/desmoldeo/equipox" key={id} className="block">
              <li className="flex items-start justify-between py-[10px] px-[15px] gap-2 border-2 border-background4 rounded-lg bg-background3 min-h-[55px] max-h-[5vh]">
                <div className="w-[90%] flex flex-col no-underline">
                  <h3 className="text-base p-0 m-0 font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                    {nombre}
                  </h3>
                  <h4 className="text-[15px] p-0 m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {nombre === t("min.pesoFila") ||
                    nombre === t("min.pesoDesmoldado")
                      ? `${dato} kg`
                      : dato}
                  </h4>
                </div>
                <div className="w-[10%] flex items-start justify-center">
                  {isReactIcon ? (
                    <div className="text-2xl flex-shrink-0 mt-[3px]">
                      {React.createElement(icono)}
                    </div>
                  ) : (
                    <Image
                      src={icono}
                      alt={`Estado: ${id}`}
                      className="max-w-[25px] max-h-[25px] flex-shrink-0 mt-[3px]"
                    />
                  )}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatosLaterales;
