"use client";

import { useState, useEffect } from "react";
import style from "./Productividad.module.css";
import FiltroPeriodo from "../filtroperiodo/FiltroPeriodo.jsx";

const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6',
  '#33FFF5', '#FF9A33', '#33FFBD', '#FF3333', '#A633FF',
  '#FFD933', '#33FFD4', '#A6FF33', '#337BFF', '#33FF76',
  '#FF3357', '#33FF8D', '#FF8633', '#FF33C5', '#33FFC5'
];

const getColorById = (id) => {
  return colors[(id - 1) % colors.length];
};

const Productividad = () => {
    const today = new Date().toISOString().split("T")[0];

    const [data, setData] = useState(null);
    const [dateRange, setDateRange] = useState({
        start: today,
        end: today,
    });

    const handleDataUpdate = (newData, startDate, endDate) => {
        setData(newData);
        setDateRange({ start: startDate, end: endDate });
    };

    const Cant_Dias = Math.ceil(
        (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 3600 * 24) + 1
    );

    const cantidadCiclosF = data?.ProductosRealizados && Array.isArray(data.ProductosRealizados)
    ? data.ProductosRealizados.reduce((total, producto) => total + producto.cantidadCiclos, 0)
    : "Cargando...";
    const PesoTotalCiclos = data?.PesoTotalCiclos.toFixed(2) ?? "Cargando...";
    const Horas_Uso =
        data?.ProductosRealizados && Array.isArray(data.ProductosRealizados)
            ? data.ProductosRealizados.reduce((acc, prod) => acc + prod.tiempoTotal, 0)
            : "Cargando...";

    const Promedio_Horas = (Horas_Uso, Cant_Dias) =>
        Horas_Uso !== "Cargando..." ? ((Horas_Uso/60) / (Cant_Dias)).toFixed(2) : "Cargando...";

    const datos = [
        { id: 1, titulo: "Ciclos realizados", dato: cantidadCiclosF },
        { id: 2, titulo: "Producción total", dato: (
            <span>
              {PesoTotalCiclos} <span className="text-lg">Tn</span>
            </span>
          ) },
        { id: 3, titulo: "Promedio de uso diario", dato: (
            <span>
              {Promedio_Horas(Horas_Uso, Cant_Dias)} <span className="text-lg">Hs</span>
            </span>
          ) },
    ];

    const productos = data?.ProductosRealizados?.map((producto) => {
        const porcentaje = ((producto.pesoTotal * 100) / PesoTotalCiclos / 1000);
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
        <div id="ProductividadSection" className={style.all}>
            <div className={style.productividad}>
                <h2 className={style.titulo}>PRODUCTIVIDAD</h2>
                <div className={style.fechaContainer}>
                    <span className={style.fecha}>{dateRange.start}</span>
                    <span className={style.separator}> - </span>
                    <span className={style.fecha}>{dateRange.end}</span>
                </div>
                <div className={style.metricaContainer}>
                    {datos.map((dato, index) => (
                        <div key={index} className={style.metrica}>
                            <p className={style.valor}>{dato.dato}</p>
                            <p className={style.descripcion}>{dato.titulo}</p>
                        </div>
                    ))}
                </div>
                <hr className={style.divisor} />
                <div className={style.barraContainer}>
                    <h3 className={style.textoBarra}>% Producto realizado</h3>
                    <div className={style.barra}>
                        {productos.map((producto, index) => (
                            <div
                                key={index}
                                className={`${style.segmento} segmento-tooltip`}
                                style={{
                                    width: `${producto.porcentaje}%`,
                                    backgroundColor: producto.color,
                                }}
                                data-tooltip={`Ciclos: ${producto.cantidadCiclos}`}
                            />
                        ))}
                    </div>
                    <div className={style.leyenda}>
                        {productos.map((producto, index) => (
                            <div key={index} className={style.itemLeyenda}>
                                <span
                                    className={style.colorMuestra}
                                    style={{ backgroundColor: producto.color }}
                                ></span>
                                <p className={style.prods}>{`${producto.nombre} - ${producto.porcentaje}% (${producto.peso})`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`${style.filtro} ocultar-en-pdf`}>
                <FiltroPeriodo onDataUpdate={handleDataUpdate} />
            </div>
        </div>
    );
};

export default Productividad;
