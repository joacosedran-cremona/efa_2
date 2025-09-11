"use client";
import { usePathname } from "next/navigation";

import Header from "@/components/footer&header/header";
import Header2 from "@/components/footer&header/header2";
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

  // Check if current path needs Header2
  const showHeader2 =
    pathname === "/completo" ||
    pathname === "/desmoldeo" ||
    pathname === "/" ||
    pathname.startsWith("/desmoldeo/");

  return (
    <div className="relative flex flex-col w-screen h-screen">
      {!hideHeaderFooter && <Header />}
      {!hideHeaderFooter && showHeader2 && <Header2 />}
      <main className="flex-grow">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
