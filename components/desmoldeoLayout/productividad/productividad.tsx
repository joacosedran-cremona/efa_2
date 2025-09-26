"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

import FiltradoFechasProd from "./filtradoFechasProd";

interface ProductoRealizado {
  id_recetario: number;
  NombreProducto: string;
  cantidadCiclos: number;
  pesoTotal: number;
  tiempoTotal: string;
}

interface ProductividadData {
  ProductosRealizados: ProductoRealizado[];
  PesoTotalCiclos: number;
}

interface ProductoVisual {
  nombre: string;
  peso: string;
  cantidadCiclos: number;
  porcentaje: string;
  color: string;
}

interface DatoMetrica {
  id: number;
  titulo: string;
  dato: ReactNode;
}

interface DateRange {
  start: string;
  end: string;
}

const colors: string[] = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F333FF",
  "#FF33A6",
  "#33FFF5",
  "#FF9A33",
  "#33FFBD",
  "#FF3333",
  "#A633FF",
  "#FFD933",
  "#33FFD4",
  "#A6FF33",
  "#337BFF",
  "#33FF76",
  "#FF3357",
  "#33FF8D",
  "#FF8633",
  "#FF33C5",
  "#33FFC5",
];

const getColorById = (id: number): string => {
  return colors[(id - 1) % colors.length];
};

const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);

  return hours * 60 + minutes;
};

const formatMinutesToHHMM = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const Productividad = () => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState<ProductividadData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: today,
    end: today,
  });

  const handleDataUpdate = (
    newData: ProductividadData,
    startDate: string,
    endDate: string,
  ): void => {
    setData(newData);
    setDateRange({ start: startDate, end: endDate });
  };

  const cantidadCiclosF =
    data?.ProductosRealizados && Array.isArray(data.ProductosRealizados)
      ? data.ProductosRealizados.reduce(
          (total, producto) => total + producto.cantidadCiclos,
          0,
        )
      : t("min.cargando");

  const PesoTotalCiclos =
    data?.PesoTotalCiclos !== undefined
      ? data.PesoTotalCiclos.toFixed(2)
      : t("min.cargando");

  const Horas_Uso =
    data?.ProductosRealizados && Array.isArray(data.ProductosRealizados)
      ? data.ProductosRealizados.reduce(
          (acc, prod) => acc + parseTimeToMinutes(prod.tiempoTotal),
          0,
        )
      : t("min.cargando");

  const Promedio_Horas = (
    horasUso: number | string,
    numProductos: number,
  ): string =>
    horasUso !== t("min.cargando")
      ? formatMinutesToHHMM((horasUso as number) / numProductos)
      : t("min.cargando");

  const datos: DatoMetrica[] = [
    { id: 1, titulo: t("min.ciclosRealizados"), dato: cantidadCiclosF },
    {
      id: 2,
      titulo: t("min.productoRealizado"),
      dato: (
        <p>
          {PesoTotalCiclos} <span className="text-lg">Tn</span>
        </p>
      ),
    },
    {
      id: 3,
      titulo: t("min.promedioUsoDiario"),
      dato: (
        <p>
          {Promedio_Horas(Horas_Uso, data?.ProductosRealizados?.length || 0)}
        </p>
      ),
    },
  ];

  const productos: ProductoVisual[] =
    data?.ProductosRealizados?.map((producto) => {
      const porcentaje = data.PesoTotalCiclos
        ? (producto.pesoTotal * 100) / data.PesoTotalCiclos / 1000
        : 0;
      const pesoEnToneladas = (producto.pesoTotal / 1000).toFixed(1) + "Tn";

      return {
        nombre: producto.NombreProducto,
        peso: pesoEnToneladas,
        cantidadCiclos: producto.cantidadCiclos,
        porcentaje: porcentaje.toFixed(2),
        color: getColorById(producto.id_recetario),
      };
    }) ?? [];

  return (
    <div
      className="flex flex-col-reverse md:flex-row gap-5 w-full"
      id="ProductividadSection"
    >
      <div className="w-full md:w-4/5 flex flex-col bg-background2 rounded-lg p-5 relative">
        <p className="text-left text-[1vw] font-semibold">
          {t("mayus.productividad")}
        </p>
        <div className="flex items-center">
          <p className="inline text-orange">
            {dateRange.start}{" "}
            <span className="inline px-[5px] font-semibold"> - </span>{" "}
            {dateRange.end}
          </p>
        </div>
        <div className="flex justify-between w-full px-[50px]">
          {datos.map((dato, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <p className="text-[2.5vw] font-semibold">{dato.dato}</p>
              <p className="text-[1vw] text-texto2">{dato.titulo}</p>
            </div>
          ))}
        </div>
        <hr className="border-t-4 border-texto rounded-lg mx-auto my-5 w-4/5" />
        <div className="relative">
          <p>% {t("min.productoRealizado")}</p>
          <div className="flex h-5 rounded overflow-hidden bg-background5 mb-[15px]">
            {productos.map((producto, index) => (
              <div
                key={index}
                className="relative h-full group"
                style={{
                  width: `${producto.porcentaje}%`,
                  backgroundColor: producto.color,
                }}
              >
                <div className="absolute hidden group-hover:block bg-black/70 text-white px-[10px] rounded whitespace-nowrap z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  Ciclos: {producto.cantidadCiclos}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-around flex-wrap">
            {productos.map((producto, index) => (
              <div key={index} className="flex items-center m-[5px_10px]">
                <p
                  className="w-[15px] h-[15px] rounded mr-[5px]"
                  style={{ backgroundColor: producto.color }}
                />
                <p>{`${producto.nombre} - ${producto.porcentaje}% (${producto.peso})`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/5 flex flex-col gap-5 ocultar-en-pdf">
        <FiltradoFechasProd onDataUpdate={handleDataUpdate} />
      </div>
    </div>
  );
};

export default Productividad;
