import { Navbar as HeroUINavbar } from "@heroui/navbar";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="full" position="sticky" className="bg-headerbg">
      
      <ThemeSwitch />
    </HeroUINavbar>
  );
};
