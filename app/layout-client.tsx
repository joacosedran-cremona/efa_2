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

  const showHeader2 =
    pathname === "/" ||
    pathname === "/desmoldeo" ||
    pathname.startsWith("/desmoldeo/");

  const isDesmoldeoPage = pathname === "/desmoldeo";

  return (
    <div className="flex flex-col flex-grow min-h-screen">
      <div className="sticky top-0 left-0 w-full z-[999]">
        {!hideHeaderFooter && <Header />}
        {!hideHeaderFooter && showHeader2 && <Header2 />}
      </div>
      <main
        className={`flex-grow ${isDesmoldeoPage ? "pl-[270px]" : ""} ${pathname === "/login" || pathname === "/login/recuperacion" ? "flex justify-center items-center" : ""}`}
      >
        {children}
      </main>
      <div className={isDesmoldeoPage ? "pl-[270px]" : ""}>
        {!hideHeaderFooter && <Footer />}
      </div>
    </div>
  );
}
