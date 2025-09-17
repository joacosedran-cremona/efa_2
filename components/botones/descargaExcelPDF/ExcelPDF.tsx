"use client";
import { Button } from "@heroui/react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";

import logoDataURL from "./cremonabase64";
import telIcon from "./telbase64";
import webIcon from "./webbase64";
import mailIcon from "./mailbase64";

interface BotonesDescargaProps {
  startDate: string;
  endDate: string;
}

export default function BotonesDescarga({
  startDate,
  endDate,
}: BotonesDescargaProps) {
  const storedUser = sessionStorage.getItem("user_data");
  const token = storedUser ? JSON.parse(storedUser).access_token : null;
  const { t } = useTranslation();

  const fechaLocal = new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/\//g, "-");

  const handlePdfDownload = async () => {
    const productSection = document.getElementById("ProductividadSection");

    if (productSection) {
      const canvasProduct = await html2canvas(productSection, {
        scale: 3,
        ignoreElements: (element) =>
          element.classList && element.classList.contains("FiltroPeriodo"),
      });

      const imgDataProduct = canvasProduct.toDataURL("image/png");

      const imgProps = {
        width: canvasProduct.width,
        height: canvasProduct.height,
      };

      const pdfWidth = 287;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const pdfMargin = 10;

      const logoMargin = (pdfHeight + pdfMargin) / 8;

      const pdfHeightWithMargin = pdfHeight + pdfMargin;

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

      pdf.addImage(logoDataURL, "PNG", 245, logoMargin, logoWidth, logoHeight);

      pdf.setFontSize(12);
      pdf.text("EFA - MXEF-04", 253, logoMargin + 17);
      pdf.text("Celda de desmoldeo", 247, logoMargin + 22);

      pdf.addImage(webIcon, "PNG", 240, logoMargin + 40, 5, 5);
      pdf.text("creminox.com", 247, logoMargin + 44);
      pdf.link(240, logoMargin + 40, 30, 5, {
        url: "https://creminox.com",
        target: "_blank",
      });

      pdf.addImage(telIcon, "PNG", 240, logoMargin + 46, 5, 5);
      pdf.text("+54 11 4918-3944", 247, logoMargin + 50);

      pdf.addImage(mailIcon, "PNG", 240, logoMargin + 52, 5, 5);
      pdf.text("soporte@creminox.com", 247, logoMargin + 56);

      pdf.save(`Reporte_Productividad_CeldaDesmoldeo_${fechaLocal}.pdf`);
    }
  };

  const handleExcelDownload = async () => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/productividad/descargar-excel?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
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
        `Productividad_${startDate}_to_${endDate}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();

      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }

      window.URL.revokeObjectURL(url);
    } catch {}
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
        className="bg-[#f3126020] border border-[#F31260] text-[#F31260] flex justify-center items-center text-[1rem] w-full h-[3rem]"
        onClick={handlePdfDownload}
      >
        <FaFilePdf style={{ marginRight: "8px" }} />
        {t("min.descargarPDF")}
      </Button>

      <Button
        style={{
          backgroundColor: "rgba(17, 171, 90, 0.3)",
          border: "1px solid #11AB5A",
          color: "#11AB5A",
          width: "100%",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "17px",
        }}
        onClick={handleExcelDownload}
      >
        <FaFileExcel style={{ marginRight: "8px" }} />
        {t("min.descargarExcel")}
      </Button>
    </div>
  );
}
