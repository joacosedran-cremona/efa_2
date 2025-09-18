"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import axios from "axios";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This is a placeholder. In a real app, you would connect to your backend 
      // password recovery endpoint
      await axios.post(
        `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/usuario/recuperar-password`,
        { email }
      );
      
      toast.success("Correo de recuperación enviado correctamente", {
        position: "bottom-center",
        duration: 3000,
      });
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
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
        <Image
          alt="Creminox"
          className="flex w-[60%] p-[0px] h-auto"
          height={2000}
          src="/logo/creminox.png"
          width={2000}
        />

        <form 
          className="w-[100%] h-3/5 flex flex-col justify-evenly"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-semibold text-[17px] tracking-[0.5px]">
              {t("formulario.correo")}
            </label>
            <input
              className="bg-[#1f1f1f] p-[4px] rounded-lg w-[100%] h-[60%] flex items-center justify-center border-none px-[1rem]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className="bg-[#e82a31] p-[4px] rounded-lg w-[100%] h-1/6 flex items-center justify-center border-none text-[#D9D9D9] font-semibold cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="border-[3px] border-solid border-[#f3f3f3] border-t-[#e82a31] rounded-lg w-[20px] h-[20px] animate-spin" />
            ) : (
              t("formulario.enviar")
            )}
          </button>
        </form>

        <Link
          className="w-[100%] flex text-center justify-center text-[#5d5d5d]"
          href="../login"
        >
          {t("formulario.recordo")}
        </Link>
      </div>
    </section>
  );
};

export default ForgotPassword;
