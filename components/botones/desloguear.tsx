"use client";

import React, { useState, useRef, useEffect } from "react";
import { VscAccount } from "react-icons/vsc";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface DesloguearProps {
  _username?: string;
}

const Desloguear: React.FC<DesloguearProps> = ({ _username = "Usuario" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="relative flex items-center justify-center w-[25px] h-[25px] rounded-lg group ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />
        <VscAccount className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
      </button>

      <div
        className={`absolute left-[-10px] mt-[14px] w-48 rounded-lg transform ease-in-out origin-top-right shadow-[0_0_15px_rgba(0,0,0,0.3)]
                ${
                  isOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                } bg-background3 z-[999]`}
      >
        {/* Header del perfil */}
        <div className="px-[10px] py-[14px] border-b border-gray-200">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium ">Creminox</p>
              <p className="text-xs text-gray-600">{t("deslogueo.estado")}</p>
            </div>
          </div>
        </div>

        {/* Botón de cerrar sesión - Updated styles */}
        <div className="bg-cerrarsesion rounded-b-lg text-[#FFF]">
          <button
            className="w-[100%] text-left px-[10px] py-[8px] text-sm font-bold
                                 hover:bg-[#ff7a7e] rounded-b-lg
                                 active:bg-red-200 active:text-black
                                 ease-in-out flex items-center space-x-2
                                 cursor-pointer"
            onClick={handleLogout}
          >
            <span>{t("min.cerrarSesion")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Desloguear;
