"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useApp } from "@/context/AppContext";

const DatosRobotComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado, websocketData } = useApp();
  const data = websocketData?.data ?? null;
  const { t } = useTranslation();

  type DatoRobot = {
    id: number;
    texto: string;
    dato: number | null;
    texto2: string;
  };

  const initialDatosRobot: DatoRobot[] = [
    { id: 1, texto: t("min.posicionX"), dato: null, texto2: " mm" },
    { id: 2, texto: t("min.posicionY"), dato: null, texto2: " mm" },
    { id: 3, texto: t("min.posicionZ"), dato: null, texto2: " mm" },
  ];

  const [datosRobot, setDatosRobot] = useState<DatoRobot[]>(initialDatosRobot);

  useEffect(() => {
    const robotData = data?.technicalData?.datosRobot;

    if (robotData) {
      const updatedDatosRobot = [
        {
          id: 1,
          texto: t("min.posicionX"),
          dato: (robotData.posicionX ?? null) as number | null,
          texto2: " mm",
        },
        {
          id: 2,
          texto: t("min.posicionY"),
          dato: (robotData.posicionY ?? null) as number | null,
          texto2: " mm",
        },
        {
          id: 3,
          texto: t("min.posicionZ"),
          dato: (robotData.posicionZ ?? null) as number | null,
          texto2: " mm",
        },
      ];

      setDatosRobot(updatedDatosRobot);
    }
  }, [data, t]);

  const handleClick = () => {
    setEquipoSeleccionado(equipoSeleccionado === "Robot" ? null : "Robot");
  };

  const isSelected = equipoSeleccionado === "Robot";

  const baseClasses =
    "w-full bg-background2 p-5 rounded-lg flex flex-col gap-3 transition-transform transition-shadow cursor-pointer hover:scale-[1.01] hover:shadow-[0_4px_8px_rgba(255,255,255,0.2)]";
  const hoverClasses =
    "hover:scale-[1.01] hover:shadow-[0px_4px_8px_rgba(255,255,255,0.2)]";
  const selectedClasses =
    "scale-[1.03] shadow-[0px_6px_12px_rgba(255,255,255,0.5)] border border-[#8c8c8c]";
  const selectedHover = "hover:scale-[1.02]";

  return (
    <button
      className={`${baseClasses} ${hoverClasses} ${isSelected ? `${selectedClasses} ${selectedHover}` : ""} text-left`}
      type="button"
      onClick={handleClick}
    >
      <p className="w-full text-[16px] font-bold tracking-[1px] m-0">
        {t("mayus.datosRobot")}
      </p>
      <div className="flex flex-row justify-between gap-5">
        {datosRobot.map(({ id, texto, dato }) => (
          <div
            key={id}
            className="w-full bg-background3 p-5 rounded-lg flex flex-col justify-center"
          >
            <p className="text-md font-medium">{texto}</p>
            <p className="text-sm">{dato === null ? "null" : `${dato} mm`}</p>
          </div>
        ))}
      </div>
    </button>
  );
};

export default DatosRobotComponent;
