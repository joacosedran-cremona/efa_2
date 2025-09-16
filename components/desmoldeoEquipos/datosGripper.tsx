"use client";

import style from "./DatosGripper.module.css";
import textstyle from "../texto.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";

import AuthContext from "@/context/AuthContext";

const DatosGripperComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado } = useContext(AuthContext);
  const { data } = useContext(AuthContext); // Obtiene datos del contexto
  const { t } = useTranslation();

  const initialdatosGripper = [
    { id: 1, texto: t('min.nroGripperActual'), dato: null },
    { id: 2, texto: t('min.nroGripperProximo'), dato: null },
  ];

  const [datosGripper, setdatosGripper] = useState(initialdatosGripper);

  useEffect(() => {
    const gripperData = data?.[2]?.datosGripper;
    if (gripperData) {
      const updateddatosGripper = [
        { id: 1, texto: t('min.nroGripperActual'), dato: gripperData.NGripperActual ?? null },
        { id: 2, texto: t('min.nroGripperProximo'), dato: gripperData.NGripperProximo ?? null }
      ];
      setdatosGripper(updateddatosGripper);
    }
  }, [data]);

  const handleClick = () => {
    setEquipoSeleccionado(
      equipoSeleccionado === "Gripper" || equipoSeleccionado === "Estación de grippers"
        ? null
        : "Gripper"
    );
  };

  return (
    <div
      className={`${style.datosGen} ${
        equipoSeleccionado === "Gripper" || equipoSeleccionado === "Estación de grippers"
          ? style.selected
          : ""
      }`}
      onClick={handleClick}
    >
      <h1 className={textstyle.titulo}>{t('mayus.datosGripper')}</h1>
      <div className={style.contenedorDatos}>
        {datosGripper.map(({ id, texto, dato }) => (
          <div key={id} className={style.datoList}>
            <div className={style.detallesDatos}>
              <div className={style.texto}>
                <h3 className={textstyle.subtitulo}>{texto}</h3>
                <h4 className={textstyle.h4}>{dato === null ? "null" : dato.toString()}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosGripperComponent;