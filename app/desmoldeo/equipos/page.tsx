"use client";
import DatosGenerales from "@/components/desmoldeoEquipos/datosGenerales";
import DatosGripper from "@/components/desmoldeoEquipos/datosGripper";
import DatosTorre from "@/components/desmoldeoEquipos/datosTorre";
import DatosRobot from "@/components/desmoldeoEquipos/datosRobot";
import DatosSDDA from "@/components/desmoldeoEquipos/datosSDDA";
import EquipoImg from "@/components/desmoldeoEquipos/equipoImg";
import SectorIO from "@/components/desmoldeoEquipos/sectorIO";
import { useTranslation } from "react-i18next";

const Equipos = () => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-6 items-start h-full">
      <div className="w-1/4 space-y-4">
        <DatosGenerales />
        <SectorIO />
      </div>

      <div className="flex-1 space-y-4">
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
