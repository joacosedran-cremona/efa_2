import { Navbar as HeroUINavbar } from "@heroui/navbar";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <ThemeSwitch />
    </HeroUINavbar>
  );
};
