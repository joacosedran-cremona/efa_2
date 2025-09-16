"use client";

import AuthContext from "@/context/AuthContext";
import style from "./DatosTorre.module.css";
import textstyle from "../texto.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";

const DatosTorreComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado } = useContext(AuthContext);
  const { data } = useContext(AuthContext); // Obtiene datos del contexto
  const { t } = useTranslation();

  const initialDatosTorre = [
    { id: 1, texto: t('min.nroTorreActual'), dato: null },
    { id: 2, texto: t('mayus.totalNiveles'), dato: null },
    { id: 3, texto: t('min.nroTorreProxima'), dato: null },
  ];

  const [datosTorre, setDatosTorre] = useState(initialDatosTorre);

  useEffect(() => {
    const datosTorre = data?.[2]?.datosTorre;
    if (datosTorre) {
      const updatedDatosTorre = [
        { id: 1, texto: t('min.nroTorreActual'), dato: datosTorre.N_torre_actual ?? null },
        { id: 2, texto: t('min.totalNiveles'), dato: datosTorre.TotalNiveles ?? null },
        { id: 3, texto: t('min.nroTorreProxima'), dato: datosTorre.N_torre_proxima ?? null },
      ];
      setDatosTorre(updatedDatosTorre);
    }
  }, [data]);

  const handleClick = () => {
    setEquipoSeleccionado(equipoSeleccionado === "Posicionador de torres" ? null : "Posicionador de torres"); // Alterna la selección
  };

  return (
    <div
      className={`${style.datosGen} ${
        equipoSeleccionado === "Posicionador de torres" ? style.selected : ""
      }`}
      onClick={handleClick}
    >
      <h1 className={textstyle.titulo}>{t('mayus.datosTorre')}</h1>
      <div className={style.contenedorDatos}>
        {datosTorre.map(({ id, texto, dato }) => (
          <div key={id} className={style.datoList}>
            <div className={style.detallesDatos}>
              <div className={style.texto}>
                <h3 className={textstyle.subtitulo}>{texto}</h3>
                <h4 className={textstyle.h4}>{dato === null ? 'null' : dato.toString()}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosTorreComponent;
