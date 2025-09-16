"use client";

import { BiReceipt } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { FaWeightHanging } from "react-icons/fa";
import { MdPrecisionManufacturing } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { TbBowl } from "react-icons/tb";

import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

interface MachineStatus {
  idRecetaActual?: number;
  idRecetaProxima?: string;
  CodigoProducto?: string;
  TotalNiveles?: number;
  TipoMolde?: string;
  estadoMaquina?: string;
  desmoldeoBanda?: string;
  PesoProducto?: number;
  TiempoTranscurrido?: string;
  sdda_nivel_actual?: number;
  NGripperActual?: number;
  PesoActualDesmoldado?: number;
  TorreActual?: number;
}

const DatosGenerales = () => {
  const { t } = useTranslation();
  const { websocketData } = useAuth();
  const data = websocketData.data;

  const machineStatus: MachineStatus = data?.machineStatus || {};

  const {
    idRecetaActual,
    idRecetaProxima,
    CodigoProducto,
    TotalNiveles,
    TipoMolde,
    estadoMaquina,
    desmoldeoBanda,
    PesoProducto,
    TiempoTranscurrido,
    sdda_nivel_actual,
    NGripperActual,
    PesoActualDesmoldado,
    TorreActual,
  } = machineStatus;

  const datosGenerales = [
    {
      id: 1,
      texto: t("min.recetaActual"),
      dato: CodigoProducto ?? "null",
      icono: BiReceipt,
    },
    {
      id: 2,
      texto: t("min.nroMolde"),
      dato: TipoMolde ?? "null",
      icono: TbBowl,
    },
    {
      id: 3,
      texto: t("min.estadoMaquina"),
      dato: estadoMaquina ?? "null",
      icono: MdPrecisionManufacturing,
    },
    {
      id: 4,
      texto: t("min.pesoDesmoldado"),
      dato:
        estadoMaquina === "CICLO INACTIVO"
          ? "0"
          : (PesoActualDesmoldado ?? "null"),
      icono: FaWeightHanging,
    },
    {
      id: 5,
      texto: t("min.tiempoTranscurrido"),
      dato: TiempoTranscurrido ?? "00:00 mm:ss",
      icono: FaRegClock,
    },
    {
      id: 6,
      texto: t("min.recetaProxima"),
      dato: idRecetaProxima ?? "null",
      icono: PiChefHat,
    },
  ];

  return (
    <>
      <div className="w-full bg-[#131313] rounded-[15px] py-[10px] px-[20px] pb-[20px] mb-[10px] flex flex-col text-[#D9D9D9]">
        <h1 className="text-xl font-bold">{t("mayus.datosGenerales")}</h1>
        <ul className="w-full list-none">
          {datosGenerales.map(({ id, texto, dato, icono: IconComponent }) => (
            <li
              key={id}
              className="w-full p-[10px_20px] mt-[10px] bg-[#1F1F1F] rounded-[15px]"
            >
              <div className="w-full flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{texto}</h3>
                  <h4 className="text-sm">
                    {texto === t("min.pesoDesmoldado") ? `${dato} kg` : dato}
                  </h4>
                </div>
                <IconComponent
                  size={40}
                  className="text-[#D9D9D9] m-[5px] -mr-[5px] ml-auto drop-shadow-[5px_5px_10px_rgba(0,0,0,0.5)]"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DatosGenerales;
