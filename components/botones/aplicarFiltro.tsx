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
      className="bg-background3 hover:bg-background4"
      isDisabled={isDisabled}
      radius="sm"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "17px",
      }}
      variant="bordered"
      onClick={onClick}
    >
      {t("min.aplicarCambios")}
      <FaSearch />
    </Button>
  );
};

export default BotonFiltro;
