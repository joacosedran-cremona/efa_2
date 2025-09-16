"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

const DatosRobotComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado, websocketData } =
    useAuth();
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

  const baseCardClasses =
    "w-full bg-[#131313] rounded-[15px] px-5 pt-2.5 pb-5 my-7 flex flex-col text-[#D9D9D9] transition-transform transition-shadow duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-[0_4px_8px_rgba(255,255,255,0.2)]";
  const selectedClasses =
    "scale-[1.03] shadow-[0_6px_12px_rgba(255,255,255,0.5)] border border-[#8c8c8c] hover:scale-[1.02]";

  return (
    <div
      className={`${baseCardClasses} ${
        equipoSeleccionado === "Robot" ? selectedClasses : ""
      }`}
      onClick={handleClick}
    >
      <h1 className="text-xl font-semibold">{t("mayus.datosRobot")}</h1>
      <div className="flex flex-row justify-between mt-2.5 mb-2.5">
        {datosRobot.map(({ id, texto, dato }) => (
          <div
            key={id}
            className="w-[32%] bg-[#1F1F1F] rounded-[15px] px-5 py-2.5 flex flex-col justify-center"
          >
            <div className="flex flex-row justify-between items-center">
              <div>
                <h3 className="text-md font-medium">{texto}</h3>
                <h4 className="text-sm text-gray-300">
                  {dato === null ? "null" : `${dato} mm`}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosRobotComponent;
