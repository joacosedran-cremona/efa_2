import {heroui} from "@heroui/theme"

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
      colors: {
        'orange': '#EF8225',
        'oranget': '#F826',
        'blue': '#30A0F0',
        'bluet': '#06E5',
        'water': '#33A7FD',
        'red': '#F00',
        'green': '#54C42D',
        'lightGrey': '#8C8C8C',
        'grey': '#1F1F1F',
        'black': '#131313',
        'footerbg': '#2C2C2C'
      },
      spacing: {
        '4' : '0px 0px 0px 0px',
        '1' : '133px 20px 20px 20px',
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(
      {
        themes: {
          light: {
            colors: {
              background: "#D9D9D9",
              headerbg: '#1F1F1F',
            }
          },

          dark: {
            colors: {
              background: "#1F1F1F",
              headerbg: '#D9D9D9',
            }
          }
        }
      }
    )
  ],
}

module.exports = config;