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
        <ul className="bg-background2 rounded-lg min-w-1/3 h-full flex flex-col gap-5">
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li key={id} className="bg-background3 p-2 rounded-lg">
              <div className="flex flex-col w-1/2">
                <h3 className="">{texto}</h3>
                <h4 className="">
                  {dato === "null" || dato === undefined || dato === null ? (
                    <EjemploSkeleton2 />
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
                        className=""
                        pattern="\d+"
                        type="number"
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </>
                  )}
                </h4>
              </div>
            </li>
          ))}
          <div className="">
            <BotonAplicar2 className="" onClick={handleAplicarNiveles} />
            <BotonRefresh className="" onClick={refreshData} />
          </div>
        </ul>
      );
    } else if (selectedOption === 2 && selectedNivel === "FA") {
      return (
        <ul className="">
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li key={id} className="">
              <div className="">
                <div className="">
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
                </div>
                {dato !== "null" && dato !== undefined && dato !== null && (
                  <BotonResetear
                    className=""
                    onClick={() => handleAplicarReset(index)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      );
    } else if (selectedOption === 1) {
      return (
        <ul className="">
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li key={id} className="">
              <div className="">
                <div className="">
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
                      <h4 className="">
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
                </div>
              </div>
            </li>
          ))}
          <div className="">
            <BotonAplicar2
              className=""
              isDisabled={isButtonDisabled}
              onClick={handleAplicarTorre}
            />
            <BotonRefresh className="" onClick={refreshData} />
          </div>
        </ul>
      );
    } else {
      return (
        <ul className="">
          {datosActuales.map(({ id, texto, dato }) => (
            <li key={id} className="">
              <div className="">
                <div className="">
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
                </div>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="bg-background2 p-5 rounded-lg min-w-1/3 h-full flex flex-col gap-5">
      <h2 className="text-xl font-semibold">CORRECCIONES</h2>
      <ul className="flex flex-row justify-between gap-5 w-auto">
        {opcionesCorrecciones.map(({ id, nombre }) => (
          <li key={id} className="flex flex-col flex-1 gap-5">
            <button
              className={`flex flex-col rounded-sm transition-all duration-300 ${
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
