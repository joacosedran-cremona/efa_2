"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Button,
} from "@heroui/react";
import Link from "next/link";

import LayoutCompleto from "@/components/completoLayout/completo";
import { useAuth } from "@/context/AuthContext";
import { GoDotFill } from "react-icons/go";
import { useTranslation } from "react-i18next";

interface Alarma {
  id_alarma: number;
  estadoAlarma: boolean | string;
  tipoAlarma: string;
  descripcion: string;
  fechaRegistro: string;
  fechaActual?: string;
  fechaInicio?: string;
}

interface ProcessedAlarma {
  key: string;
  description: string;
  type: string;
  state: string | boolean;
  time: string;
  registerTime: string;
}

interface Column {
  key: string;
  label: string;
}

const Completo = () => {
  const { t } = useTranslation();
  const { websocketData } = useAuth();
  const { data } = websocketData;
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ProcessedAlarma[]>([]);

  useEffect(() => {
    if (!data) return;

    if (!Array.isArray(data.alarms)) {
      setError("No se pudieron obtener los datos");
      setIsLoading(false);
      return;
    }

    const filteredItems = data.alarms.filter(
      (alarma: Alarma) =>
        alarma.tipoAlarma === "Error" || alarma.tipoAlarma === "Alerta"
    );

    setItems(
      filteredItems.map((alarma: Alarma) => ({
        key: alarma.id_alarma.toString(),
        description: alarma.descripcion,
        type: alarma.tipoAlarma,
        state: alarma.estadoAlarma,
        time: alarma.fechaActual || alarma.fechaRegistro,
        registerTime:
          alarma.estadoAlarma === "Activo" && alarma.fechaInicio
            ? alarma.fechaInicio
            : "",
      }))
    );

    setIsLoading(false);
  }, [data]);

  const columns: Column[] = [
    { key: "description", label: "DESCRIPCIÓN" },
    { key: "type", label: "TIPO" },
    { key: "state", label: "ESTADO" },
    { key: "time", label: "FECHA Y HORA ACTUAL" },
    { key: "registerTime", label: "FECHA Y HORA DE INICIO" },
  ];

  const totalRows = items.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = useMemo(
    () => items.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [items, page, rowsPerPage]
  );

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const renderState = (state: string | boolean) => {
    if (state === "Activo" || state === true) {
      return <GoDotFill className="text-[#FF0000]" />;
    } else if (state === "Inactivo" || state === false) {
      return <GoDotFill className="text-[#00FF00]" />;
    }
    return state;
  };

  return (
    <section className="flex flex-col p-6 gap-6 w-full h-full items-center">
      <div className=" w-[75%] h-auto">
        <LayoutCompleto />
      </div>

      {/* Título */}
      <h2 className="">LISTADO ALERTAS</h2>

      <div className="">
        <Table aria-label="Tabla de alertas">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className=""
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={paginatedRows}
            loadingContent={<Spinner label={t("min.recetaActual")} />}
          >
            {(item: ProcessedAlarma) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell className="">
                    {columnKey === "state"
                      ? renderState(item.state)
                      : item[String(columnKey) as keyof ProcessedAlarma]}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {error && (
          <div className="">
            <div className="">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              className=""
            >
              Reintentar
            </Button>
          </div>
        )}
      </div>


      <div className="">
        <Pagination
          showControls
          total={totalPages}
          page={page}
          onChange={handlePageChange}
          color="default"
          size="md"
        />

        <Link href="/alertas" className="">
          <Button
            className=""
            radius="full"
          >
            Ver más
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Completo;
