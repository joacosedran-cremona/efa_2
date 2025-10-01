"use client";

import { useContext } from "react";
import { useTranslation } from "react-i18next";

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

const DatosEstadoDesmoldeo = () => {
  const { websocketData } = useContext(AppContext);
  const data = websocketData?.data as WebSocketData | null;
  const { t } = useTranslation();

  const machineStatus = data?.machineStatus || ({} as MachineStatus);
  const desmoldeoData = data?.processData?.Desmoldeo || ({} as DesmoldeoData);

  const estadoMaquina =
    machineStatus.estadoMaquina ||
    desmoldeoData.estadoMaquina ||
    "CICLO INACTIVO";
  const TiempoTrancurrido =
    machineStatus.TiempoTranscurrido ||
    desmoldeoData.TiempoTranscurrido ||
    "00:00 hs";

  return (
    <ul className="w-full h-full flex flex-col p-0 m-0 gap-2 list-none text-[#d9d9d9]">
      {estadoMaquina === "CICLO ACTIVO" ? (
        <li className="flex flex-col p-2 rounded-lg bg-[#581420] w-full transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] text-white">
          <p className="text-[1rem] font-semibold">{t("mayus.desmoldeo")}</p>
          <p className="text-[0.9rem] font-semibold">
            {t("mayus.cicloActivo")}
          </p>
          <p className="text-[0.8rem]">{TiempoTrancurrido}</p>
        </li>
      ) : estadoMaquina === "CICLO PAUSADO" ? (
        <li className="flex flex-col p-2 rounded-lg bg-[#8B6B00] w-full transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] text-white">
          <p className="text-[1vw] font-semibold">{t("mayus.desmoldeo")}</p>
          <p className="text-[1rem] font-semibold">
            {t("mayus.cicloPausado")}
          </p>
          <p className="text-[1rem] text-texto">{TiempoTrancurrido}</p>
        </li>
      ) : (
        <li className="flex flex-col p-2 rounded-lg bg-[#5a5a5a] w-full transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] text-white">
          <p className="text-[1rem] font-semibold">{t("mayus.desmoldeo")}</p>
          <p className="text-[1rem] font-semibold">
            {t("mayus.cicloInactivo")}
          </p>
        </li>
      )}
    </ul>
  );
};

export default DatosEstadoDesmoldeo;
