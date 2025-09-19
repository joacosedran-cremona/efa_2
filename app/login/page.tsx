"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Toaster, toast } from "sonner";

import LogoBase64 from "@/components/LogoBase64";
import { useApp } from "@/context/AppContext";

const Spinner = () => (
  <div className="border-[3px] border-solid border-[#f3f3f3] border-t-[#e82a31] rounded-[100%] w-[20px] h-[20px] animate-spin" />
);

const Login = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useApp();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await login(username, password);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("acceso", "true");
      router.push("/");
    } catch (error: any) {
      if (error.message === "Credenciales inválidas") {
        toast.error(t("min.credencialesInvalidas"), {
          position: "bottom-center",
        });
      } else if (error.response) {
        toast.error(
          `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
          {
            position: "bottom-center",
          },
        );
      } else if (error.request) {
        toast.error(
          t("min.errorCredenciales") + " (Sin respuesta del servidor)",
          {
            position: "bottom-center",
          },
        );
      } else {
        toast.error(t("min.errorCredenciales"), {
          position: "bottom-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-full w-full items-center justify-center">
      <Toaster position="bottom-center" richColors={true} />
      <div className="w-auto h-[60vh] gap-[15px] flex flex-col items-center p-[3rem_4rem_2rem_4rem] max-w-[1920px]  bg-backgroundoscuro rounded-lg">
        <LogoBase64 className="flex w-[65%] p-[0px] h-auto" />

        <form
          className="flex flex-col w-[100%] justify-between h-[60%] gap-[10px]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-semibold text-[17px] tracking-[0.5px]">
              {t("min.usuario")}
            </label>
            <input
              className="bg-background2 p-[4px] rounded-lg w-[100%] h-[60%] flex items-center justify-center border-none px-[1rem]"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-semibold text-[17px] tracking-[0.5px]">
              {t("min.contra")}
            </label>
            <input
              className="bg-background2 p-[4px] rounded-lg w-[100%] h-[60%] flex items-center justify-center border-none px-[1rem]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && <div className="text-red-500 text-sm">{message}</div>}

          <button
            className="bg-[#e82a31] mt-[5px] p-[4px] rounded-lg w-[100%] h-1/5 flex items-center justify-center border-none font-semibold cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed text-white"
            disabled={loading}
            type="submit"
          >
            {loading ? <Spinner /> : t("min.acceder")}
          </button>
        </form>

        <Link
          className="w-[100%] flex text-center justify-center text-[#5d5d5d] h-auto text-[14px] font-semibold tracking-[0.5px] cursor-pointer hover:text-[#e82a31] ease-in-out"
          href="/login/recuperacion"
        >
          {t("min.recuperar")}
        </Link>
      </div>
    </section>
  );
};

export default Login;
