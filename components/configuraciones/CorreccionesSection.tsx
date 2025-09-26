"use client";

import type { DatoCorreccion, Torre, TipoNivel } from "@/types/configuraciones";

import React from "react";
import { toast } from "sonner";

import EjemploSkeleton2 from "./EjemploSkeleton2";
import SelectTorre from "./SelectTorre";
import SelectNivel from "./SelectNivel";
import BotonAplicar2 from "./BotonAplicar2";
import BotonResetear from "./BotonResetear";
import BotonRefresh from "./BotonRefresh";

import { configuracionesApi } from "@/services/configuracionesApi";
import { validacionesConfiguraciones } from "@/utils/configuraciones/validaciones";

interface CorreccionesSectionProps {
  selectedOption: number;
  selectedNivel: TipoNivel;
  selectedTorre: string | null;
  selectedReceta: string;
  datosActuales: DatoCorreccion[];
  loading: boolean;
  isButtonDisabled: boolean;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  datosGeneralesIzq: any[];

  handleOptionChange: (option: number) => void;
  handleNivelChange: (nivel: TipoNivel) => void;
  handleTorreChange: (torre: string) => void;
  handleTorresChange: (torres: Torre[]) => void;
  validarTAGDuplicado: (value: string) => string;
  refreshData: () => void;
}

const opcionesCorrecciones = [
  { id: 1, nombre: "TORRE" },
  { id: 2, nombre: "NIVEL" },
];

