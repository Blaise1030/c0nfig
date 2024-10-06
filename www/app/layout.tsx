import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { DM_Mono, Inter } from "next/font/google";
import "./globals.css";
import { BackgroundPattern } from "@/components/background-pattern";
import { Analytics } from "@vercel/analytics/react";

const regularFont = Inter({
  subsets: ["latin"],
  variable: "--font-regular",
  display: "swap",
});

const codeFont = DM_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Kommander",
  description:
    "This comprehensive documentation template, crafted with Next.js and available as open-source, delivers a sleek and responsive design, tailored to meet all your project documentation requirements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Analytics />
      <head>
        <meta
          name="google-site-verification"
          content="tWqhMLMr3tLCIsVHvSXX_qc7spW5az1XUdoP-ESeyXY"
        />
      </head>

      <body
        className={`${regularFont.variable} ${codeFont.variable} font-regular`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="sm:container mx-auto w-[88vw] h-auto">
            {children}
          </main>
        </ThemeProvider>
        <BackgroundPattern />
      </body>
    </html>
  );
}
