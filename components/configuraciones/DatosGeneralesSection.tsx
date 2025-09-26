"use client";

import { BiCabinet } from "react-icons/bi";

import EjemploSkeleton2 from "./EjemploSkeleton2";

import { DatoReceta } from "@/types/configuraciones";

interface DatosGeneralesSectionProps {
  datosGeneralesDer: DatoReceta[];
}

const DatosGeneralesSection: React.FC<DatosGeneralesSectionProps> = ({
  datosGeneralesDer,
}) => {
  return (
    <div className="flex flex-col w-1/3 h-full bg-background2 p-5 rounded-lg gap-5">
      <h2 className="text-xl font-semibold">Datos Generales</h2>
      <ul className="flex flex-col h-full justify-between w-full gap-5">
        {datosGeneralesDer.map(({ id, texto, dato }) => (
          <li key={id} className="">
            <div className="flex flex-row bg-background3 items-center justify-between p-2 rounded-lg">
              {dato === "null" || dato === undefined || dato === null ? (
                <div className="flex flex-col">
                  <h3 className="">{texto}</h3>
                  <EjemploSkeleton2 />
                </div>
              ) : (
                <div className="flex flex-col">
                  <h3 className="">{texto}</h3>
                  <h4 className="">{dato}</h4>
                </div>
              )}
              <BiCabinet className="flex h-[7%] w-[7%]" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatosGeneralesSection;
