"use client";
import style from './DatosRobot.module.css';
import textstyle from '../texto.module.css';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const DatosRobotComponent = () => {
  const { equipoSeleccionado, setEquipoSeleccionado } = useContext(AuthContext);
  const { data } = useContext(AuthContext); // Obtiene datos del contexto
  const { t } = useTranslation();

  const initialDatosRobot = [
    { id: 1, texto: t('min.posicionX'), dato: null, texto2: ' mm' },
    { id: 2, texto: t('min.posicionY'), dato: null, texto2: ' mm' },
    { id: 3, texto: t('min.posicionZ'), dato: null, texto2: ' mm' },
  ];

  const [datosRobot, setDatosRobot] = useState(initialDatosRobot);

  useEffect(() => {
    const robotData = data?.[2]?.datosRobot;
    if (robotData) {
      const updatedDatosRobot = [
        { id: 1, texto: t('min.posicionX'), dato: robotData.posicionX ?? null, texto2: ' mm' },
        { id: 2, texto: t('min.posicionY'), dato: robotData.posicionY ?? null, texto2: ' mm' },
        { id: 3, texto: t('min.posicionZ'), dato: robotData.posicionZ ?? null, texto2: ' mm' },
      ];
      setDatosRobot(updatedDatosRobot);
    }
  }, [data]);

  const handleClick = () => {
    setEquipoSeleccionado(equipoSeleccionado === "Robot" ? null : "Robot"); // Alterna la selección
  };

  return (
    <div
      className={`${style.datosGen} ${
        equipoSeleccionado === "Robot" ? style.selected : ""
      }`}
      onClick={handleClick}
    >
      <h1 className={textstyle.titulo}>{t('mayus.datosRobot')}</h1>
      <div className={style.contenedorDatos}>
        {datosRobot.map(({ id, texto, dato }) => (
          <div key={id} className={style.datoList}>
            <div className={style.detallesDatos}>
              <div className={style.texto}>
                <h3 className={textstyle.subtitulo}>{texto}</h3>
                <h4 className={textstyle.h4}>{dato === null ? 'null' : dato.toString()} mm</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatosRobotComponent;
