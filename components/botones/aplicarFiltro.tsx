"use client";

import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

interface BotonFiltroProps {
  onClick: () => void;
  isDisabled?: boolean;
}

const BotonFiltro = ({ onClick, isDisabled }: BotonFiltroProps) => {
  const { t } = useTranslation();
  return (
    <Button
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "17px",
      }}
      onClick={onClick}
      isDisabled={isDisabled}
      className="bg-background3 hover:bg-background4 rounded-lg"
    >
      {t("min.aplicarCambios")}
      <FaSearch />
    </Button>
  );
};

export default BotonFiltro;
