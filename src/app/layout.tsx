import type { Metadata } from "next";
import { Raleway, Bebas_Neue, Lora } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ignition Knowledge Base",
    template: "%s | Ignition Knowledge Base",
  },
  description:
    "Internal knowledge portal for Ironmark's Ignition platform — strategy, capabilities, competitive intelligence, and GTM enablement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${bebasNeue.variable} ${lora.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
