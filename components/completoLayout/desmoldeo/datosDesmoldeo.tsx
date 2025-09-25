"use client";

import { useContext } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import AppContext from "@/context/AppContext";

interface MachineStatus {
  estadoMaquina?: string;
  TiempoTranscurrido?: string;
  idRecetaActual?: number;
  idRecetaProxima?: string;
  CodigoProducto?: string;
  TotalNiveles?: number;
  TipoMolde?: string;
  desmoldeoBanda?: string;
  PesoProducto?: number;
  sdda_nivel_actual?: number;
  NGripperActual?: number;
  PesoActualDesmoldado?: number;
  TorreActual?: number;
}

interface DesmoldeoData {
  "Nombre actual"?: string;
  PesoProducto?: number;
  TotalNiveles?: number;
  sdda_nivel_actual?: number;
  estadoMaquina?: string;
  iniciado?: boolean;
  PesoActualDesmoldado?: number;
  TiempoTranscurrido?: number | string;
}

interface WebSocketData {
  machineStatus?: MachineStatus;
  processData?: {
    Desmoldeo?: DesmoldeoData;
    Encajonado?: any[];
    Palletizado?: any[];
  };
}

const DatosDesmoldeo = () => {
  const { websocketData } = useContext(AppContext);
  const data = websocketData?.data as WebSocketData | null;
  const { t } = useTranslation();

  const machineStatus = data?.machineStatus || ({} as MachineStatus);
  const desmoldeoData = data?.processData?.Desmoldeo || ({} as DesmoldeoData);

  const estadoMaquina =
    desmoldeoData.estadoMaquina ||
    machineStatus.estadoMaquina ||
    "CICLO INACTIVO";
  const PesoProducto = desmoldeoData.PesoProducto || machineStatus.PesoProducto;
  const PesoActualDesmoldado =
    desmoldeoData.PesoActualDesmoldado ||
    machineStatus.PesoActualDesmoldado ||
    0;

  const NombreActual =
    desmoldeoData["Nombre actual"]?.trim() ||
    machineStatus.CodigoProducto ||
    machineStatus.idRecetaProxima ||
    "-";

  const datosTiempoReal = [
    {
      id: 1,
      nombre: t("min.nombreReceta"),
      dato:
        NombreActual !== undefined && NombreActual !== null
          ? NombreActual
          : "-",
    },
    {
      id: 2,
      nombre: t("min.pesoFila"),
      dato:
        PesoProducto !== undefined && PesoProducto !== null
          ? PesoProducto + " kg"
          : "-",
    },
    {
      id: 3,
      nombre: t("min.totalDesmoldado"),
      dato:
        PesoActualDesmoldado !== undefined && PesoActualDesmoldado !== null
          ? PesoActualDesmoldado + " kg"
          : "-",
    },
  ];

  const isActive =
    estadoMaquina === "CICLO ACTIVO" || estadoMaquina === "CICLO PAUSADO";

  const baseClasses =
    "flex flex-col justify-center items-center h-full w-full p-2 rounded-lg transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] ";

  return (
    <ul className="w-full h-full flex flex-col list-none text-white gap-2">
      {datosTiempoReal.map(({ id, nombre, dato }) => (
        <li
          key={id}
          className={clsx(baseClasses, {
            "bg-[#581420]": isActive,
            "bg-[#555555] pointer-events-none": !isActive,
          })}
        >
          <Link
            className={
              isActive
                ? "max-h-[55px] w-full h-full"
                : "h-full w-full flex items-center justify-center rounded-lg bg-[#555555] text-lightgrey transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] pointer-events-none"
            }
            href="/desmoldeo/equipos"
          >
            {isActive ? (
              <div className="w-full h-full flex flex-col">
                <h3 className="text-[1rem] h-1/2 flex flex-col justify-center transition-colors font-semibold">
                  {nombre}
                </h3>
                <h4 className="text-[0.9rem] h-1/2 flex flex-col justify-center transition-colors ">
                  {dato}
                </h4>
              </div>
            ) : (
              <>{nombre}</>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DatosDesmoldeo;
