import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import "./globals.css";

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
      className={`${geistMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <AppProviders>
          {children}
          <Suspense fallback={null}>
            <MetaPixel />
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
