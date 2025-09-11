import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { Spinner } from '@heroui/spinner';
import { Button } from "@nextui-org/react";

Chart.register(...registerables, zoomPlugin);

const GraficoC = ({ startDate, endDate }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [loading, setLoading] = useState(true);

  const colores = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6',
    '#33FFF5', '#FF9A33', '#33FFBD', '#FF3333', '#A633FF',
    '#FFD933', '#33FFD4', '#A6FF33', '#337BFF', '#33FF76',
    '#FF3357', '#33FF8D', '#FF8633', '#FF33C5', '#33FFC5'
  ];  

  // Función para agrupar los ciclos por hora y sumar el peso desmontado
  const groupByHour = (cycles) => {
    const groups = {};
    cycles.forEach(ciclo => {
      const date = new Date(ciclo.fecha_fin * 1000);
      // Redondea la fecha al inicio de la hora
      const hour = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours()
      ).getTime();
      if (!groups[hour]) {
        groups[hour] = 0;
      }
      groups[hour] += ciclo.pesoDesmontado;
    });
    // Convierte el objeto en un arreglo de { x: timestamp, y: valor } y lo ordena cronológicamente
    return Object.entries(groups)
      .map(([hour, value]) => ({ x: parseInt(hour, 10), y: value }))
      .sort((a, b) => a.x - b.x);
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const storedUser = sessionStorage.getItem('user_data');
    const token = storedUser ? JSON.parse(storedUser).access_token : null;

    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/graficos-historico/productos-realizados/?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const productos = await response.json();
      const datasets = productos.map((producto, index) => ({
        label: producto.NombreProducto,
        backgroundColor: colores[(producto.id_recetario - 1) % colores.length],
        borderColor: `${colores[(producto.id_recetario - 1) % colores.length]}80`,
        fill: false,
        data: groupByHour(producto.ListaDeCiclos)
      }));

      setChartData({ datasets });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    // Destruir instancia previa, si existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const initialData = {
      datasets: []
    };

    const newChart = new Chart(ctx, {
      type: 'bar',
      data: initialData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        plugins: {
          title: {
            align: 'start',
            display: true,
            text: 'PRODUCTOS REALIZADOS',
            color: '#D9D9D9',
            font: {
              size: 20,
              family: 'system-ui'
            }
          },
          subtitle: {
            align: 'start',
            display: true,
            text: `${formattedStartDate} - ${formattedEndDate}`,
            color: '#ffa500',
            font: {
              size: 16,
              weight: 'normal',
              family: 'system-ui'
            },
            padding: {
              top: -10  // Ajusta el subtítulo hacia arriba
            }
          },
          legend: {
            position: 'top',
            labels: { usePointStyle: true, color: '#D9D9D9' },
            onHover: (event) => {
              event.native.target.style.cursor = 'pointer';
            }
          },
          zoom: {
            pan: { enabled: true, mode: 'x' },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'x'
            },
            limits: {
              // Limitar el zoom para que no se muestre un rango menor a 1 hora (3600000 ms)
              x: { minRange: 3600000 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || 'Peso';
                const peso = context.raw.y;
                const date = formatDate(context.raw.x);
                // Calcula el total stackeado
                const totalStacked = context.chart.data.datasets.reduce((total, dataset) => {
                  const dataItem = dataset.data.find(item => item.x === context.raw.x);
                  return total + (dataItem ? dataItem.y : 0);
                }, 0);
                return [
                  `${datasetLabel}: ${peso} kg`,
                  `FECHA: ${date}`,
                  `PRODUCCION POR HORA: ${totalStacked} kg`
                ];
              },
              title: () => ''
            }
          }
        },
        transitions: {
          zoom: {
            animation: {
              duration: 0
            }
          }
        },
        scales: {
          y: {
            stacked: true,
            title: { display: true, text: 'Peso producto (kg)', color: '#D9D9D9' },
            beginAtZero: true,
            border: { color: '#D9D9D9' },
            grid: { color: '#1F1F1F', tickColor: '#fff' },
            ticks: { color: '#D9D9D9' }
          },
          x: {
            stacked: true,
            type: 'time',
            time: {
              unit: 'hour',
              tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
              displayFormats: {
                hour: 'HH:mm',
                day: 'dd MMM',
                week: 'dd MMM',
                month: 'MMM yyyy',
                quarter: 'MMM yyyy',
                year: 'yyyy'
              }
            },
            title: { display: true, text: 'Tiempo', color: '#D9D9D9' },
            border: { color: '#D9D9D9' },
            grid: { color: '#8C8C8C', tickColor: '#fff' },
            ticks: { autoSkip: true, maxTicksLimit: 20, color: '#D9D9D9' }
          }
        }
      }
    });

    chartInstanceRef.current = newChart;

    return () => {
      newChart.destroy();
    };
  }, [startDate, endDate, formattedStartDate, formattedEndDate]);

  useEffect(() => {
    if (chartInstanceRef.current && chartData && chartData.datasets.length > 0) {
      chartInstanceRef.current.data = chartData;
      chartInstanceRef.current.update();
    }
  }, [chartData]);

  const resetZoom = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resetZoom();
    }
  };

  return (
    <div
      className="relative bg-black p-[20px] h-full w-full rounded-[15px] mt[10px]"
      style={{ height: '500px', width: '100%' }}
    >
      <canvas ref={chartRef} className="block w-full h-full max-h-screen"></canvas>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75 rounded-xl">
          <Spinner label="Cargando..." />
        </div>
      )}
      <Button
          style={{
              backgroundColor: "#333",
              border: "1px solid #CCC",
              color: "#CCC",
              width: "15%",
              height: "35px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "17px",
          }}
          onClick={resetZoom}
          className="absolute top-[20px] right-[20px] text-white bg-grey hover:text-black hover:bg-lightGrey px-3 rounded-md"
      >
          Reiniciar Zoom
      </Button>
    </div>
  );
};

export default GraficoC;