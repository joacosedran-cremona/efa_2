"use client";

import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import style from "../texto.module.css";
import cont from "./datosdesmoldeo.module.css";
import Link from "next/link";

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

const DatosDesmoldeo = () => {
  const { websocketData } = useContext(AuthContext); // Obtiene el objeto websocketData del contexto
  const data = websocketData?.data as WebSocketData | null; // Accede a los datos con type assertion

  // Accede a los datos desde la nueva estructura
  const machineStatus = data?.machineStatus || ({} as MachineStatus);
  const desmoldeoData = data?.processData?.Desmoldeo || ({} as DesmoldeoData);

  // Utiliza datos de ambas fuentes según disponibilidad
  const estadoMaquina =
    desmoldeoData.estadoMaquina ||
    machineStatus.estadoMaquina ||
    "CICLO INACTIVO";
  const PesoProducto = desmoldeoData.PesoProducto || machineStatus.PesoProducto;
  const PesoActualDesmoldado =
    desmoldeoData.PesoActualDesmoldado ||
    machineStatus.PesoActualDesmoldado ||
    0;

  // Obtener el nombre actual de la receta
  const NombreActual =
    desmoldeoData["Nombre actual"]?.trim() ||
    machineStatus.CodigoProducto ||
    machineStatus.idRecetaProxima ||
    "-";

  const datosTiempoReal = [
    {
      id: 1,
      nombre: "Nombre receta",
      dato:
        NombreActual !== undefined && NombreActual !== null
          ? NombreActual
          : "-",
    },
    {
      id: 2,
      nombre: "Peso por fila",
      dato:
        PesoProducto !== undefined && PesoProducto !== null
          ? PesoProducto + " kg"
          : "-",
    },
    {
      id: 3,
      nombre: "Total desmoldado",
      dato:
        PesoActualDesmoldado !== undefined && PesoActualDesmoldado !== null
          ? PesoActualDesmoldado + " kg"
          : "-",
    },
  ];

  return (
    <>
      <ul className={style.datosTods}>
        {datosTiempoReal.map(({ id, nombre, dato }) => (
          <li
            key={id}
            className={
              estadoMaquina === "CICLO ACTIVO" ||
              estadoMaquina === "CICLO PAUSADO"
                ? cont.datosIndvRed
                : style.datosIndvGray
            }
          >
            <Link
              className={
                estadoMaquina === "CICLO ACTIVO" ||
                estadoMaquina === "CICLO PAUSADO"
                  ? style.detallesDatos
                  : style.detallesDatosDesac
              }
              href="/desmoldeo/equipox"
            >
              {estadoMaquina === "CICLO ACTIVO" ||
              estadoMaquina === "CICLO PAUSADO" ? (
                <div className={style.contenedorActivo}>
                  <h3 className={style.h3}>{nombre}</h3>
                  <h4 className={style.h4}>{dato}</h4>
                </div>
              ) : (
                <h3 className={style.h3inactivo}>{nombre}</h3>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DatosDesmoldeo;
