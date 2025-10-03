"use client";

import { useState, useEffect, useContext } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";

import AppContext from "@/context/AppContext";
import ImgCeldaGeneral1 from "@/public/equipos/CELDAGENERAL.png";
import ImgGripper1 from "@/public/equipos/Equipo_Gripper1.png";
import ImgGripper2 from "@/public/equipos/Equipo_Gripper2.png";
import ImgGripper3 from "@/public/equipos/Equipo_Gripper3.png";
import ImgGripper4 from "@/public/equipos/Equipo_Gripper4.png";
import ImgGripper5 from "@/public/equipos/Equipo_Gripper5.png";
import ImgGripper6 from "@/public/equipos/Equipo_Gripper6.png";
import ImgSDDA1 from "@/public/equipos/Equipo_SDDA1.png";
import ImgSDDA2 from "@/public/equipos/Equipo_SDDA2.png";
import ImgSDDA3 from "@/public/equipos/Equipo_SDDA3.png";
import ImgSDDA4 from "@/public/equipos/Equipo_SDDA4.png";
import ImgRobot1 from "@/public/equipos/Equipo_Robot1.png";
import ImgRobot2 from "@/public/equipos/Equipo_Robot2.png";
import ImgRobot3 from "@/public/equipos/Equipo_Robot3.png";
import ImgTorre1 from "@/public/equipos/Equipo_Torre3.png";
import ImgTorre2 from "@/public/equipos/Equipo_Torre2.png";
import ImgTorre3 from "@/public/equipos/Equipo_Torre1.png";

type ImageItem = {
  src: StaticImageData;
  alt: string;
};

const gripperImages: ImageItem[] = [
  { src: ImgGripper1, alt: "Gripper | Imagen-1" },
  { src: ImgGripper2, alt: "Gripper | Imagen-2" },
  { src: ImgGripper3, alt: "Gripper | Imagen-3" },
  { src: ImgGripper4, alt: "Gripper | Imagen-4" },
  { src: ImgGripper5, alt: "Gripper | Imagen-5" },
  { src: ImgGripper6, alt: "Gripper | Imagen-6" },
];

const imageSets: Record<string, ImageItem[]> = {
  Default: [{ src: ImgCeldaGeneral1, alt: "Celda General | Imagen-1" }],
  Gripper: gripperImages,
  "Estación de grippers": gripperImages,
  "Posicionador de torres": [
    { src: ImgTorre3, alt: "Posicionador de torres | Imagen-3" },
    { src: ImgTorre1, alt: "Posicionador de torres | Imagen-1" },
    { src: ImgTorre2, alt: "Posicionador de torres | Imagen-2" },
  ],
  Robot: [
    { src: ImgRobot1, alt: "Robot | Imagen-1" },
    { src: ImgRobot2, alt: "Robot | Imagen-2" },
    { src: ImgRobot3, alt: "Robot | Imagen-3" },
  ],
  SDDA: [
    { src: ImgSDDA1, alt: "SDDA | Imagen-1" },
    { src: ImgSDDA2, alt: "SDDA | Imagen-2" },
    { src: ImgSDDA3, alt: "SDDA | Imagen-3" },
    { src: ImgSDDA4, alt: "SDDA | Imagen-4" },
  ],
};

const EquiposImg = () => {
  const { t } = useTranslation();
  const { equipoSeleccionado } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [equipoSeleccionado]);

  const key = (equipoSeleccionado ?? "Default") as string;
  const images: ImageItem[] = imageSets[key] ?? imageSets["Default"];
  const totalImages = images.length;

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1,
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1,
    );
  };

  // Determinar la clave de traducción basada en equipoSeleccionado
  let titleKey: string;
  if (typeof equipoSeleccionado === "string") {
    if (["Default", "BandaA", "BandaB"].includes(equipoSeleccionado)) {
      titleKey = "equipos.celdaDesmoldeo";
    } else if (equipoSeleccionado === "Estación de grippers") {
      titleKey = "equipos.gripper";
    } else {
      titleKey = `equipos.${equipoSeleccionado.toLowerCase().replace(/\s+/g, '')}`; // Remover espacios para claves como "posicionadordetorres"
    }
  } else {
    titleKey = "equipos.celdaDesmoldeo";
  }

  const title = t(titleKey);

  return (
    <div className="text-center bg-background2 rounded-lg h-full flex flex-col p-5 justify-between">
      <p className="text-[21px] font-bold tracking-[1px]">{title}</p>

      <div className="max-w-[600px] overflow-hidden rounded-lg relative">
        {totalImages > 0 ? (
          <>
            {totalImages > 1 && (
              <button
                aria-label="Anterior imagen"
                className="bg-transparent border-none text-[2rem] cursor-pointer absolute top-1/2 left-0 -translate-y-1/2 z-10 focus:outline-none"
                onClick={prevImage}
              >
                ❮
              </button>
            )}

            <div
              className="flex transition-transform"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images.map((image: ImageItem, index: number) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Image
                    alt={image.alt}
                    className="w-full max-h-full object-contain rounded-lg"
                    src={image.src}
                  />
                </div>
              ))}
            </div>

            {totalImages > 1 && (
              <button
                aria-label="Siguiente imagen"
                className="bg-transparent border-none text-[2rem] cursor-pointer absolute top-1/2 right-0 -translate-y-1/2 z-10 focus:outline-none"
                onClick={nextImage}
              >
                ❯
              </button>
            )}
          </>
        ) : (
          <p className="text-white">Selecciona un equipo para ver imágenes</p>
        )}
      </div>

      {totalImages > 0 && (
        <div className="flex justify-center gap-5">
          {images.map((_, index: number) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={index}
                aria-label={`Ir a imagen ${index + 1}`}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                  isActive ? "bg-textohover" : "bg-textodesac hover:bg-[#aaa]"
                }`}
                tabIndex={0}
                onClick={() => setCurrentIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCurrentIndex(index);
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EquiposImg;
