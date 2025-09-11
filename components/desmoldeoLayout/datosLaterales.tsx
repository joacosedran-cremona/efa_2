"use client";

import Image from "next/image";
import receta1 from "@/assets/img/RECETA.png";
import receta2 from "@/assets/img/RECETA2.png";
import torre from "@/assets/img/TORRE.png";
import nivelactual from "@/assets/img/NIVELACTUAL.png";
import molde from "@/assets/img/MOLDE.png";
import peso from "@/assets/img/PESO.png";
import tiempo from "@/assets/img/TIEMPO.png";
import gripper from "@/assets/img/GRIPPER.png";

import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import React, { useState, useEffect, useRef } from "react";
import style from "./NavDatos.module.css";
import Link from "next/link";

const NavDatos = () => {
  const { data } = useContext(AuthContext); // Obtiene datos del contexto

  const {
    idRecetaActual,
    idRecetaProxima,
    CodigoProducto,
    TotalNiveles,
    TipoMolde,
    estadoMaquina,
    desmoldeoBanda,
    PesoProducto,
    TiempoTranscurrido,
    sdda_nivel_actual,
    NGripperActual,
    PesoActualDesmoldado,
    TorreActual,
  } = data?.[0] || {};

  const opcionesAlarma = [
    { id: 1, nombre: "LAYOUT" },
    { id: 2, nombre: "PRODUCTIVIDAD" },
    { id: 3, nombre: "GRAFICOS HISTORICOS" },
  ];

  const datosTiempoReal = [
    {
      id: 1,
      nombre: "Nombre receta",
      dato: CodigoProducto !== null ? CodigoProducto : "null",
      icono: receta1,
    },
    {
      id: 2,
      nombre: "ID Proxima receta",
      dato: idRecetaProxima !== null ? idRecetaProxima : "null",
      icono: receta2,
    },
    {
      id: 3,
      nombre: "N° Gripper actual",
      dato: NGripperActual !== null ? NGripperActual : "null",
      icono: gripper,
    },
    {
      id: 4,
      nombre: "Peso por fila",
      dato: PesoProducto !== null ? PesoProducto : "null",
      icono: peso,
    },
    {
      id: 5,
      nombre: "Peso desmoldado",
      dato: PesoActualDesmoldado !== null ? PesoActualDesmoldado : "null",
      icono: peso,
    },
    {
      id: 6,
      nombre: "N° Torre actual",
      dato: TorreActual !== null ? TorreActual : "null",
      icono: torre,
    },
    {
      id: 7,
      nombre: "Torre nivel actual",
      dato:
        (sdda_nivel_actual !== null ? sdda_nivel_actual : "null") +
        "/" +
        (TotalNiveles !== null ? TotalNiveles : "null"),
      icono: nivelactual,
    },
    {
      id: 8,
      nombre: "N° Molde",
      dato: TipoMolde !== null ? TipoMolde : "null",
      icono: molde,
    },
    {
      id: 9,
      nombre: "Tiempo transcurrido",
      dato: TiempoTranscurrido !== null ? TiempoTranscurrido : "00:00 mm:ss",
      icono: tiempo,
    },
  ];

  const [activeSection, setActiveSection] = useState(1);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        let closestSection = null;
        let closestDistance = Infinity;

        opcionesAlarma.forEach(({ id }) => {
          const section = document.getElementById(`section${id}`);
          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;

            const offsetMargin = 200;
            const distanceFromTop = Math.abs(sectionTop);

            if (
              sectionTop < window.innerHeight + offsetMargin &&
              sectionBottom >= 0 - offsetMargin
            ) {
              if (distanceFromTop < closestDistance) {
                closestDistance = distanceFromTop;
                closestSection = id;
              }
            }
          }
        });

        if (closestSection) {
          setActiveSection(closestSection);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(debounceTimeout.current);
    };
  }, []);

  const handleScrollClick = (id) => {
    const section = document.getElementById(`section${id}`);
    if (section) {
      const offset = -133;
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(id);
    }
  };

  return (
    <div className={style.nav}>
      <ul className={style.navList}>
        {opcionesAlarma.map(({ id, nombre }) => (
          <li
            key={id}
            className={`${style.navItem} ${activeSection === id ? style.active : ""}`}
          >
            <Link
              href={`#section${id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollClick(id);
              }}
              className={style.navLink}
            >
              {nombre}
            </Link>
          </li>
        ))}
      </ul>

      <hr className={style.linea}></hr>

      <div className={style.contenedorDatos}>
        <p className={style.datosGen}>DATOS GENERALES</p>
        <ul className={style.datosTods}>
          {datosTiempoReal.map(({ id, nombre, dato, icono }) => (
            <li key={id} className={style.datosIndv}>
              <Link className={style.detallesDatos} href="/desmoldeo/equipox">
                <h3 className={style.h3}>{nombre}</h3>
                <h4 className={style.h4}>{dato}</h4>
              </Link>
              <Image src={icono} alt={`Estado: ${id}`} className={style.icon} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavDatos;
