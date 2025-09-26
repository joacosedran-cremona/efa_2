"use client";

import React, { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { TbCircleLetterAFilled, TbCircleLetterBFilled } from "react-icons/tb";
import { useTranslation } from "react-i18next";

import { useApp } from "@/context/AppContext";

const SectorIOComponent = () => {
  const { t } = useTranslation();
  const { websocketData } = useApp();
  const data = websocketData?.data ?? null;

  const initialSectorIO = [
    {
      id: 1,
      texto: t("min.estadoCiclo"),
      dato: 0,
      icono: <GoDotFill color="gray" />,
    },
    {
      id: 2,
      texto: t("min.bandaDesmoldeo"),
      dato: 0,
      icono: <GoDotFill color="gray" />,
    },
  ];

  const [sector_IO, setSector_IO] = useState(initialSectorIO);

  useEffect(() => {
    const sector = data?.technicalData?.sector_IO;

    if (sector) {
      const estadoCiclo = sector.estado_ciclo;
      const bandaDesmoldeo = sector.banda_desmoldeo;

      const updatedSectorIO = sector_IO.map((item, index) => {
        let dato: any = 0;
        let icono = <GoDotFill color="gray" />;

        if (index === 0) {
          dato = estadoCiclo === true ? 1 : 0;
          icono =
            estadoCiclo === true ? (
              <GoDotFill color="green" />
            ) : (
              <GoDotFill color="gray" />
            );
        } else if (index === 1) {
          dato = bandaDesmoldeo;
          if (dato === "CINTA A") {
            icono = <TbCircleLetterAFilled color="gray" />;
          } else if (dato === "CINTA B") {
            icono = <TbCircleLetterBFilled color="gray" />;
          } else {
            icono = <GoDotFill color="gray" />;
          }
        }

        return {
          ...item,
          dato: dato,
          icono: icono,
        };
      });

      setSector_IO(updatedSectorIO);
    }
  }, [data]);

  return (
    <div className="w-full bg-background2 rounded-lg p-5">
      <p className="font-bold">{t("mayus.sectorIO")}</p>
      <div className="w-full grid grid-cols-2 gap-5">
        {sector_IO.map(({ id, texto, icono }) => (
          <div
            key={id}
            className="w-full p-5 bg-background3 rounded-lg flex items-center justify-between"
          >
            <p className="text-base font-bold m-0 p-0">{texto}</p>
            {icono}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorIOComponent;
