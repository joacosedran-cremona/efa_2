"use client";

import { useTranslation } from "react-i18next";

const DatosPaletizado = () => {
  const { t } = useTranslation();

  const datosTiempoReal = [
    {
      id: 1,
      nombre: `${t("min.paletizado")} - N°1`,
    },
    {
      id: 2,
      nombre: `${t("min.paletizado")} - N°2`,
    },
    {
      id: 3,
      nombre: `${t("min.paletizado")} - N°3`,
    },
  ];

  return (
    <>
      <ul className="w-full h-full flex flex-col p-0 m-0 gap-2 text-[#d9d9d9] list-none">
        {datosTiempoReal.map(({ id, nombre }) => (
          <li
            key={id}
            className="h-full w-full flex items-center justify-center rounded-lg bg-[#555555] text-lightgrey transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] pointer-events-none"
          >
            {nombre}
          </li>
        ))}
      </ul>
    </>
  );
};

export default DatosPaletizado;
