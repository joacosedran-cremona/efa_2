"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import axios from "axios";

import LogoBase64 from "@/components/LogoBase64";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const target = localStorage.getItem("targetAddress");

      if (!target) throw new Error("Target address not available");
      await axios.post(`http://${target}/usuario/recuperar-password`, {
        email,
      });

      toast.success("Correo de recuperación enviado correctamente", {
        position: "bottom-center",
        duration: 3000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      toast.error("Error al enviar el correo de recuperación", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex w-[100%] h-[90vh] items-center justify-center">
      <Toaster position="bottom-center" richColors={true} />
      <div className="w-auto h-[60%] gap-[15px] flex flex-col items-center justify-between p-[3rem_4rem_2rem_4rem] max-w-[1920px] text-[#D9D9D9] bg-[#131313] rounded-lg">
        <LogoBase64 className="flex w-[65%] h-auto" />

        <form
          className="w-[100%] h-3/5 flex flex-col justify-evenly"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-[5px] h-1/2">
            <label className="flex font-semibold text-[17px] tracking-[0.5px]">
              {t("min.correo")}
            </label>
            <input
              required
              className="bg-[#1f1f1f] p-[4px] rounded-lg w-[100%] h-[50%] flex items-center justify-center border-none px-[1rem]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="bg-[#e82a31] mt-[5px] p-[4px] rounded-lg w-[100%] h-[1.7rem] flex items-center justify-center border-none font-semibold cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed text-white"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <div className="border-[3px] border-solid border-[#f3f3f3] border-t-[#e82a31] rounded-[100%] w-[20px] h-[20px] animate-spin" />
            ) : (
              t("min.enviar")
            )}
          </button>
        </form>

        <Link
          className="w-[100%] flex text-center justify-center text-[#5d5d5d]"
          href="../login"
        >
          {t("min.recordo")}
        </Link>
      </div>
    </section>
  );
};

export default ForgotPassword;
