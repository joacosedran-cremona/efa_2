"use client";

import AuthContext from "@/context/AuthContext";

// Styles
import style from './SectorIO.module.css';
import textstyle from '../texto.module.css';
import React, { useState, useEffect, useContext  } from 'react';

// Imágenes
import Image from "next/image";
import puntoGris from '@/assets/img/puntoGris.png';
import puntoVerde from '@/assets/img/puntoVerde.png';
import puntoA from '@/assets/img/puntoA.png';
import puntoB from '@/assets/img/puntoB.png';

import { useTranslation } from "react-i18next";

const SectorIOComponent = () => {
    const { t } = useTranslation();
    const { data } = useContext(AuthContext); // Obtiene datos del contexto
    
    const initialSectorIO = [
        { id: 1, texto: t('min.estadoCiclo'), dato: 0, icono: puntoGris },
        { id: 2, texto: t('min.bandaDesmoldeo'), dato: 0, icono: puntoGris },
    ];

    const [sector_IO, setSector_IO] = useState(initialSectorIO);

    useEffect(() => {
        if (data?.[2]?.sector_IO) {
            const estadoCiclo = data[2].sector_IO.estado_ciclo;
            const bandaDesmoldeo = data[2].sector_IO.banda_desmoldeo;
    
            const updatedSectorIO = sector_IO.map((item, index) => {
                let dato = 0;
                let icono = puntoGris; // Icono por defecto
    
                if (index === 0) {
                    dato = estadoCiclo === true ? 1 : 0;
                    icono = estadoCiclo === true ? puntoVerde : puntoGris;
    
                } else if (index === 1) {
                    dato = bandaDesmoldeo;
    
                    if (dato === "CINTA A") {
                        icono = puntoA;
                    } else if (dato === "CINTA B") {
                        icono = puntoB;
                    } else {
                        icono = puntoGris;
                    }
                }
    
                return {
                    ...item,
                    dato: dato,
                    icono: icono
                };
            });
    
            setSector_IO(updatedSectorIO);
        }
    }, [data]);    

    return (
        <div className={style.datoListContainer}>
            <h1 className={textstyle.titulo}>{t('mayus.sectorIO')}</h1>
            <div className={style.datosGen}>
                {sector_IO.map(({ id, texto, dato, icono }) => (
                    <div key={id} className={style.datoList}>
                        <div className={style.detallesDatos}>
                            <div className={style.texto}>
                                <h3 className={style.subtitulo}>{texto}</h3>
                            </div>
                            <Image 
                                src={icono} 
                                alt={`Estado: ${id}`} 
                                className={style.icon} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectorIOComponent;
