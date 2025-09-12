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

  // Check if we're on the desmoldeo page to adjust footer
  const isDesmoldeoPage =
    pathname === "/desmoldeo" || pathname.startsWith("/desmoldeo/");

  return (
    <div className="flex flex-col flex-grow min-h-screen">
      <div className="sticky top-0 left-0 w-full z-[999]">
        {!hideHeaderFooter && <Header />}
        {!hideHeaderFooter && showHeader2 && <Header2 />}
      </div>
      <main className={`flex-grow ${isDesmoldeoPage ? "pl-[270px]" : ""}`}>
        {children}
      </main>
      <div className={isDesmoldeoPage ? "pl-[270px]" : ""}>
        {!hideHeaderFooter && <Footer />}
      </div>
    </div>
  );
}
