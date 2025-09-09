"use client";
import { useTranslation } from "react-i18next";

export default function Completo() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="">{t("titulo")}</h1>
    </section>
  );
}
