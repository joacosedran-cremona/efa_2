"use client";

import { useContext } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import AuthContext from "@/context/AuthContext";

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
  const { websocketData } = useContext(AuthContext);
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

  return (
    <>
      <ul className="w-full h-full flex flex-col p-0 m-0 gap-2 text-[#d9d9d9] list-none">
        {datosTiempoReal.map(({ id, nombre, dato }) => (
          <li
            key={id}
            className={
              isActive
                ? "flex flex-col p-[0.4vw_0.8vw] rounded-lg bg-[#581420] max-h-[65px] h-full w-full transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]"
                : "h-full w-full flex text-center justify-center p-[1vw] rounded-lg bg-[#555555] transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] pointer-events-none"
            }
          >
            <Link
              className={
                isActive ? "max-h-[55px] w-full h-full" : "flex w-full h-full"
              }
              href="/desmoldeo/equipos"
            >
              {isActive ? (
                <div className="w-full h-full">
                  <h3 className="text-[0.9vw] h-1/2 w-full p-0 m-0 transition-colors  font-semibold">
                    {nombre}
                  </h3>
                  <h4 className="text-[0.8vw] h-1/2 w-full p-0 m-0 transition-colors ">
                    {dato}
                  </h4>
                </div>
              ) : (
                <h3 className="text-[0.9vw] h-full w-full p-0 m-0 text-gray-500 transition-colors ">
                  {nombre}
                </h3>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DatosDesmoldeo;
