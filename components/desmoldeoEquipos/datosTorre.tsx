"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

const DatosTorreComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado, websocketData } =
    useAuth();
  const data = websocketData?.data ?? null;
  const { t } = useTranslation();

  type DatoTorre = {
    id: number;
    texto: string;
    dato: number | null;
  };

  const initialDatosTorre: DatoTorre[] = [
    { id: 1, texto: t("min.nroTorreActual"), dato: null },
    { id: 2, texto: t("mayus.totalNiveles"), dato: null },
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
          texto: t("mayus.totalNiveles"),
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
        : "Posicionador de torres"
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full bg-[#131313] rounded-[15px] p-4 pb-5 mb-8 flex flex-col text-[#D9D9D9] transition-transform transition-shadow duration-300 cursor-pointer ${
        equipoSeleccionado === "Posicionador de torres"
          ? "scale-[1.03] shadow-[0px_6px_12px_rgba(255,255,255,0.5)] border border-[#8c8c8c]"
          : "hover:scale-[1.01] hover:shadow-[0px_4px_8px_rgba(255,255,255,0.2)]"
      }`}
    >
      <h1 className="text-[16px] font-bold tracking-[1px] m-0">
        {t("mayus.datosTorre")}
      </h1>

      <div className="flex flex-row justify-between mt-2 mb-2">
        {datosTorre.map(({ id, texto, dato }) => (
          <div
            key={id}
            className="w-[32%] py-2 px-5 bg-[#1F1F1F] rounded-[15px] flex flex-col"
          >
            <div className="flex-1">
              <div>
                <h3 className="text-sm font-bold m-0">{texto}</h3>
                <h4 className="text-xs m-0">
                  {dato === null ? "null" : dato.toString()}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosTorreComponent;
