import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { Spinner } from "@heroui/spinner";
import { Button } from "@nextui-org/react";

Chart.register(...registerables, zoomPlugin);

const Grafico = ({ startDate, endDate }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartData, setChartData] = useState({ ciclos: [], pesoProducto: [] });
  const [loading, setLoading] = useState(true);

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
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/graficos-historico/ciclos-productos/?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const datos = await response.json();
      setChartData(datos);
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

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const initialData = {
      datasets: [
        {
          label: 'Ciclos',
          data: [],
          borderColor: '#F828',
          backgroundColor: '#EF8225',
          yAxisID: 'ciclos',
          fill: false,
          type: 'line'
        },
        {
          label: 'Peso Producto (Tn)',
          data: [],
          borderColor: '#3AF8',
          backgroundColor: '#3AF',
          yAxisID: 'pesoProducto',
          fill: false,
          type: 'line'
        }
      ]
    };

    const newChart = new Chart(ctx, {
      type: 'line',
      data: initialData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              color: '#D9D9D9'
            },
            onHover: (event) => {
              event.native.target.style.cursor = 'pointer';
            }
          },
          title: {
            align: 'start',
            display: true,
            text: 'CICLOS POR DIA',
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
              top: -10
            }
          },
          zoom: {
            pan: { enabled: true, mode: 'x' },
            zoom: {
              wheel: {
                enabled: true 
              },
              pinch: { 
                enabled: true
              },
              mode: 'x' 
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || 'Dato';
                const value = context.raw.y;
                const date = formatDate(context.raw.x);
                return [`Fecha: ${date}`, `${datasetLabel}: ${value}`];
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
          ciclos: {
            type: 'linear',
            beginAtZero: false,
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Ciclos Completados',
              color: '#EF8225'
            },
            grid: { color: '#1F1F1F', tickColor: '#EF8225' },
            border: { color: '#EF8225' },
            ticks: { color: '#EF8225' }
          },
          pesoProducto: {
            type: 'linear',
            beginAtZero: false,
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Peso Producto (Tn)',
              color: '#3AF'
            },
            grid: { color: '#1F1F1F', tickColor: '#3AF' },
            border: { color: '#3AF' },
            ticks: { color: '#3AF' }
          },
          x: {
            type: 'time',
            time: {
              parser: 'yyyy-MM-dd',
              unit: 'day',
              tooltipFormat: 'yyyy-MM-dd',
              displayFormats: {
                day: 'yyyy-MM-dd'
              }
            },
            title: {
              display: true,
              text: 'Tiempo',
              color: '#D9D9D9'
            },
            border: { color: '#D9D9D9' },
            grid: { color: '#8C8C8C', tickColor: '#fff' },
            ticks: { autoSkip: true, maxTicksLimit: 20, color: '#D9D9D9' }
          },
        }
      }
    });

    chartInstanceRef.current = newChart;

    return () => {
      newChart.destroy();
    };
  }, [startDate, endDate, formattedStartDate, formattedEndDate]);

  useEffect(() => {
    if (
      chartInstanceRef.current &&
      chartData &&
      chartData.ciclos.length > 0 &&
      chartData.pesoProducto.length > 0
    ) {
      const ciclosData = chartData.ciclos.map(item => {
        const date = new Date(item.fecha_fin);
        date.setHours(0, 0, 0, 0);
        return {
          x: date,
          y: item.CiclosCompletados
        };
      });

      const pesoProductoData = chartData.pesoProducto.map(item => {
        const date = new Date(item.fecha_fin);
        date.setHours(0, 0, 0, 0);
        return {
          x: date,
          y: item.PesoDiarioProducto / 1000
        };
      });

      chartInstanceRef.current.data.datasets[0].data = ciclosData;
      chartInstanceRef.current.data.datasets[1].data = pesoProductoData;
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
      className="relative bg-black p-[20px] h-full w-full rounded-[15px]"
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

export default Grafico;
