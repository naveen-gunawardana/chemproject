import type { Metadata } from "next";
import {
  Press_Start_2P,
  VT323,
  Silkscreen,
  Pixelify_Sans,
} from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sports Drink Tycoon — SFUHS Chemistry Final",
  description:
    "A chemistry final project by Naveen Gunawardana. Play the game and read the standards report.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${vt323.variable} ${silkscreen.variable} ${pixelify.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
