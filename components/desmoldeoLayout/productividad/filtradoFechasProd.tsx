"use client";

import { useState, useEffect } from "react";
import { DateRangePicker } from "@heroui/react";
import { DateValue } from "@internationalized/date";
import { useTranslation } from "react-i18next";

import { ProductividadData } from "./productividad";

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

interface FiltradoFechasProdProps {
  onDataUpdate: (
    data: ProductividadData,
    startDate: string,
    endDate: string,
  ) => void;
  onLoading?: (loading: boolean) => void;
  isLoading?: boolean;
}

const FiltradoFechasProd = ({
  onDataUpdate,
  onLoading,
  isLoading = false,
}: FiltradoFechasProdProps) => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user_data");
    const userToken = storedUser ? JSON.parse(storedUser).access_token : null;

    setToken(userToken);
  }, []);

  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const [dateRange, setDateRange] = useState<DateRangeType>({
    start: formattedToday,
    end: formattedToday,
  });

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

    if (!token && typeof window === "undefined") {
      return;
    }

    onLoading?.(true);

    try {
      const target = localStorage.getItem("targetAddress");

      const response = await fetch(
        `http://${target}/productividad/resumen?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      onDataUpdate(data, startDate, endDate);
    } finally {
      onLoading?.(false);
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

    if (!token) {
      return;
    }

    onLoading?.(true);

    try {
      const target = localStorage.getItem("targetAddress");

      const response = await fetch(
        `http://${target}/productividad/resumen?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
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
    } finally {
      onLoading?.(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchInitialData();
    }
  }, [token]);

  return (
    <div className="h-full flex flex-col items-center p-5 gap-5 rounded-lg bg-background2 FiltroPeriodo">
      <p className="text-2xl font-bold text-center break-words w-full">
        {t("mayus.filtradoFechaProductividad")}
      </p>
      <div className="w-full h-full flex flex-col items-center gap-5 rounded-lg">
        <DateRangePicker
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
          firstDayOfWeek="sun"
          label={t("min.seleccionaPeriodo")}
          size="sm"
          onChange={handleDateChange}
        />
        <AplicarFiltro onClick={handleButtonClick} />
        <ExcelPDF
          endDate={
            typeof dateRange.end === "string"
              ? dateRange.end
              : formatDate(dateRange.end) || formattedToday
          }
          isLoading={isLoading}
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
