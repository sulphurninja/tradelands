import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TradeLands.IND — Premium Agriculture Land & NA Villa Plots",
    template: "%s · TradeLands.IND",
  },
  description:
    "Agriculture land, NA villa plots, and farm houses in India — with clear pricing, legal papers, and online booking.",
  keywords: [
    "agriculture land",
    "NA villa plot",
    "farm house",
    "land investment India",
    "TradeLands",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full font-body antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
