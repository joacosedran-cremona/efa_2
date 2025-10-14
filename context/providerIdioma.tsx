"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang =
      localStorage.getItem("selectedLanguage") ||
      document.cookie.match(/selectedLanguage=([^;]+)/)?.[1];

    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  return <>{children}</>;
};
