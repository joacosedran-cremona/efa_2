"use client";

import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

// Define interfaces for your data structure
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

const EstadoEncajonado = () => {
  const { websocketData } = useContext(AuthContext); // Obtiene el objeto websocketData del contexto
  const data = websocketData?.data as WebSocketData | null; // Accede a los datos con type assertion

  // Accede a los datos de estado de la máquina desde la estructura correcta
  const machineStatus = data?.machineStatus || ({} as MachineStatus);
  const desmoldeoData = data?.processData?.Desmoldeo || ({} as DesmoldeoData);

  // Usa los datos de machineStatus o desmoldeoData según disponibilidad
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
            <li className="flex flex-col px-[0.8vw] py-[0.4vw] rounded-[0.7vw] bg-[#581420] max-h-[65px] h-full w-full transition-colors duration-800 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
              <div className="w-full h-full">
                <h1 className="text-[1vw] font-bold mb-1">Desmoldeo</h1>
                <h3 className="text-[0.9vw] font-semibold text-white">
                  {String(estadoMaquina).toUpperCase()}
                </h3>
                <h4 className="text-[0.8vw] text-gray-200">
                  {TiempoTrancurrido}
                </h4>
              </div>
            </li>
          ) : estadoMaquina === "CICLO PAUSADO" ? (
            <li className="flex flex-col px-[0.8vw] py-[0.4vw] rounded-[0.7vw] bg-[#8B6B00] max-h-[65px] h-full w-full transition-colors duration-800 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
              <div className="w-full h-full">
                <h1 className="text-[1vw] font-bold mb-1">Desmoldeo</h1>
                <h3 className="text-[0.9vw] font-semibold text-yellow-100">
                  {String(estadoMaquina).toUpperCase()}
                </h3>
                <h4 className="text-[0.8vw] text-gray-200">
                  {TiempoTrancurrido}
                </h4>
              </div>
            </li>
          ) : (
            <li className="flex flex-col px-[0.8vw] py-[0.4vw] rounded-[0.7vw] bg-[#5a5a5a] max-h-[65px] h-full w-full transition-colors duration-800 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
              <div className="w-full h-full">
                <h1 className="text-[1vw] font-bold mb-1">Desmoldeo</h1>
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

export default EstadoEncajonado;
