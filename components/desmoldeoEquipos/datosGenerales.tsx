"use client";

import { BiReceipt } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { FaWeightHanging } from "react-icons/fa";
import { MdPrecisionManufacturing } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { TbBowl } from "react-icons/tb";
import React from "react";
import { useTranslation } from "react-i18next";

import { useApp } from "@/context/AppContext";

interface MachineStatus {
  idRecetaProxima?: string;
  CodigoProducto?: string;
  TipoMolde?: string;
  estadoMaquina?: string;
  TiempoTranscurrido?: string;
  PesoActualDesmoldado?: number;
}

const DatosGenerales = () => {
  const { t } = useTranslation();
  const { websocketData } = useApp();
  const data = websocketData.data;

  const machineStatus: MachineStatus = data?.machineStatus || {};

  const {
    idRecetaProxima,
    CodigoProducto,
    TipoMolde,
    estadoMaquina,
    TiempoTranscurrido,
    PesoActualDesmoldado,
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
    <div className="w-full bg-background2 rounded-lg flex flex-col p-5">
      <p className="text-xl font-bold">{t("mayus.datosGenerales")}</p>
      <ul className="w-full list-none flex flex-col gap-5">
        {datosGenerales.map(({ id, texto, dato, icono: IconComponent }) => (
          <li key={id} className="w-full bg-background3 rounded-lg p-3">
            <div className="w-full flex justify-between items-center">
              <div>
                <p className="font-semibold">{texto}</p>
                <p className="text-sm">
                  {texto === t("min.pesoDesmoldado") ? `${dato} kg` : dato}
                </p>
              </div>
              <IconComponent
                className="text-texto p-[0.3rem] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.5)]"
                size={40}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatosGenerales;
