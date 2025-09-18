import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";
import LayoutClient from "./layout-client";

import { AuthProvider } from "@/context/AuthContext";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={`min-h-screen text-foreground bg-background font-sans antialiased text-texto ${fontSans.variable}`}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuthProvider>
            <LayoutClient>{children}</LayoutClient>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
