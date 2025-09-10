"use client";

import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import style from "./datosestadodesmoldeo.module.css";

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

const DatosEstadoDesmoldeo = () => {
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
      <div className={style.contenedorDatos}>
        <ul className={style.datosTods}>
          {estadoMaquina === "CICLO ACTIVO" ? (
            <li className={style.datosIndvRed}>
              <div className={style.contenedorActivo}>
                <h1 className={style.area}>Desmoldeo</h1>
                <h3 className={style.estadoActivo}>
                  {String(estadoMaquina).toUpperCase()}
                </h3>
                <h4 className={style.tiempo}>{TiempoTrancurrido}</h4>
              </div>
            </li>
          ) : estadoMaquina === "CICLO PAUSADO" ? (
            <li className={style.datosIndvYellow}>
              <div className={style.contenedorPausa}>
                <h1 className={style.area}>Desmoldeo</h1>
                <h3 className={style.estadoPausa}>
                  {String(estadoMaquina).toUpperCase()}
                </h3>
                <h4 className={style.tiempo}>{TiempoTrancurrido}</h4>
              </div>
            </li>
          ) : (
            <li className={style.datosIndvGray}>
              <div className={style.contenedorInactivo}>
                <h1 className={style.area}>Desmoldeo</h1>
                <h3 className={style.estadoInactivo}>
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
