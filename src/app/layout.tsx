import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Storycita",
  description: "Library",
};

const starborn = localFont({
  src: [
    {
      path: "./../fonts/Starborn.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-starborn",
});

const epunda = localFont({
  src: [
    {
      path: "./../fonts/Epunda.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-epunda",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${starborn.variable} ${epunda.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
