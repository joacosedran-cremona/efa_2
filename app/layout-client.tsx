"use client";
import { usePathname } from "next/navigation";

import Header from "@/components/footer&header/header";
import Footer from "@/components/footer&header/footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderFooter = [
    "/signup",
    "/login",
    "/login/recuperacion",
  ].includes(pathname);

  return (
    <div className="relative flex flex-col w-screen h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
