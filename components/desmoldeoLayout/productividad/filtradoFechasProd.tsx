"use client";

import { useState, useEffect } from "react";
import { DateRangePicker } from "@heroui/react";
import { DateValue } from "@internationalized/date";
import { useTranslation } from "react-i18next";

import ExcelPDF from "@/components/botones/descargaExcelPDF/ExcelPDF";
import AplicarFiltro from "@/components/botones/aplicarFiltro";

interface DateObject {
  year: number;
  month: number;
  day: number;
}

interface DateRangeType {
  start: DateObject | string;
  end: DateObject | string;
}

type RangeValueType<T> = {
  start: T;
  end: T;
};

interface ProductividadData {
  ProductosRealizados: Array<any>;
  PesoTotalCiclos: number;
}

interface FiltradoFechasProdProps {
  onDataUpdate: (
    data: ProductividadData,
    startDate: string,
    endDate: string,
  ) => void;
}

const FiltradoFechasProd = ({ onDataUpdate }: FiltradoFechasProdProps) => {
  const { t } = useTranslation();
  const storedUser = sessionStorage.getItem("user_data");
  const token = storedUser ? JSON.parse(storedUser).access_token : null;

  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const [dateRange, setDateRange] = useState<DateRangeType>({
    start: formattedToday,
    end: formattedToday,
  });
  const [loading, setLoading] = useState(false);

  const formatDate = (date: DateObject | null | string): string | null => {
    if (!date) return null;
    if (typeof date === "string") return date;

    const year = date.year;
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchInitialData = async () => {
    const startDate = formattedToday;
    const endDate = formattedToday;

    setLoading(true);
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/productividad/resumen?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      onDataUpdate(data, startDate, endDate);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (value: RangeValueType<DateValue> | null) => {
    if (value) {
      setDateRange(value as any);
    }
  };

  const handleButtonClick = async () => {
    const startDate = formatDate(dateRange.start) || formattedToday;
    const endDate = formatDate(dateRange.end) || formattedToday;

    setLoading(true);
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/productividad/resumen?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      onDataUpdate(data, startDate, endDate);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="h-full flex flex-col items-center p-5 gap-5 rounded-lg bg-background2 FiltroPeriodo">
      <h2 className="text-[1.5rem] font-semibold text-center break-words">
        {t("mayus.filtradoFechaProductividad")}
      </h2>
      <div className="h-full flex flex-col items-center gap-5 rounded-lg">
        <DateRangePicker
          label={t("min.seleccionaPeriodo")}
          onChange={handleDateChange}
        />
        <AplicarFiltro onClick={handleButtonClick} />
        <ExcelPDF
          endDate={
            typeof dateRange.end === "string"
              ? dateRange.end
              : formatDate(dateRange.end) || formattedToday
          }
          startDate={
            typeof dateRange.start === "string"
              ? dateRange.start
              : formatDate(dateRange.start) || formattedToday
          }
        />
      </div>
    </div>
  );
};

export default FiltradoFechasProd;
