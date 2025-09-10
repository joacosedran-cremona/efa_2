"use client";

import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";

// Define the expected structure of your data
interface DesmoldeoDataItem {
  Desmoldeo?: {
    estadoMaquina?: string;
    PesoProducto?: number | string;
    PesoActualDesmoldado?: number | string;
    "Nombre actual"?: string;
    [key: string]: any; // For other properties
  };
}

const DatosDesmoldeo = () => {
  // Use AuthContext to get websocketData
  const { websocketData } = useContext(AuthContext);

  // Type assertion to tell TypeScript that data is an array
  const dataArray = websocketData?.data as unknown as DesmoldeoDataItem[];
  const desmoldeoData = dataArray?.[1]?.Desmoldeo || {};

  const {
    estadoMaquina = "CICLO INACTIVO",
    PesoProducto,
    PesoActualDesmoldado,
  } = desmoldeoData;

  const NombreActual = desmoldeoData["Nombre actual"]?.trim() || "-";

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
      <ul className="width-[100%] h-[100%] flex flex-col p-0 m-0 gap-[0.8vw] text-texto list-none">
        {datosTiempoReal.map(({ id, nombre, dato }) => (
          <li
            key={id}
            className={
              estadoMaquina === "CICLO ACTIVO" ||
              estadoMaquina === "CICLO PAUSADO"
                ? "flex flex-col p-[0.4vw_0.8vw] rounded-[0.7vw] bg-[#581420] max-h-[65px] h-full w-full transition-colors duration-800 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]"
                : "flex flex-col p-[0.4vw_0.8vw] rounded-[0.7vw] bg-[#5a5a5a] max-h-[65px] h-full w-full transition-colors duration-800 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]"
            }
          >
            <Link
              className={
                estadoMaquina === "CICLO ACTIVO" ||
                estadoMaquina === "CICLO PAUSADO"
                  ? "max-h-[55px] w-full h-full "
                  : "flex w-full h-full "
              }
              href="/desmoldeo/equipox"
            >
              {estadoMaquina === "CICLO ACTIVO" ||
              estadoMaquina === "CICLO PAUSADO" ? (
                <div className="w-full h-full">
                  <h3 className="text-[0.9vw] h-[50%] w-full p-0 m-0 text-bold transition-colors duration-800 ease-in-out">
                    {nombre}
                  </h3>
                  <h4 className="text-[0.8 vw] h-[50%] w-full p-0 m-0 text-bold transition-colors duration-800 ease-in-out">
                    {dato}
                  </h4>
                </div>
              ) : (
                <h3 className="text-[0.9vw] h-[100%] w-full p-0 m-0 text-bold text-grey transition-colors duration-800 ease-in-out">
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
