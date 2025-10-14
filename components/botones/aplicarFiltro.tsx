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
      className="flex flex-row justify-evenly bg-background3 p-2 w-full hover:bg-background4"
      isDisabled={isDisabled}
      radius="sm"
      variant="bordered"
      onClick={onClick}
    >
      <p className="w-full text-lg">{t("min.aplicarCambios")}</p>
      <FaSearch />
    </Button>
  );
};

export default BotonFiltro;
