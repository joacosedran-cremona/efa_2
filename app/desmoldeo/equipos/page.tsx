"use client";
import { useTranslation } from "react-i18next";

import DatosGenerales from "@/components/desmoldeoEquipos/datosGenerales";
import DatosGripper from "@/components/desmoldeoEquipos/datosGripper";
import DatosTorre from "@/components/desmoldeoEquipos/datosTorre";
import DatosRobot from "@/components/desmoldeoEquipos/datosRobot";
import DatosSDDA from "@/components/desmoldeoEquipos/datosSDDA";
import EquipoImg from "@/components/desmoldeoEquipos/equipoImg";
import SectorIO from "@/components/desmoldeoEquipos/sectorIO";

const Equipos = () => {
  const { t } = useTranslation();

  return (
    <div className="flex p-5 gap-5">
      <div className="w-1/4 gap-5 flex flex-col">
        <DatosGenerales />
        <SectorIO />
      </div>

      <div className="w-2/4 flex flex-col justify-between">
        <span className="block text-xl font-bold tracking-wide uppercase">
          {t("mayus.datosDesmoldeo")}
        </span>
        <DatosRobot />
        <DatosSDDA />
        <DatosTorre />
        <DatosGripper />
      </div>

      <div className="w-1/4">
        <EquipoImg />
      </div>
    </div>
  );
};

export default Equipos;
