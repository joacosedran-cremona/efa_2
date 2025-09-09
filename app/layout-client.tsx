"use client";
import Header from "@/components/footer&header/header";
import Footer from "@/components/footer&header/footer";
import { usePathname } from "next/navigation";

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
    <div className="relative flex flex-col h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
