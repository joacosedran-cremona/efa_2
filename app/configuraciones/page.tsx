"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

import AppContext from "@/context/AppContext";
import { useConfiguracionData } from "@/hooks/configuraciones/useConfiguracionData";
import RecetasSection from "@/components/configuraciones/RecetasSection";
import DatosGeneralesSection from "@/components/configuraciones/DatosGeneralesSection";
import CorreccionesSection from "@/components/configuraciones/CorreccionesSection";

const Configuraciones = () => {
  const { user } = useContext(AppContext);
  const router = useRouter();

  const configuracionData = useConfiguracionData();

  useEffect(() => {
    if (!user) {
      router.push("/login");

      return;
    }

    if (user.role !== "ADMIN") {
      router.push("/completo");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex flex-row justify-between gap-5 p-5 h-[83vh]">
      <RecetasSection
        datosGeneralesIzq={configuracionData.datosGeneralesIzq}
        loading={configuracionData.loading}
        selectedReceta={configuracionData.selectedReceta}
        onRecetaApply={() =>
          configuracionData.cargarDatosReceta(configuracionData.selectedReceta)
        }
        onRecetaChange={configuracionData.handleRecetaChange}
      />

      <DatosGeneralesSection
        datosGeneralesDer={configuracionData.datosGeneralesDer}
      />

      <CorreccionesSection
        datosActuales={configuracionData.datosActuales}
        datosGeneralesIzq={configuracionData.datosGeneralesIzq}
        handleNivelChange={configuracionData.handleNivelChange}
        handleOptionChange={configuracionData.handleOptionChange}
        handleTorreChange={configuracionData.handleTorreChange}
        handleTorresChange={configuracionData.handleTorresChange}
        inputRefs={configuracionData.inputRefs}
        isButtonDisabled={configuracionData.isButtonDisabled}
        loading={configuracionData.loading}
        refreshData={configuracionData.refreshData}
        selectedNivel={configuracionData.selectedNivel}
        selectedOption={configuracionData.selectedOption}
        selectedReceta={configuracionData.selectedReceta}
        selectedTorre={configuracionData.selectedTorre}
        validarTAGDuplicado={configuracionData.validarTAGDuplicado}
      />
    </div>
  );
};

export default Configuraciones;