const CorreccionesSection: React.FC<CorreccionesSectionProps> = ({
  selectedOption,
  selectedNivel,
  selectedTorre,
  selectedReceta,
  datosActuales,
  loading,
  isButtonDisabled,
  inputRefs,
  datosGeneralesIzq,
  handleOptionChange,
  handleNivelChange,
  handleTorreChange,
  handleTorresChange,
  validarTAGDuplicado,
  refreshData,
}) => {
  const handleAplicarTorre = async () => {
    const inputValues = validacionesConfiguraciones.procesarValoresInput(
      inputRefs.current || [],
      5
    );

    const finalData = {
      id: selectedTorre!,
      hBastidor: typeof inputValues[0] === "number" ? inputValues[0] : null,
      hAjuste: typeof inputValues[1] === "number" ? inputValues[1] : null,
      hAjusteN1: typeof inputValues[2] === "number" ? inputValues[2] : null,
      DisteNivel: typeof inputValues[3] === "number" ? inputValues[3] : null,
      ActualizarTAG: (inputValues[4] as string) || "",
      id_recetario: selectedReceta,
    };

    try {
      await configuracionesApi.enviarDatosTorre(finalData);

      toast.success("Datos de la torre corregidos exitosamente", {
        position: "bottom-center",
      });
      refreshData();
    } catch {
      toast.error("Error al enviar los datos de la torre", {
        position: "bottom-center",
      });
    }
  };

  const handleAplicarNiveles = async () => {
    const inputValues = validacionesConfiguraciones.procesarValoresInput(
      inputRefs.current || [],
      11
    );

    const finalData = {
      id: selectedTorre!,
      tipo: selectedNivel,
      Correccion1: typeof inputValues[0] === "number" ? inputValues[0] : null,
      Correccion2: typeof inputValues[1] === "number" ? inputValues[1] : null,
      Correccion3: typeof inputValues[2] === "number" ? inputValues[2] : null,
      Correccion4: typeof inputValues[3] === "number" ? inputValues[3] : null,
      Correccion5: typeof inputValues[4] === "number" ? inputValues[4] : null,
      Correccion6: typeof inputValues[5] === "number" ? inputValues[5] : null,
      Correccion7: typeof inputValues[6] === "number" ? inputValues[6] : null,
      Correccion8: typeof inputValues[7] === "number" ? inputValues[7] : null,
      Correccion9: typeof inputValues[8] === "number" ? inputValues[8] : null,
      Correccion10: typeof inputValues[9] === "number" ? inputValues[9] : null,
      Correccion11:
        typeof inputValues[10] === "number" ? inputValues[10] : null,
    };

    try {
      await configuracionesApi.enviarDatosNiveles(finalData);
      toast.success("Datos de niveles corregidos exitosamente", {
        position: "bottom-center",
      });
      refreshData();
    } catch {
      toast.error("Error al enviar los datos de niveles", {
        position: "bottom-center",
      });
    }
  };

  const handleAplicarReset = async (index: number) => {
    const correcciones = validacionesConfiguraciones.crearObjetoCorrecciones(
      11,
      index,
      0
    );

    const datos = {
      id: selectedTorre!,
      tipo: "Fallas",
      ...correcciones,
    };

    try {
      await configuracionesApi.resetearFallasNivel(datos);
      toast.success("Falla reseteada exitosamente", {
        position: "bottom-center",
      });
      refreshData();
    } catch {
      toast.error("Error al resetear la falla", {
        position: "bottom-center",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (selectedOption === 1) {
      if (index === 4) {
        const tagValidado = validarTAGDuplicado(e.target.value);

        e.target.value = tagValidado;
      } else {
        e.target.value = validacionesConfiguraciones.limpiarInputNumerico(
          e.target.value
        );
      }
    } else {
      e.target.value = validacionesConfiguraciones.limpiarInputNumerico(
        e.target.value
      );
    }
  };

  const renderListaItems = () => {
    if (
      selectedOption === 2 &&
      (selectedNivel === "HN" ||
        selectedNivel === "ChG" ||
        selectedNivel === "ChB")
    ) {
      return (
        <ul
          className="rounded-lg h-full grid"
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li
              key={id}
              className={`bg-background3 p-2 rounded-lg flex flex-col ${
                index === datosActuales.length - 1 &&
                datosActuales.length % 2 !== 0
                  ? "col-span-2"
                  : ""
              }`}
            >
              <h3>{texto}</h3>
              <h4>
                {dato === "null" || dato === undefined || dato === null ? (
                  <span>null</span>
                ) : (
                  <>
                    {dato}
                    <span> - </span>
                    <input
                      ref={(el) => {
                        if (inputRefs.current) {
                          inputRefs.current[index] = el;
                        }
                      }}
                      pattern="\d+"
                      type="number"
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </>
                )}
              </h4>
            </li>
          ))}
          <div className="col-span-2 flex flex-col gap-2">
            <BotonAplicar2 className="p-2" onClick={handleAplicarNiveles} />
            <BotonRefresh className="p-2" onClick={refreshData} />
          </div>
        </ul>
      );
    } else if (selectedOption === 2 && selectedNivel === "FA") {
      return (
        <ul
          className="rounded-lg h-full grid"
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li
              key={id}
              className={`bg-background3 p-2 rounded-lg flex flex-col ${
                index === datosActuales.length - 1 &&
                datosActuales.length % 2 !== 0
                  ? "col-span-2"
                  : ""
              }`}
            >
              {dato === "null" || dato === undefined || dato === null ? (
                <>
                  <h3 className="">{texto}</h3>
                  <h4 className="">
                    <EjemploSkeleton2 />
                  </h4>
                </>
              ) : (
                <>
                  <h3 className="">{texto}</h3>
                  <h4 className="">{dato}</h4>
                </>
              )}
              {dato !== "null" && dato !== undefined && dato !== null && (
                <BotonResetear
                  className=""
                  onClick={() => handleAplicarReset(index)}
                />
              )}
            </li>
          ))}
        </ul>
      );
    } else if (selectedOption === 1) {
      return (
        <ul className="flex flex-col rounded-lg h-full justify-between">
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li
              key={id}
              className="bg-background3 p-2 rounded-lg flex flex-col"
            >
              {dato === "null" || dato === undefined || dato === null ? (
                <>
                  <h3 className="">{texto}</h3>
                  <h4 className="">
                    <span>null</span>
                  </h4>
                </>
              ) : (
                <>
                  <h3>{texto}</h3>
                  <h4>
                    {dato}
                    <span> - </span>
                    <input
                      ref={(el) => {
                        if (inputRefs.current) {
                          inputRefs.current[index] = el;
                        }
                      }}
                      className=""
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </h4>
                </>
              )}
            </li>
          ))}
          <div className="col-span-2 flex flex-col gap-2">
            <BotonAplicar2
              className="p-2"
              isDisabled={isButtonDisabled}
              onClick={handleAplicarTorre}
            />
            <BotonRefresh className="p-2" onClick={refreshData} />
          </div>
        </ul>
      );
    } else {
      return (
        <ul
          className="rounded-lg h-full justify-between grid"
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li
              key={id}
              className={`bg-background3 p-2 rounded-lg flex flex-col ${
                index === datosActuales.length - 1 &&
                datosActuales.length % 2 !== 0
                  ? "col-span-2"
                  : ""
              }`}
            >
              {dato === "null" || dato === undefined || dato === null ? (
                <>
                  <h3 className="">{texto}</h3>
                  <h4 className="">
                    <span>null</span>
                  </h4>
                </>
              ) : (
                <>
                  <h3 className="">{texto}</h3>
                  <h4 className="">{dato}</h4>
                </>
              )}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="bg-background2 flex-1 p-5 rounded-lg h-full flex flex-col gap-5">
      <h2 className="text-xl font-semibold">CORRECCIONES</h2>
      <ul className="flex flex-row justify-between w-auto gap-5">
        {opcionesCorrecciones.map(({ id, nombre }) => (
          <li key={id} className="flex flex-col flex-1">
            <button
              className={`flex flex-col rounded-sm transition-all ${
                selectedOption === id ? "bg-blue text-white" : "bg-background5"
              }`}
              onClick={() => handleOptionChange(id)}
            >
              <div className="flex flex-col items-center p-2">
                <span className="flex justify-center text-center">
                  {nombre}
                </span>
                {id === 1 && (
                  <SelectTorre
                    disabled={loading || datosGeneralesIzq[0].dato === "null"}
                    refreshTorres={() => {}}
                    refreshTorres2={() => {}}
                    selectedReceta={selectedReceta}
                    selectedTorre={selectedTorre}
                    onChange={handleTorreChange}
                    onTorresChange={handleTorresChange}
                  />
                )}
                {id === 2 && (
                  <SelectNivel
                    disabled={loading || datosGeneralesIzq[0].dato === "null"}
                    onChange={handleNivelChange}
                  />
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
      {renderListaItems()}
    </div>
  );
};

export default CorreccionesSection;
