"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/AuthContext";

const DatosGripperComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado, websocketData } =
    useAuth();
  const { t } = useTranslation();

  const data = websocketData?.data ?? null;

  const initialdatosGripper = [
    { id: 1, texto: t("min.nroGripperActual"), dato: null },
    { id: 2, texto: t("min.nroGripperProximo"), dato: null },
  ];

  const [datosGripper, setdatosGripper] = useState(initialdatosGripper);

  useEffect(() => {
    const gripperData =
      data?.technicalData?.datosGripper ??
      (Array.isArray(data) ? data[2]?.datosGripper : undefined);

    if (gripperData) {
      const updateddatosGripper = [
        {
          id: 1,
          texto: t("min.nroGripperActual"),
          dato: gripperData.NGripperActual ?? null,
        },
        {
          id: 2,
          texto: t("min.nroGripperProximo"),
          dato: gripperData.NGripperProximo ?? null,
        },
      ];

      setdatosGripper(updateddatosGripper);
    }
  }, [data, t]);

  const handleClick = () => {
    setEquipoSeleccionado(
      equipoSeleccionado === "Gripper" ||
        equipoSeleccionado === "Estación de grippers"
        ? null
        : "Gripper",
    );
  };

  const isSelected =
    equipoSeleccionado === "Gripper" ||
    equipoSeleccionado === "Estación de grippers";

  const baseClasses =
    "w-full bg-background2 p-5 rounded-lg flex flex-col transition-transform transition-shadow duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-[0_4px_8px_rgba(255,255,255,0.2)]";
  const hoverClasses =
    "hover:scale-[1.01] hover:shadow-[0px_4px_8px_rgba(255,255,255,0.2)]";
  const selectedClasses =
    "scale-[1.03] shadow-[0px_6px_12px_rgba(255,255,255,0.5)] border border-[#8c8c8c]";
  const selectedHover = "hover:scale-[1.02]";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${isSelected ? `${selectedClasses} ${selectedHover}` : ""}`}
      onClick={handleClick}
    >
      <h1 className="text-[16px] font-bold tracking-[1px] m-0">
        {t("mayus.datosGripper")}
      </h1>
      <div className="flex flex-row justify-between gap-5">
        {datosGripper.map(({ id, texto, dato }) => (
          <div
            key={id}
            className="w-full bg-background3 p-5 rounded-lg flex flex-col justify-center"
          >
            <h3 className="text-md font-medium">{texto}</h3>
            <h4 className="text-sm">{dato === null ? "null" : `${dato} mm`}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosGripperComponent;
