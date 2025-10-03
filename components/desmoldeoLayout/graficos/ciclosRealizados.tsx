"use client";

import type { ChartData, ChartOptions, ChartEvent } from "chart.js";

import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { Button, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";

Chart.register(...registerables);

const useThemeColors = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");

    setIsDarkMode(isDark);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");

          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return {
    textColor: isDarkMode ? "#EEE" : "#222",
    secondaryTextColor: isDarkMode ? "#AAA" : "#555",
    headingColor: isDarkMode ? "#FFF" : "#111",
    gridColor: isDarkMode ? "#393939" : "#E0E0E0",
    borderColor: isDarkMode ? "#666" : "#D9D9D9",
    gridLineColor: isDarkMode ? "#333" : "#8C8C8C",
    accentColor: "#ffa500",
  };
};

interface GraficoProps {
  startDate: string | Date;
  endDate: string | Date;
  onLoading?: (loading: boolean) => void;
}

interface ChartDataPoint {
  x: string;
  y: number;
}

const Grafico = ({ startDate, endDate, onLoading }: GraficoProps) => {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<
    "line",
    ChartDataPoint[],
    unknown
  > | null>(null);
  const registeredRef = useRef(false);
  const [chartData, setChartData] = useState({ ciclos: [], pesoProducto: [] });
  const [loading, setLoading] = useState(true);

  const colors = useThemeColors();

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setLoading(false);
      onLoading?.(false);

      return;
    }
    setLoading(true);
    onLoading?.(true);

    let token = null;

    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user_data");

      token = storedUser ? JSON.parse(storedUser).access_token : null;
    }

    try {
      const target = localStorage.getItem("targetAddress");
      const response = await fetch(
        `http://${target}/graficos-historico/ciclos-productos/?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const datos = await response.json();

      setChartData(datos);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      if (!registeredRef.current) {
        const mod = await import("chartjs-plugin-zoom");
        const zoom = (mod && (mod as any).default) || mod;

        Chart.register(...registerables, zoom);
        registeredRef.current = true;
      }

      const ctx = chartRef.current?.getContext("2d");

      if (!ctx) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const initialData: ChartData<"line", ChartDataPoint[]> = {
        datasets: [
          {
            label: t("min.cantidadCiclos"),
            data: [],
            borderColor: "#F828",
            backgroundColor: "#EF8225",
            yAxisID: "ciclos",
            fill: false,
            type: "line",
          },
          {
            label: t("min.pesoProducto") + " (Tn)",
            data: [],
            borderColor: "#3AF8",
            backgroundColor: "#3AF",
            yAxisID: "pesoProducto",
            fill: false,
            type: "line",
          },
        ],
      };

      const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              color: colors.textColor,
            },
            onHover: (event: ChartEvent) => {
              const target = event.native?.target as HTMLElement | undefined;

              if (target) target.style.cursor = "pointer";
            },
          },
          title: {
            align: "start",
            display: true,
            text: `${formattedStartDate} - ${formattedEndDate}`,
            color: colors.accentColor,
            font: {
              size: 16,
              weight: "normal",
              family: "system-ui",
            },
          },
          zoom: {
            pan: { enabled: true, mode: "x" },
            zoom: {
              wheel: {
                enabled: true,
                modifierKey: "ctrl",
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const datasetLabel = context.dataset.label || "Dato";
                const value = context.raw.y;
                const date = formatDate(context.raw.x);

                return [`Fecha: ${date}`, `${datasetLabel}: ${value}`];
              },
              title: () => "",
            },
          },
        },
        transitions: {
          zoom: {
            animation: {
              duration: 0,
            },
          },
        },
        scales: {
          ciclos: {
            type: "linear",
            beginAtZero: false,
            display: true,
            position: "left",
            title: {
              display: true,
              text: t("min.ciclosRealizados"),
              color: "#EF8225",
            },
            grid: { color: colors.gridColor, tickColor: "#EF8225" },
            border: { color: "#EF8225" },
            ticks: { color: "#EF8225" },
          },
          pesoProducto: {
            type: "linear",
            beginAtZero: false,
            display: true,
            position: "right",
            title: {
              display: true,
              text: t("min.pesoProducto") + " (Tn)",
              color: "#3AF",
            },
            grid: { color: colors.gridColor, tickColor: "#3AF" },
            border: { color: "#3AF" },
            ticks: { color: "#3AF" },
          },
          x: {
            type: "time",
            time: {
              parser: "yyyy-MM-dd",
              unit: "day",
              tooltipFormat: "yyyy-MM-dd",
              displayFormats: {
                day: "yyyy-MM-dd",
              },
            },
            title: {
              display: true,
              text: t("min.tiempo"),
              color: colors.textColor,
            },
            border: { color: colors.borderColor },
            grid: { color: colors.gridLineColor, tickColor: colors.textColor },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20,
              color: colors.textColor,
            },
          },
        },
      } as any;

      const chartDataToUse =
        chartData && chartData.ciclos.length > 0
          ? {
              datasets: [
                {
                  ...initialData.datasets[0],
                  data: chartData.ciclos.map((item: any) => ({
                    x: item.fecha_fin,
                    y: item.CiclosCompletados,
                  })),
                },
                {
                  ...initialData.datasets[1],
                  data: chartData.pesoProducto.map((item: any) => ({
                    x: item.fecha_fin,
                    y: item.PesoDiarioProducto / 1000,
                  })),
                },
              ],
            }
          : initialData;

      const newChart = new Chart(ctx, {
        type: "line",
        data: chartDataToUse,
        options: chartOptions,
      }) as unknown as Chart<"line", ChartDataPoint[], unknown>;

      chartInstanceRef.current = newChart;

      return () => {
        newChart.destroy();
      };
    })();
  }, [
    startDate,
    endDate,
    formattedStartDate,
    formattedEndDate,
    t,
    colors,
    chartData,
  ]);

  const resetZoom = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resetZoom();
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center bg-background2 rounded-lg">
          <Spinner label={t("min.cargando")} />
        </div>
      ) : (
        <canvas ref={chartRef} className="w-full max-h-[37vh]" />
      )}
      <Button
        className="text-texto bg-background3 hover:bg-background4 px-3 rounded-lg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "17px",
        }}
        onClick={resetZoom}
      >
        {t("min.reiniciarZoom")}
      </Button>
    </>
  );
};

export default Grafico;
