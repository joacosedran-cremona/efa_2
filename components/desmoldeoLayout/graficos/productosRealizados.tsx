"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Chart,
  registerables,
  ChartData,
  ChartOptions,
  ChartDataset,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { Button, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";

Chart.register(...registerables, zoomPlugin);

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
    accentColor: "#ffa500",
  };
};

type Point = { x: number; y: number };
type ProductoAPI = {
  id_recetario: number;
  NombreProducto: string;
  ListaDeCiclos: { fecha_fin: number; pesoDesmontado: number }[];
};

const GraficoC = ({
  startDate,
  endDate,
}: {
  startDate?: number | string;
  endDate?: number | string;
}) => {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<"bar", any, unknown> | null>(null);
  const [chartData, setChartData] = useState<
    ChartData<"bar", Point[], unknown>
  >({ datasets: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const totalsRef = useRef<Map<number, number>>(new Map());

  const colors = useThemeColors();

  const colores = [
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

  const groupByDay = (cycles: ProductoAPI["ListaDeCiclos"]) => {
    const groups = new Map<number, number>();

    cycles.forEach((ciclo) => {
      const date = new Date(ciclo.fecha_fin * 1000);
      const day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ).getTime();

      groups.set(day, (groups.get(day) || 0) + ciclo.pesoDesmontado);
    });

    return Array.from(groups.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => a.x - b.x);
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setLoading(false);

      return;
    }
    setLoading(true);
    let token = null;

    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user_data");

      token = storedUser ? JSON.parse(storedUser).access_token : null;
    }

    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/graficos-historico/productos-realizados/?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok)
        throw new Error(`Error fetching data: ${response.statusText}`);

      const productos: ProductoAPI[] = await response.json();
      const datasets: ChartDataset<"bar", Point[]>[] = productos.map(
        (producto) => ({
          label: producto.NombreProducto,
          backgroundColor:
            colores[(producto.id_recetario - 1) % colores.length],
          borderColor: `${colores[(producto.id_recetario - 1) % colores.length]}80`,
          fill: false,
          data: groupByDay(producto.ListaDeCiclos),
          borderWidth: 0,
        }),
      );

      setChartData({ datasets });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const totals = new Map<number, number>();

    chartData.datasets.forEach((dataset) => {
      (dataset.data as Point[] | undefined)?.forEach((point) => {
        totals.set(point.x, (totals.get(point.x) || 0) + point.y);
      });
    });
    totalsRef.current = totals;
  }, [chartData]);

  const formatDate = useMemo(
    () => (date?: string | number) => {
      if (date == null) return "";
      const d = new Date(Number(date));
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    [],
  );

  const formattedStartDate = useMemo(
    () => formatDate(startDate),
    [startDate, formatDate],
  );
  const formattedEndDate = useMemo(
    () => formatDate(endDate),
    [endDate, formatDate],
  );

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    const canvas = chartRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      plugins: {
        title: {
          align: "start",
          display: true,
          text: t("mayus.productosRealizados"),
          color: colors.textColor,
          font: {
            size: 20,
            family: "system-ui",
          },
        },
        subtitle: {
          align: "start",
          display: true,
          text: `${formattedStartDate} - ${formattedEndDate}`,
          color: colors.accentColor,
          font: {
            size: 16,
            weight: "normal",
            family: "system-ui",
          },
          padding: {
            top: -10,
          },
        },
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            color: colors.textColor,
          },
          onHover: (event: any) => {
            if (event?.native?.target) {
              (event.native.target as HTMLElement).style.cursor = "pointer";
            }
          },
        },
        zoom: {
          pan: { enabled: true, mode: "x" },
          zoom: {
            wheel: { enabled: true, modifierKey: "ctrl" },
            pinch: { enabled: true },
            mode: "x",
          },
          limits: {
            x: { minRange: 3600000 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const raw = context.raw as Point | undefined;
              const peso = raw ? parseFloat(String(raw.y)).toFixed(2) : "0.00";
              const date = raw ? formatDate(raw.x) : "";
              const totalStacked = raw ? totalsRef.current.get(raw.x) || 0 : 0;
              const totalStackedTn = (totalStacked / 1000).toFixed(2);

              return [
                `${t("min.peso")}: ${peso} kg`,
                `${t("min.fecha")}: ${date}`,
                `${t("min.prodDiaria")}: ${totalStackedTn} Tn`,
              ];
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
        y: {
          stacked: true,
          title: {
            display: true,
            text: t("min.pesoProducto") + " (Kg)",
            color: colors.textColor,
          },
          beginAtZero: true,
          border: { color: colors.textColor },
          grid: { color: colors.gridColor, tickColor: colors.textColor },
          ticks: { color: colors.textColor },
        },
        x: {
          stacked: true,
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
          border: { color: colors.textColor },
          grid: {
            color: colors.secondaryTextColor,
            tickColor: colors.textColor,
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
            color: colors.textColor,
          },
        },
      },
    };

    const newChart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: options as any,
    });

    chartInstanceRef.current = newChart as Chart<"bar", any, unknown>;

    return () => {
      newChart.destroy();
      chartInstanceRef.current = null;
    };
  }, [startDate, endDate, formattedStartDate, formattedEndDate, t, colors]);

  useEffect(() => {
    if (
      chartInstanceRef.current &&
      chartData &&
      chartData.datasets.length > 0
    ) {
      chartInstanceRef.current.data = chartData as any;
      chartInstanceRef.current.update();
    }
  }, [chartData]);

  const resetZoom = () => {
    if (chartInstanceRef.current) {
      (chartInstanceRef.current as any).resetZoom?.();
    }
  };

  return (
    <div
      className="relative bg-background2 p-5 h-full w-full rounded-lg"
      style={{ height: "500px" }}
    >
      <canvas ref={chartRef} />
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-background2 rounded-lg">
          <Spinner label={t("min.cargando")} />
        </div>
      )}
      <Button
        className="absolute top-[20px] right-[20px] text-texto bg-background3 hover:bg-background4 px-3 rounded-lg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "17px",
        }}
        onClick={() => resetZoom()}
      >
        {t("min.reiniciarZoom")}
      </Button>
    </div>
  );
};

export default React.memo(GraficoC);
