import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KalusteBotti",
  description: "Huolto- ja hoito-ohjeita tarjoava Tekoälysovellus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const headersList = headers();
  // const bodyClass = headersList.get("x-body-class") || "";

  return (
    <html lang="fi">
      <body
        className={cn(
          "min-h-full bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
