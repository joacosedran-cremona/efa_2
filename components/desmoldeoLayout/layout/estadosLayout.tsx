"use client";

import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "@/context/AuthContext";
import { GoDotFill } from "react-icons/go";

interface MachineStatusData {
  estadoMaquina?: string;
}

const EstadosLayout: React.FC = () => {
  const { t } = useTranslation();

  const { websocketData } = useContext(AuthContext);

  const machineStatus: MachineStatusData = {
    estadoMaquina:
      websocketData.data?.processData?.Desmoldeo?.estadoMaquina ||
      websocketData.data?.machineStatus?.estadoMaquina ||
      "CICLO INACTIVO",
  };

  const estadoMaquina = machineStatus.estadoMaquina;

  const getMachineState = (): {
    color: string;
    text: string;
    colorClass: string;
  } => {
    if (estadoMaquina === "CICLO ACTIVO") {
      return {
        color: "#10b981",
        text: t("mayus.cicloActivo"),
        colorClass: "text-green-600",
      };
    } else if (estadoMaquina === "CICLO PAUSADO") {
      return {
        color: "#4b5563",
        text: t("mayus.cicloPausado"),
        colorClass: "text-gray-600",
      };
    } else if (estadoMaquina === "CICLO INACTIVO" || !estadoMaquina) {
      return {
        color: "#b92400",
        text: t("mayus.cicloInactivo"),
        colorClass: "text-[#b92400]",
      };
    } else {
      return {
        color: "#4b5563",
        text: t("min.cargando"),
        colorClass: "text-gray-600",
      };
    }
  };

  const machineState = getMachineState();

  return (
    <div className="mt-0 mb-0 ml-10">
      <ul className="list-none">
        <li>
          <div className="flex flex-row items-center">
            <GoDotFill
              color={machineState.color}
              className="w-[15px] h-[15px] my-[5px] -ml-[5px]"
              aria-label={t("min.estadoMaquina")}
            />
            <h3 className={`font-semibold ${machineState.colorClass}`}>
              {machineState.text}
            </h3>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default EstadosLayout;
