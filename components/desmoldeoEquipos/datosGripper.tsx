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
        : "Gripper"
    );
  };

  const isSelected =
    equipoSeleccionado === "Gripper" ||
    equipoSeleccionado === "Estación de grippers";

  const baseClasses =
    "w-full bg-[#131313] rounded-[15px] px-5 pt-2.5 pb-5 flex flex-col text-[#D9D9D9] transition-transform transition-shadow duration-300 ease-in-out cursor-pointer";
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
      <h1 className="text-xl font-semibold">{t("mayus.datosGripper")}</h1>
      <div className="flex flex-row mt-2.5 mb-2.5 gap-2.5">
        {datosGripper.map(({ id, texto, dato }) => (
          <div
            key={id}
            className="h-[120%] w-1/2 px-5 py-2.5 bg-[#1F1F1F] rounded-[15px] flex flex-col justify-center"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">{texto}</h3>
                <h4 className="text-sm">
                  {dato === null ? "null" : String(dato)}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosGripperComponent;
