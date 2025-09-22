"use client";

import { BiReceipt } from "react-icons/bi";

import EjemploSkeleton2 from "./EjemploSkeleton2";
import SelectConfiguracion from "./SelectConfiguracion";

import { DatoReceta } from "@/types/configuraciones";

interface RecetasSectionProps {
  datosGeneralesIzq: DatoReceta[];
  selectedReceta: string;
  loading: boolean;
  onRecetaChange: (receta: string) => void;
  onRecetaApply: () => void;
}

const RecetasSection: React.FC<RecetasSectionProps> = ({
  datosGeneralesIzq,
  loading,
  onRecetaChange,
  onRecetaApply,
}) => {
  return (
    <div className="flex flex-col w-1/3 h-full bg-background2 p-5 rounded-lg gap-5">
      <SelectConfiguracion
        disabled={loading}
        onChange={onRecetaChange}
        onClick={onRecetaApply}
      />
      <ul className="flex flex-col h-full justify-between w-full">
        {datosGeneralesIzq.map(({ id, texto, dato }) => (
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
              <BiReceipt className="flex h-[7%] w-[7%]" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecetasSection;
