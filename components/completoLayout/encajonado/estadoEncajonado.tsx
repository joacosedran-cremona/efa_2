"use client";

import { useTranslation } from "react-i18next";

const EstadoEncajonado = () => {
  const { t } = useTranslation();

  return (
    <ul className="w-full h-full flex flex-col p-0 m-0 gap-2 list-none text-[#d9d9d9]">
      <li className="flex flex-col p-2 rounded-lg bg-[#5a5a5a] max-h-[65px] h-full w-full transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
        <div className="w-full h-full">
          <h1 className="text-[1rem] font-semibold">{t("mayus.encajonado")}</h1>
          <h3 className="text-[1rem] font-semibold">
            {t("mayus.cicloInactivo")}
          </h3>
        </div>
      </li>
    </ul>
  );
};

export default EstadoEncajonado;
