"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Spinner = () => (
  <div className="border-[3px] border-solid border-[#f3f3f3] border-t-[#e82a31] rounded-[50%] w-[20px] h-[20px] animate-spin"></div>
);

const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();

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
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      setLoading(false);

      console.log("Login functionality will be implemented later");
      console.log(`Username: ${username}, Password: ${password}`);

      sessionStorage.setItem("username", username);

      /*
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
        } else {
          toast.error(t("min.errorCredenciales"), {
            position: "bottom-center",
          });
        }
      } finally {
        setLoading(false);
      }
      */
    }, 1000); // Show spinner for 1 second to test the UI
  };

  return (
    <section className="flex h-full w-full items-center justify-center">
      {/* <Toaster position="bottom-center" richColors={true} /> */}
      <div className="w-auto h-[60vh] gap-[15px] flex flex-col items-center p-[3rem_4rem_2rem_4rem] max-w-[1920px] text-texto bg-black rounded-[15px]">
        <Image
          alt="Creminox"
          className="flex w-[65%] p-[0px] h-auto"
          height={2000}
          src="/logo/creminox.png"
          width={2000}
        />

        <form
          className="flex flex-col w-[100%] justify-between h-[60%] gap-[10px]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              {t("min.usuario")}
            </label>
            <input
              className="bg-grey p-[4px] rounded-[10px] w-[100%] h-[60%] flex items-center justify-center border-none px-[1rem]"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              {t("min.contra")}
            </label>
            <input
              className="bg-[#1f1f1f] p-[4px] rounded-[10px] w-[100%] h-[60%] flex items-center justify-center border-none px-[1rem]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && <div className="text-red-500 text-sm">{message}</div>}

          <button
            className="bg-[#e82a31] mt-[5px] p-[4px] rounded-[10px] w-[100%] h-1/5 flex items-center justify-center border-none text-[#D9D9D9] font-bold cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner /> : t("min.acceder")}
          </button>
        </form>

        <Link
          className="w-[100%] flex text-center justify-center text-[#5d5d5d] h-auto text-[14px] font-bold tracking-[0.5px] cursor-pointer hover:text-[#e82a31] transition-all duration-200 ease-in-out"
          href="/login/recuperacion"
        >
          {t("min.recuperar")}
        </Link>
      </div>
    </section>
  );
};

export default Login;
