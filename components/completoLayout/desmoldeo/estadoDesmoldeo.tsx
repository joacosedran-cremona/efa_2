"use client";

import { useContext } from "react";

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

const DatosEstadoDesmoldeo = () => {
  const { websocketData } = useContext(AuthContext);
  const data = websocketData?.data as WebSocketData | null;

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
    <>
      <div className="h-full w-full">
        <ul className="w-full h-full flex flex-col p-0 m-0 gap-2 text-[#d9d9d9] list-none">
          {estadoMaquina === "CICLO ACTIVO" ? (
            <li className="flex flex-col px-[0.8vw] py-[0.4vw] rounded-lg bg-[#581420] max-h-[65px] h-full w-full transition-colors  shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
              <div className="w-full h-full">
                <h1 className="text-[1vw] font-semibold mb-1">Desmoldeo</h1>
                <h3 className="text-[0.9vw] font-semibold text-white">
                  {String(estadoMaquina).toUpperCase()}
                </h3>
                <h4 className="text-[0.8vw] text-gray-200">
                  {TiempoTrancurrido}
                </h4>
              </div>
            </li>
          ) : estadoMaquina === "CICLO PAUSADO" ? (
            <li className="flex flex-col p-[0.4vw_0.8vw] rounded-lg bg-[#8B6B00] max-h-[65px] h-full w-full transition-colors  shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
              <div className="w-full h-full">
                <h1 className="text-[1vw] font-semibold mb-1">Desmoldeo</h1>
                <h3 className="text-[0.9vw] font-semibold text-yellow-100">
                  {String(estadoMaquina).toUpperCase()}
                </h3>
                <h4 className="text-[0.8vw] text-gray-200">
                  {TiempoTrancurrido}
                </h4>
              </div>
            </li>
          ) : (
            <li className="flex flex-col p-[0.4vw_0.8vw] rounded-lg bg-[#5a5a5a] max-h-[65px] h-full w-full transition-colors  shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
              <div className="w-full h-full">
                <h1 className="text-[1vw] font-semibold mb-1">Desmoldeo</h1>
                <h3 className="text-[0.9vw] font-semibold text-gray-300">
                  {String(estadoMaquina).toUpperCase()}
                </h3>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default DatosEstadoDesmoldeo;
