"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "./navbar";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="text-black">
      <Navbar currentPath={pathname} />
    </header>
  );
}
