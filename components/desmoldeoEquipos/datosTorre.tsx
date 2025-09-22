"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useApp } from "@/context/AppContext";

const DatosTorreComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado, websocketData } = useApp();
  const data = websocketData?.data ?? null;
  const { t } = useTranslation();

  type DatoTorre = {
    id: number;
    texto: string;
    dato: number | null;
  };

  const initialDatosTorre: DatoTorre[] = [
    { id: 1, texto: t("min.nroTorreActual"), dato: null },
    { id: 2, texto: t("min.totalNiveles"), dato: null },
    { id: 3, texto: t("min.nroTorreProxima"), dato: null },
  ];

  const [datosTorre, setDatosTorre] = useState<DatoTorre[]>(initialDatosTorre);

  useEffect(() => {
    const torreData = data?.technicalData?.datosTorre;

    if (torreData) {
      const updatedDatosTorre = [
        {
          id: 1,
          texto: t("min.nroTorreActual"),
          dato: (torreData.N_torre_actual ?? null) as number | null,
        },
        {
          id: 2,
          texto: t("min.totalNiveles"),
          dato: (torreData.TotalNiveles ?? null) as number | null,
        },
        {
          id: 3,
          texto: t("min.nroTorreProxima"),
          dato: (torreData.N_torre_proxima ?? null) as number | null,
        },
      ];

      setDatosTorre(updatedDatosTorre);
    }
  }, [data, t]);

  const handleClick = () => {
    setEquipoSeleccionado(
      equipoSeleccionado === "Posicionador de torres"
        ? null
        : "Posicionador de torres",
    );
  };

  const isSelected = equipoSeleccionado === "Posicionador de torres";

  const baseClasses =
    "w-full bg-background2 p-5 rounded-lg flex flex-col transition-transform transition-shadow cursor-pointer hover:scale-[1.01] hover:shadow-[0_4px_8px_rgba(255,255,255,0.2)]";
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
      <h1 className="text-[16px] font-bold tracking-[1px] m-0">
        {t("mayus.datosTorre")}
      </h1>

      <div className="flex flex-row justify-between gap-5">
        {datosTorre.map(({ id, texto, dato }) => (
          <div
            key={id}
            className="w-full bg-background3 p-5 rounded-lg flex flex-col justify-center"
          >
            <h3 className="text-md font-medium">{texto}</h3>
            <h4 className="text-sm">{dato === null ? "null" : `${dato} mm`}</h4>
          </div>
        ))}
      </div>
    </button>
  );
};

export default DatosTorreComponent;
