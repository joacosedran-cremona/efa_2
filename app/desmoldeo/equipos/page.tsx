"use client";
//components
import DatosGenerales from "@/components/desmoldeoEquipos/datosGenerales";
import DatosGripper from "@/components/desmoldeoEquipos/datosGripper";
import DatosTorre from "@/components/desmoldeoEquipos/datosTorre";
import DatosRobot from "@/components/desmoldeoEquipos/datosRobot";
import DatosSDDA from "@/components/desmoldeoEquipos/datosSDDA";
import EquipoImg from "@/components/desmoldeoEquipos/equipoImg";
import SectorIO from "@/components/desmoldeoEquipos/sectorIO";
import { useTranslation } from "react-i18next";

import style from "./EquipoX.module.css";

const EquipoX = () => {
  const { t } = useTranslation();
  return (
    <div className={style.all}>
      <div className={style.Izq}>
        <DatosGenerales />
        <SectorIO />
      </div>

      <div className={style.Med}>
        <span className={style.titulo}>{t("mayus.datosDesmoldeo")}</span>
        <DatosRobot />
        <DatosSDDA />
        <DatosTorre />
        <DatosGripper />
      </div>

      <div className={style.Der}>
        <EquipoImg />
      </div>
    </div>
  );
};

export default EquipoX;
