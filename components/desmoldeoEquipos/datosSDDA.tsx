"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const DatosSDDAComponent = () => {
  const { t } = useTranslation();
  const { equipoSeleccionado, setEquipoSeleccionado, websocketData } =
    useAuth();
  const data = websocketData?.data ?? null;

  type DatoSdda = {
    id: number;
    texto: string;
    dato: number | null;
    texto2?: string;
  };

  const initialdatosSdda: DatoSdda[] = [
    { id: 1, texto: t("min.nivelActual"), dato: null },
    { id: 2, texto: t("min.SDDALong"), dato: null, texto2: " mm" },
    { id: 3, texto: t("min.SDDAVertical"), dato: null, texto2: " mm" },
  ];

  const [datosSdda, setdatosSdda] = useState<DatoSdda[]>(initialdatosSdda);

  useEffect(() => {
    const sdda = data?.technicalData?.datosSdda;
    if (sdda) {
      const updateddatosSdda = [
        {
          id: 1,
          texto: t("min.nivelActual"),
          dato: (sdda.sdda_nivel_actual ?? null) as number | null,
        },
        {
          id: 2,
          texto: t("min.SDDALong"),
          dato: (sdda.sdda_long_mm ?? null) as number | null,
          texto2: " mm",
        },
        {
          id: 3,
          texto: t("min.SDDAVertical"),
          dato: (sdda.sdda_vertical_mm ?? null) as number | null,
          texto2: " mm",
        },
      ];
      setdatosSdda(updateddatosSdda);
    }
  }, [data, t]);

  const handleClick = () => {
    setEquipoSeleccionado(equipoSeleccionado === "SDDA" ? null : "SDDA");
  };

  const baseCard =
    "w-full bg-[#131313] rounded-[15px] p-[10px] pb-[20px] mb-7 flex flex-col text-[#D9D9D9] transition-transform transition-shadow duration-300 ease cursor-pointer hover:shadow-[0_4px_8px_rgba(255,255,255,0.2)] hover:scale-[1.01]";
  const selectedCard =
    "scale-[1.03] shadow-[0_6px_12px_rgba(255,255,255,0.5)] border border-[#8c8c8c]";

  return (
    <div
      className={`${baseCard} ${
        equipoSeleccionado === "SDDA" ? selectedCard : ""
      }`}
      onClick={handleClick}
    >
      <h1 className="text-[16px] font-bold tracking-[1px] m-0 p-0 uppercase text-[#D9D9D9]">
        {t("mayus.datosSDDA")}
      </h1>

      <div className="flex flex-row justify-between mt-2 mb-2 w-full">
        {datosSdda.map(({ id, texto, texto2, dato }) => (
          <div
            key={id}
            className="w-[32%] p-[10px] bg-[#1F1F1F] rounded-[15px] flex flex-col justify-center"
          >
            <div className="flex flex-row justify-between items-center">
              <div>
                <h3 className="text-[0.8vw] font-bold m-0 p-0 text-[#D9D9D9]">
                  {texto}
                </h3>
                <h4 className="text-[0.7vw] m-0 p-0 text-[#D9D9D9]">
                  {dato === null ? "null" : `${dato.toString()}${texto2 ?? ""}`}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosSDDAComponent;
