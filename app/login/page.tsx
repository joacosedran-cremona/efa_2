"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sessionStorage.setItem("access", "permitido");
    router.push("/");
  };

  return (
    <section className="flex h-[100%] w-full items-center justify-center">
      <div className="w-auto h-[60vh] gap-[15px] flex flex-col items-center p-[3rem_4rem_2rem_4rem] max-w-[1920px] text-texto bg-black rounded-[15px]">
        <Image
          alt="Creminox"
          className="flex w-[65%] p-[0px] h-auto"
          height={2000}
          width={2000}
          src="/logo/creminox.png"
        />

        <form
          className="flex flex-col w-[100%] justify-between h-[60%] gap-[10px]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              {t("formulario.usuario")}
            </label>
            <input
              className="bg-grey p-[4px] rounded-[10px] w-[100%] h-[60%] flex items-center justify-center border-none px-[1rem]"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              {t("formulario.contra")}
            </label>
            <input
              className="bg-[#1f1f1f] p-[4px] rounded-[10px] w-[100%] h-[60%] flex items-center justify-center border-none px-[1rem]"
              type="password"
            />
          </div>

          <button
            className="bg-[#e82a31] mt-[5px] p-[4px] rounded-[10px] w-[100%] h-1/5 flex items-center justify-center border-none text-[#D9D9D9] font-bold cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed"
            type="submit"
          >
            {t("formulario.acceder")}
          </button>
        </form>

        <Link
          className="w-[100%] flex text-center justify-center text-[#5d5d5d] h-auto text-[14px] font-bold tracking-[0.5px] cursor-pointer hover:text-[#e82a31] transition-all duration-200 ease-in-out"
          href="/login/recuperacion"
        >
          {t("formulario.recuperar")}
        </Link>
      </div>
    </section>
  );
};

export default Login;
