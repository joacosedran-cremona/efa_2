"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import EstadosLayout from "./estadosLayout";

import AppContext from "@/context/AppContext";
import LayoutIMG from "@/public/layout/LAYOUT.png";

interface SectionStyle {
  top: string;
  left: string;
  width: string;
  height: string;
}

interface LayoutSection {
  id: number;
  identifier: string;
  translationKey: string;
  path: string;
  style: SectionStyle;
  shadowColor: string;
  rotate?: string;
  zIndex?: string;
  statusKey?: keyof typeof equipmentStatusMap;
}

interface EquipmentStatus {
  isActive: boolean;
  statusText: string;
  statusClass: string;
}

const equipmentStatusMap = {
  posicionador: (data: any): EquipmentStatus => {
    const torreActual = data?.machineStatus?.TorreActual;
    const torreProxima = data?.technicalData?.datosTorre?.N_torre_proxima;

    return {
      isActive: data?.machineStatus?.estadoMaquina === "CICLO ACTIVO",
      statusText: `Torre: ${torreActual}/${torreProxima}`,
      statusClass:
        data?.machineStatus?.estadoMaquina === "CICLO ACTIVO"
          ? "bg-green-500"
          : "bg-yellow-500",
    };
  },
  sdda: (data: any): EquipmentStatus => {
    const nivelActual = data?.machineStatus?.sdda_nivel_actual;
    const totalNiveles = data?.machineStatus?.TotalNiveles;

    return {
      isActive: data?.processData?.Desmoldeo?.estadoMaquina === "CICLO ACTIVO",
      statusText: `Nivel: ${nivelActual}/${totalNiveles}`,
      statusClass:
        data?.processData?.Desmoldeo?.estadoMaquina === "CICLO ACTIVO"
          ? "bg-green-500"
          : "bg-gray-500",
    };
  },
  robot: (data: any): EquipmentStatus => {
    const robotAlarms =
      data?.alarms?.filter(
        (alarm: any) => alarm.tipoAlarma === "ESTADO ROBOT"
      ) || [];
    const lastRobotAlarm = robotAlarms.length > 0 ? robotAlarms[0] : null;

    return {
      isActive: data?.machineStatus?.estadoMaquina === "CICLO ACTIVO",
      statusText:
        lastRobotAlarm && lastRobotAlarm.descripcion
          ? lastRobotAlarm.descripcion.substring(0, 20) + "..."
          : "Estado desconocido",
      statusClass:
        data?.machineStatus?.estadoMaquina === "CICLO ACTIVO"
          ? "bg-green-500"
          : "bg-gray-500",
    };
  },
  gripper: (data: any): EquipmentStatus => {
    const gripperActual = data?.machineStatus?.NGripperActual;

    return {
      isActive: gripperActual > 0,
      statusText: `Gripper: ${gripperActual}`,
      statusClass: gripperActual > 0 ? "bg-green-500" : "bg-gray-500",
    };
  },
  estacionGrippers: (data: any): EquipmentStatus => {
    const gripperActual = data?.machineStatus?.NGripperActual;
    const gripperProximo = data?.technicalData?.datosGripper?.NGripperProximo;

    return {
      isActive: gripperActual !== gripperProximo,
      statusText: `Próximo: ${gripperProximo}`,
      statusClass: "bg-blue-500",
    };
  },
  bandaA: (data: any): EquipmentStatus => {
    const bandaActiva =
      data?.technicalData?.sector_IO?.banda_desmoldeo === "CINTA A";

    return {
      isActive: bandaActiva,
      statusText: bandaActiva ? "Activa" : "Inactiva",
      statusClass: bandaActiva ? "bg-green-500" : "bg-gray-500",
    };
  },
  bandaB: (data: any): EquipmentStatus => {
    const bandaActiva =
      data?.technicalData?.sector_IO?.banda_desmoldeo === "CINTA B";

    return {
      isActive: bandaActiva,
      statusText: bandaActiva ? "Activa" : "Inactiva",
      statusClass: bandaActiva ? "bg-green-500" : "bg-gray-500",
    };
  },
};

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { setEquipoSeleccionado, websocketData } = useContext(AppContext);
  const [equipmentData, setEquipmentData] = useState<any>(null);

  const sections: LayoutSection[] = [
    {
      id: 1,
      identifier: "Posicionador de torres",
      translationKey: "min.posicionadorDeTorres",
      path: "/desmoldeo/equipos",
      style: { top: "8.6%", left: "73%", width: "10.1%", height: "66%" },
      shadowColor: "shadow-[0px_0px_10px_5px_rgba(243,127,208,0.5)]",
      statusKey: "posicionador",
    },
    {
      id: 2,
      identifier: "SDDA",
      translationKey: "mayus.SDDA",
      path: "/desmoldeo/equipos",
      style: { top: "30.65%", left: "59.9%", width: "12.3%", height: "21.8%" },
      shadowColor: "shadow-[0px_0px_10px_5px_rgba(7,222,136,0.5)]",
      statusKey: "sdda",
    },
    {
      id: 3,
      identifier: "Robot",
      translationKey: "min.robot",
      path: "/desmoldeo/equipos",
      style: { top: "33.4%", left: "48.3%", width: "7.8%", height: "16.3%" },
      shadowColor: "shadow-[0px_0px_10px_5px_rgba(222,154,7,0.5)]",
      statusKey: "robot",
    },
    {
      id: 4,
      identifier: "Gripper",
      translationKey: "min.gripper",
      path: "/desmoldeo/equipos",
      style: { top: "9.7%", left: "54.2%", width: "7.8%", height: "17.3%" },
      shadowColor: "shadow-[0px_0px_10px_5px_rgba(255,0,0,0.5)]",
      rotate: "rotate-[30deg]",
      zIndex: "z-10",
      statusKey: "gripper",
    },
    {
      id: 5,
      identifier: "Estación de grippers",
      translationKey: "min.estacionDeGrippers",
      path: "/desmoldeo/equipos",
      style: { top: "68.6%", left: "47.55%", width: "8.8%", height: "19.5%" },
      shadowColor: "shadow-[0px_0px_10px_5px_rgba(255,0,0,0.5)]",
      statusKey: "estacionGrippers",
    },
    {
      id: 6,
      identifier: "BandaA",
      translationKey: "min.bandaA",
      path: "/desmoldeo/equipos",
      style: { top: "2.9%", left: "47%", width: "9.6%", height: "23%" },
      shadowColor: "shadow-[0px_0px_10px_5px_rgba(62,29,253,0.5)]",
      zIndex: "z-9",
      statusKey: "bandaA",
    },
    {
      id: 7,
      identifier: "BandaB",
      translationKey: "min.bandaB",
      path: "/desmoldeo/equipos",
      style: { top: "12.3%", left: "34.3%", width: "8.5%", height: "27%" },
      shadowColor: "shadow-[0px_0px_10px_5px_rgba(62,29,253,0.5)]",
      rotate: "rotate-[61deg]",
      statusKey: "bandaB",
    },
  ];

  useEffect(() => {
    if (websocketData.data) {
      setEquipmentData(websocketData.data);
    }
  }, [websocketData.data]);

  const handleSectionClick = (section: LayoutSection): void => {
    setEquipoSeleccionado(section.identifier);
  };

  const getEquipmentStatus = (
    section: LayoutSection
  ): EquipmentStatus | null => {
    if (!equipmentData || !section.statusKey) return null;

    const statusFunction = equipmentStatusMap[section.statusKey];

    return statusFunction ? statusFunction(equipmentData) : null;
  };

  return (
    <div className="relative w-full flex justify-center items-center rounded-lg bg-background2">
      <div className="absolute left-[10px] top-[10px] z-10 pointer-events-none">
        <EstadosLayout />
      </div>
      <Image alt="Layout" className="w-auto p-5 h-[39.5vw]" src={LayoutIMG} />
      {sections.map((section) => {
        const status = getEquipmentStatus(section);

        return (
          <Link
            key={section.id}
            href={section.path}
            onClick={() => handleSectionClick(section)}
          >
            <div
              className={`absolute cursor-pointer ease-in-out
              ${section.shadowColor} ${section.rotate || ""} ${section.zIndex || ""} 
              ${
                status?.isActive ? "bg-white/20" : "bg-transparent"
              } hover:bg-white/30 hover:shadow-[0px_0px_15px_10px_rgba(255,255,255,0.8)] group`}
              style={section.style}
            >
              <p
                className="absolute -top-5 left-1/2 -translate-x-1/2 bg-background p-2 rounded-lg 
                text-md opacity-0 transition-opacity whitespace-nowrap
                group-hover:opacity-100"
              >
                {t(section.translationKey)}
              </p>

              {status && (
                <div
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 ${status.statusClass} 
                  p-2 rounded text-md text-[#FFF] whitespace-nowrap opacity-0 group-hover:opacity-100`}
                >
                  {status.statusText}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Layout;
