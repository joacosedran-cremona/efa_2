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
    <div className="flex flex-col">
      <SelectConfiguracion
        disabled={loading}
        onChange={onRecetaChange}
        onClick={onRecetaApply}
      />
      <ul className="list-none p-0">
        {datosGeneralesIzq.map(({ id, texto, dato }) => (
          <li key={id} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="mr-4">
                {dato === "null" || dato === undefined || dato === null ? (
                  <>
                    <h3 className="text-sm font-bold">{texto}</h3>
                    <EjemploSkeleton2 />
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold">{texto}</h3>
                    <h4 className="text-base">{dato}</h4>
                  </>
                )}
              </div>
              <BiReceipt className="w-6 h-6" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecetasSection;
