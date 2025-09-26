"use client";

import type { Alarm } from "@/interfaces/websocket";

import { toast } from "sonner";
import { useState, useEffect, useMemo, type MouseEvent } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  createTheme,
  ThemeProvider,
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import * as XLSX from "xlsx";

type AlertItem = {
  key: string;
  description: string;
  type?: string;
  state: string;
  time?: string;
};

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

const useCustomTheme = () => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: isDark ? "#30A0F0" : "#30A0F0",
      },
      secondary: {
        main: "#EF8225",
      },
      background: {
        default: isDark ? "#1B1B1B" : "#FDFDFD",
        paper: isDark ? "#222" : "#EDEDED",
      },
      text: {
        primary: isDark ? "#EEE" : "#222",
        secondary: isDark ? "#AAA" : "#555",
      },
      error: {
        main: isDark ? "#f15b5f" : "#f15b5f",
      },
    },
    components: {
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#292929" : "#E0E0E0",
            "& .MuiTableCell-root": {
              color: isDark ? "#FFF" : "#111",
              fontWeight: "bold",
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(odd)": {
              backgroundColor: isDark ? "#222" : "#EDEDED",
            },
            "&:nth-of-type(even)": {
              backgroundColor: isDark ? "#1B1B1B" : "#FDFDFD",
            },
            "&:hover": {
              backgroundColor: isDark ? "#333" : "#D8D8D8",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? "#393939" : "#D3D3D3"}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
          containedPrimary: {
            backgroundColor: "#581420",
            "&:hover": {
              backgroundColor: "#761122",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#222" : "#EDEDED",
            color: isDark ? "#EEE" : "#222",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: isDark ? "#333" : "#D8D8D8",
            },
          },
        },
      },
    },
  });
};

