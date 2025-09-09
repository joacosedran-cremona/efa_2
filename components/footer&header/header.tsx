"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "./navbar";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-[100%] text-black">
      <Navbar currentPath={pathname} />
    </header>
  );
}
