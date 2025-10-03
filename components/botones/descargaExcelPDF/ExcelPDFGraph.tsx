"use client";
import { Button, Spinner } from "@heroui/react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import logoDataURL from "./cremonabase64";
import telIcon from "./telbase64";
import webIcon from "./webbase64";
import mailIcon from "./mailbase64";

interface BotonesDescargaProps {
  startDate: string;
  endDate: string;
  isLoading?: boolean;
}

export default function BotonesDescarga({
  startDate,
  endDate,
  isLoading = false,
}: BotonesDescargaProps) {
  const storedUser = sessionStorage.getItem("user_data");
  const token = storedUser ? JSON.parse(storedUser).access_token : null;
  const { t } = useTranslation();
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);

  const fechaLocal = new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/\//g, "-");

  const handlePdfDownload = async () => {
    if (isPdfLoading) return; // Prevent multiple clicks
    
    setIsPdfLoading(true);
    try {
      const graphSection = document.getElementById("GraficosSection");

      if (graphSection) {
        const imgDataProduct = await domtoimage.toPng(graphSection, {
          quality: 0.95,
          bgcolor: "#ffffff",
          filter: (node: Node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;

              return !!!(
                element.classList &&
                (element.classList.contains("FiltroPeriodoGraficos") ||
                  (element.tagName === "BUTTON" &&
                    (element.textContent?.includes("Reiniciar zoom") ||
                      element.textContent?.includes("Reset zoom"))))
              );
            }

            return true;
          },
        });

        // Create a temporary image to get dimensions
        const tempImg = new Image();

        tempImg.src = imgDataProduct;
        await new Promise((resolve) => {
          tempImg.onload = resolve;
        });

        const imgProps = {
          width: tempImg.width,
          height: tempImg.height,
        };
        const pdfWidth = 287;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const pdfHeightWithMargin = pdfHeight + 10;

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [pdfHeightWithMargin, 297],
        });

        pdf.addImage(
          imgDataProduct,
          "PNG",
          5,
          5,
          pdfWidth,
          pdfHeight,
          undefined,
          "FAST",
        );

        const logoWidth = 40;
        const logoHeight = 10;

        pdf.addImage(logoDataURL, "PNG", 245, 15, logoWidth, logoHeight);

        pdf.setFontSize(12);
        pdf.text("EFA - MXEF-04", 253, 32);
        pdf.text("Celda de desmoldeo", 247, 37);

        pdf.addImage(webIcon, "PNG", 240, 60, 5, 5);
        pdf.text("creminox.com", 247, 64);

        pdf.link(240, 60, 30, 5, {
          url: "https://creminox.com",
          target: "_blank",
        });

        pdf.addImage(telIcon, "PNG", 240, 66, 5, 5);
        pdf.text("+54 11 4918-3944", 247, 70);

        pdf.addImage(mailIcon, "PNG", 240, 72, 5, 5);
        pdf.text("soporte@creminox.com", 247, 76);

        pdf.save(`Reporte_Graficos_CeldaDesmoldeo_${fechaLocal}.pdf`);
      }
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleExcelDownload = async () => {
    if (isExcelLoading) return; // Prevent multiple clicks
    
    setIsExcelLoading(true);
    try {
      const target = localStorage.getItem("targetAddress");
      const response = await fetch(
        `http://${target}/graficos-historico/descargar-excel?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error en la descarga: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `productividad_${startDate}_to_${endDate}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExcelLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        className={`border flex justify-center items-center text-[1rem] w-full h-[3rem] transition-all ${
          isLoading || isPdfLoading
            ? 'bg-white-300/30 border-white-400 text-gray-500 cursor-not-allowed opacity-60 text-[1rem]' 
            : 'bg-[#f3126020] border-[#F31260] text-[#F31260] hover:bg-[#f3126030]'
        }`}
        disabled={isLoading || isPdfLoading}
        onClick={handlePdfDownload}
      >
        {isPdfLoading ? (
          <Spinner size="sm" color="default" />
        ) : (
          <FaFilePdf style={{ marginRight: "8px" }} />
        )}
        {t("min.descargarPDF")}
      </Button>

      <Button
        className={`border flex justify-center items-center w-full h-[3rem] transition-all ${
          isLoading || isExcelLoading
            ? 'bg-white-300/30 border-white-400 text-gray-500 cursor-not-allowed opacity-60 text-[1rem]' 
            : 'bg-green-700/20 border-green-500 text-green-600 text-[1rem]'
        }`}
        disabled={isLoading || isExcelLoading}
        onClick={handleExcelDownload}
      >
        {isExcelLoading ? (
          <Spinner size="sm" color="default" />
        ) : (
          <FaFileExcel style={{ marginRight: "8px" }} />
        )}
        {t("min.descargarExcel")}
      </Button>
    </div>
  );
}
