import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|date-picker|dropdown|skeleton|table|ripple|spinner|calendar|date-input|form|popover|menu|divider|checkbox|spacer|pagination).js",
    "./node_modules/@heroui/theme/dist/components/spinner.js",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        1365: "1365px",
        1050: "1050px",
        545: "545px",
      },
      colors: {
        orange: "#EF8225",
        oranget: "#F826",
        blue: "#30A0F0",
        bluet: "#06E5",
        water: "#33A7FD",
        red: "#F00",
        green: "#54C42D",
        lightGrey: "#8C8C8C",
        grey: "#1F1F1F",
        black: "#131313",
        footerbg: "#2C2C2C",
        datosRed: "#581420",
        datosGrey: "#5a5a5a",
      },
      spacing: {
        4: "0px 0px 0px 0px",
        1: "133px 20px 20px 20px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FDFDFD",
            background2: "#EDEDED",
            background3: "#E0E0E0",
            background4: "#D8D8D8",
            background5: "#D3D3D3",
            headerbg: "#a4deffff",
            texto: "#131313",
            textoheader: "#111",
          },
        },

        dark: {
          colors: {
            background: "#1B1B1B",
            background2: "#222",
            background3: "#292929",
            background4: "#333",
            background5: "#393939",
            headerbg: "#111",
            texto: "#FFF",
            textoheader: "#FFF",
          },
        },
      },
    }),
  ],
};

module.exports = config;
