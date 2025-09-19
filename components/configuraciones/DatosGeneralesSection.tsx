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
    <div className="md:col-span-2">
      <ul className="list-none">
        {datosGeneralesDer.map(({ id, texto, dato }) => (
          <li key={id} className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {dato === "null" || dato === undefined || dato === null ? (
                  <div className="animate-pulse">
                    <h3 className="text-sm font-bold mb-2">{texto}</h3>
                    <EjemploSkeleton2 />
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-bold mb-1">{texto}</h3>
                    <h4 className="text-base">{dato}</h4>
                  </>
                )}
              </div>
              <BiCabinet className="w-6 h-6" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatosGeneralesSection;
