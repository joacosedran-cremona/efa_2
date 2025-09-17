"use client";

import { useState, useEffect } from "react";
import { DateRangePicker, DateValue, RangeValue } from "@heroui/react";

import BotonesDescarga from "@/components/botones/descargaExcelPDF/ExcelPDFGraph";
import BotonFiltro from "@/components/botones/aplicarFiltro";
import CiclosRealizados from "./ciclosRealizados";
import ProductosRealizados from "./productosRealizados";
import { useTranslation } from "react-i18next";

const FiltradoFechasGraph = () => {
  const { t } = useTranslation();
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  const formattedLastMonth = lastMonth.toISOString().split("T")[0];

  const [dateRange, setDateRange] = useState({
    start: formattedLastMonth,
    end: formattedToday,
  });

  const [fechaInicio, setFechaInicio] = useState(formattedLastMonth);
  const [fechaFin, setFechaFin] = useState(formattedToday);

  const handleDateChange = (range: RangeValue<DateValue> | null) => {
    if (range && range.start && range.end) {
      setDateRange({
        start: range.start.toString(),
        end: range.end.toString(),
      });
    }
  };

  const handleButtonClick = () => {
    setFechaInicio(dateRange.start);
    setFechaFin(dateRange.end);
  };

  useEffect(() => {}, [fechaInicio, fechaFin]);

  return (
    <div
      className="w-full h-full flex flex-col rounded-2xl gap-5"
      id="GraficosSection"
    >
      <div className="h-full flex flex-row gap-5">
        <div className="w-4/5 flex flex-col bg-background2 rounded-lg p-5">
          <h1 className="text-xl font-bold ">{t("mayus.ciclosDia")}</h1>
          <CiclosRealizados endDate={fechaFin} startDate={fechaInicio} />
        </div>

        <div className="min-h-full w-1/5 flex flex-col items-center p-5 gap-10 rounded-lg bg-background2 FiltroPeriodoGraficos">
          <h2 className="text-2xl font-bold text-center break-words w-full">
            {t("mayus.filtradoFechaGraficos")}
          </h2>
          <DateRangePicker
            label={t("min.seleccionaPeriodo")}
            onChange={handleDateChange}
            firstDayOfWeek="sun"
            size="sm"
            classNames={{
              base: "w-full",
              inputWrapper: "date-range-wrapper max-w-[calc(100%-2.5rem)]",
              input: "overflow-hidden",
              segment: "date-segment-truncate",
              separator: "mx-0 flex-shrink-0",
              selectorButton: "ml-0 flex-shrink-0 min-w-[2rem] !px-0",
              selectorIcon: "text-default-500",
              label: "truncate overflow-hidden text-ellipsis whitespace-nowrap",
            }}
          />
          <BotonFiltro onClick={handleButtonClick} />

          <BotonesDescarga
            endDate={dateRange.end}
            startDate={dateRange.start}
          />
        </div>
      </div>
      <ProductosRealizados endDate={fechaFin} startDate={fechaInicio} />
    </div>
  );
};

export default FiltradoFechasGraph;
