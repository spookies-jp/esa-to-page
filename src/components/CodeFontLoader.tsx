'use client';

import { Geist_Mono } from "next/font/google";
import { useEffect } from "react";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Don't preload, load on demand
});

export default function CodeFontLoader() {
  useEffect(() => {
    // Apply the font variable to the document
    if (geistMono.variable) {
      document.documentElement.style.setProperty('--font-geist-mono', geistMono.style.fontFamily);
    }
  }, []);

  return null;
}