"use client";

import { useTranslation } from "react-i18next";

const DatosEncajonado = () => {
  const { t } = useTranslation();

  const datosTiempoReal = [
    {
      id: 1,
      nombre: `${t('min.encajonado')} - N°1`,
    },
    {
      id: 2,
      nombre: `${t('min.encajonado')} - N°2`,
    },
    {
      id: 3,
      nombre: `${t('min.encajonado')} - N°3`,
    },
  ];

  return (
    <>
      <ul className="w-full h-full flex flex-col p-0 m-0 gap-2 text-[#d9d9d9] list-none">
        {datosTiempoReal.map(({ id, nombre }) => (
          <li
            key={id}
            className="h-full w-full flex text-center justify-center p-[1vw] rounded-lg bg-[#555555] transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)] pointer-events-none"
          >
            <div className="flex w-full h-full">
              <h3 className="text-[0.9vw] h-full w-full p-0 m-0 text-gray-500 transition-colors">
                {nombre}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DatosEncajonado;
