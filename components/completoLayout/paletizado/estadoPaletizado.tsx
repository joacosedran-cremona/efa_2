"use client";

import { useTranslation } from "react-i18next";

const EstadoPaletizado = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="h-full w-full">
        <ul className="w-full h-full flex flex-col p-0 m-0 gap-2 text-[#d9d9d9] list-none">
          <li className="flex flex-col p-[0.4vw_0.8vw] rounded-lg bg-[#5a5a5a] max-h-[65px] h-full w-full transition-colors shadow-[6px_6px_6px_0px_rgba(0,0,0,0.45)]">
            <div className="w-full h-full">
              <h1 className="text-[1vw] font-semibold mb-1">
                {t("min.paletizado")}
              </h1>
              <h3 className="text-[0.9vw] font-semibold text-gray-300">
                {t("min.inactivo")}
              </h3>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default EstadoPaletizado;