const Tabla = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AlertItem[]>([]);
  const [sortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });
  const { theme: themeMode } = useTheme();
  const theme = useCustomTheme();

  const [exportMenuAnchorEl, setExportMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const exportMenuOpen = Boolean(exportMenuAnchorEl);

  const handleExportMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleExportMenuClose = (): void => {
    setExportMenuAnchorEl(null);
  };

  const connectWebSocket = (): (() => void) => {
    setIsLoading(true);
    setError(null);

    const target = localStorage.getItem("targetAddress");

    if (
      !target ||
      target === "undefined:undefined" ||
      target.includes("undefined")
    ) {
      setError("Target address not available or invalid");
      setIsLoading(false);

      return () => {};
    }

    const wsUrl = `ws://${target}/ws/datos`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const alarmas = Array.isArray(data) && data.length >= 4 ? data[3] : [];

      if (Array.isArray(alarmas) && alarmas.length > 0) {
        setItems((prevItems: AlertItem[]) => {
          const updatedItems: AlertItem[] = [...prevItems];

          alarmas.forEach((alarma: Alarm) => {
            if (alarma.descripcion && alarma.descripcion.trim() !== "") {
              const index = updatedItems.findIndex(
                (item) => item.key === alarma.id_alarma.toString(),
              );

              const newItem: AlertItem = {
                key: alarma.id_alarma.toString(),
                description: alarma.descripcion,
                type: alarma.tipoAlarma,
                state: alarma.estadoAlarma ? "Activo" : "Inactivo",
                time: alarma.fechaRegistro,
              };

              if (index !== -1) {
                updatedItems[index] = newItem;
              } else {
                updatedItems.push(newItem);
              }
            }
          });

          return updatedItems.filter(
            (item) => item.description && item.description.trim() !== "",
          );
        });
        setIsLoading(false);
      }
    };

    socket.onerror = () => {
      setError(t("min.noSePudieronObtenerDatos"));
      setIsLoading(false);
    };

    return () => {
      socket.close();
    };
  };

  useEffect(() => {
    connectWebSocket();
  }, []);

  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, [themeMode]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "description",
        header: t("mayus.descripcion"),
        size: 400,
      },
      {
        accessorKey: "type",
        header: t("mayus.tipo"),
        size: 150,
      },
      {
        accessorKey: "state",
        header: t("mayus.estado"),
        size: 150,
      },
      {
        accessorKey: "time",
        header: t("mayus.fechaRegistro"),
        size: 200,
        filterFn: (row: { original: AlertItem }, filterValue: unknown) => {
          if (!filterValue) return true;

          const rowValue = row.original.time;

          if (!rowValue) return false;

          try {
            const filterText = String(filterValue).toLowerCase().trim();

            const fullValue = rowValue.toLowerCase();

            return fullValue.includes(filterText);
          } finally {
            return false;
          }
        },
      },
    ],
    [t],
  );

  const sortedItems = useMemo(() => {
    let sortedData = [...items];

    if (sortConfig.key) {
      const key = sortConfig.key as keyof AlertItem;

      sortedData.sort((a, b) => {
        const va = a[key] as string | undefined;
        const vb = b[key] as string | undefined;

        if (va === undefined && vb === undefined) return 0;
        if (va === undefined) return -1;
        if (vb === undefined) return 1;

        if (va < vb) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (va > vb) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return sortedData;
  }, [items, sortConfig]);

  const totalRows = sortedItems.length;
  const paginatedRows = useMemo(
    () => sortedItems.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [sortedItems, page, rowsPerPage],
  );

  const handleExportRowsToPDF = (
    rows: Array<{ original: Record<string, any> }>,
  ) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "A4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      const tableData = rows.map((row) => {
        return columns.map((col) => {
          const value = row.original[col.accessorKey] || "";

          if (col.accessorKey === "time" && typeof value === "string") {
            try {
              const date = new Date(value);

              return date.toISOString().slice(0, 16).replace("T", " ");
            } catch {
              return String(value);
            }
          }

          return String(value);
        });
      });

      const tableHeaders = columns.map((c) => c.header);
      const totalTexto = `Total de registros: ${rows.length}`;
      const exportDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const headerHeight = 70;

      doc.setFillColor(19, 19, 19);
      doc.rect(0, 0, pageWidth, headerHeight, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text("Fecha de exportación:", 20, 25);
      doc.text("Contacto: soporte@creminox.com", 20, 40);
      doc.text(totalTexto, 20, 55);

      doc.setFont("helvetica", "normal");
      doc.text(exportDate, 130, 25);
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        theme: "grid",
        margin: { top: headerHeight + 10 },
        styles: {
          fillColor: [41, 41, 41],
          textColor: [255, 255, 255],
          fontSize: 9,
          overflow: "linebreak",
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [25, 25, 25],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [30, 30, 30],
        },
        tableLineColor: [100, 100, 100],
        tableLineWidth: 0.1,
      });

      doc.save("Alertas.pdf");
      toast.success("Éxito", {
        description: "PDF descargado correctamente",
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Error al generar el PDF",
        position: "bottom-right",
      });
    }
    handleExportMenuClose();
  };

  const handleExportExcel = (
    rows: Array<{ original: Record<string, any> }>,
    fileName: string,
  ) => {
    try {
      const excelData = rows.map((row) => {
        const rowData: Record<string, any> = {};

        columns.forEach((column) => {
          const key = column.accessorKey;
          let value = row.original[key];

          if (key === "time" && typeof value === "string") {
            const date = new Date(value);

            value = date.toISOString().slice(0, 16).replace("T", " ");
          }

          const headerName = String(column.header);

          rowData[headerName] = value;
        });

        return rowData;
      });

      const workSheet = XLSX.utils.json_to_sheet(excelData);
      const workBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workBook, workSheet, "Alertas");

      XLSX.writeFile(workBook, `${fileName}.xlsx`);

      toast.success("Éxito", {
        description: "Excel descargado correctamente",
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Error al generar el Excel",
        position: "bottom-right",
      });
    }

    handleExportMenuClose();
  };

  const table = useMaterialReactTable({
    columns,
    data: paginatedRows,
    state: {
      isLoading,
      pagination: {
        pageIndex: page - 1,
        pageSize: rowsPerPage,
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontWeight: "bold",
        "& .MuiDivider-root": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "#FFF5 !important"
              : "#0005 !important",
          height: "20px",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgb(129, 129, 129) !important"
                : "rgb(200, 200, 200) !important",
          },
        },
      },
    },
    muiTableHeadRowProps: {
      sx: {
        backgroundColor: theme.palette.background.paper,
      },
    },
    muiTableBodyProps: {
      sx: {
        backgroundColor: theme.palette.background.default,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor:
          row.index % 2 === 0
            ? theme.palette.mode === "dark"
              ? "#222"
              : "#f9f9f9"
            : theme.palette.mode === "dark"
              ? "#1B1B1B"
              : "#ffffff",
        "&:hover": {
          backgroundColor: theme.palette.mode === "dark" ? "#333" : "#eaeaea",
        },
      },
    }),
    manualPagination: true,
    rowCount: totalRows,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const currentPagination = {
          pageIndex: page - 1,
          pageSize: rowsPerPage,
        };
        const newPagination = updater(currentPagination);

        setPage(newPagination.pageIndex + 1);
        setRowsPerPage(newPagination.pageSize);
      }
    },
    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          textAlign: "center",
          padding: "2rem",
          color: theme.palette.text.primary,
        }}
      >
        {t("min.noExistenDatosParaLaFechaIndicada")}
      </Box>
    ),
    enableSorting: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    layoutMode: "grid",
    initialState: {
      density: "spacious",
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      showColumnFilters: true,
    },
    muiPaginationProps: {
      SelectProps: {
        sx: {
          color: theme.palette.text.primary,
        },
      },
      sx: {
        color: theme.palette.text.primary,
      },
    },
    muiSearchTextFieldProps: {
      sx: {
        "& .MuiInputBase-input": {
          color: theme.palette.text.primary,
        },
        "& .MuiInputLabel-root": {
          color: theme.palette.text.secondary,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.mode === "dark" ? "#555" : "#ddd",
        },
      },
    },
    muiFilterTextFieldProps: {
      sx: {
        "& .MuiInputBase-input": {
          color: theme.palette.text.primary,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.mode === "dark" ? "#555" : "#ddd",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.mode === "dark" ? "#777" : "#bbb",
        },
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#333" : "#ddd"}`,
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.mode === "dark" ? "#333" : "#ddd"}`,
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: theme.palette.background.default,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        color: theme.palette.text.primary,
      },
    },
    muiTablePaperProps: {
      elevation: 3,
      sx: {
        border: `1px solid ${theme.palette.mode === "dark" ? "#333" : "#ddd"}`,
        borderRadius: "8px",
        overflow: "hidden",
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          width: "100%",
          alignItems: "center",
          position: "relative",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            gridColumn: 1,
            justifyContent: "flex-start",
          }}
        >
          <Button
            aria-controls={exportMenuOpen ? "export-menu" : undefined}
            aria-expanded={exportMenuOpen ? "true" : undefined}
            aria-haspopup="true"
            color="primary"
            id="export-button"
            startIcon={<FileDownloadIcon />}
            sx={{
              backgroundColor: theme.palette.error.main,
              width: "305px",
              "&:hover": {
                backgroundColor: "#761122",
              },
              paddingLeft: "16px",
            }}
            variant="contained"
            onClick={handleExportMenuClick}
          >
            {t("mayus.exportar")}
          </Button>

          <Menu
            MenuListProps={{
              "aria-labelledby": "export-button",
            }}
            anchorEl={exportMenuAnchorEl}
            id="export-menu"
            open={exportMenuOpen}
            onClose={handleExportMenuClose}
          >
            <MenuItem
              onClick={() =>
                handleExportRowsToPDF(
                  sortedItems.map((item) => ({ original: item })),
                )
              }
            >
              {t("mayus.exptodaspdf")}
            </MenuItem>
            <MenuItem
              onClick={() => handleExportRowsToPDF(table.getRowModel().rows)}
            >
              {t("mayus.expvisiblespdf")}
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleExportExcel(
                  sortedItems.map((item) => ({ original: item })),
                  "Todas_Alertas",
                )
              }
            >
              {t("mayus.exptodasexcel")}
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleExportExcel(table.getRowModel().rows, "Alertas_Visibles")
              }
            >
              {t("mayus.expvisiblesexcel")}
            </MenuItem>
          </Menu>
        </Box>

        <Box
          sx={{
            gridColumn: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
            justifyContent: "center",
            marginLeft: "185px",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "-5px",
            }}
          >
            {t("mayus.historialDeAlertas")}
          </Typography>
          <Typography
            sx={{ color: theme.palette.text.secondary }}
            variant="subtitle1"
          >
            {t("mayus.extendido")}
          </Typography>
        </Box>
      </Box>
    ),
  });

  return (
    <div className="flex min-h-full min-w-full items-center justify-center p-5">
      {error ? (
        <div className="flex flex-col bg-background2 p-5 text-center flex flex-col justify-center items-center shadow-md rounded-[15px]">
          <div className="mb-2">{error}</div>
          <Button
            color="error"
            sx={{ backgroundColor: theme.palette.error.main }}
            variant="contained"
            onClick={connectWebSocket}
          >
            {t("min.reintentar")}
          </Button>
        </div>
      ) : (
        <ThemeProvider theme={theme}>
          <div suppressHydrationWarning>
            <MaterialReactTable table={table} />
          </div>
        </ThemeProvider>
      )}
    </div>
  );
};

export default Tabla;
