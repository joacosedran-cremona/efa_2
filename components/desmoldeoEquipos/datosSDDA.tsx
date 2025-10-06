"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useApp } from "@/context/AppContext";

const DatosSDDAComponent = () => {
  const { t } = useTranslation();
  const { equipoSeleccionado, setEquipoSeleccionado, websocketData } = useApp();
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
          texto2: "",
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

  const isSelected = equipoSeleccionado === "SDDA";

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
      <p className="text-[16px] font-bold tracking-[1px] m-0">
        {t("mayus.datosSDDA")}
      </p>

      <div className="flex flex-row justify-between gap-5">
        {datosSdda.map(({ id, texto, dato, texto2 }) => (
          <div
            key={id}
            className="w-full bg-background3 p-5 rounded-lg flex flex-col justify-center"
          >
            <p className="text-md font-medium">{texto}</p>
            <p className="text-sm">
              {dato === null ? "null" : `${dato} ${texto2}`}
            </p>
          </div>
        ))}
      </div>
    </button>
  );
};

export default DatosSDDAComponent;
