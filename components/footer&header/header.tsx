"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "./navbar";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/cocinas" || pathname === "/enfriadores";

    return (
        <header className="w-[100%] text-black">
        <Navbar currentPath={pathname} />
        {/*isHome && <Header2 currentPath={pathname} />}{" "*/}
        {/* Header2 solo aparece si no es la página de inicio */}
        </header>
    );
}
