import type { Metadata } from "next";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

export const metadata: Metadata = {
  title: "c0nfig",
  metadataBase: new URL("https://c0nfig.vercel.app/"),
  description: "Create reusable CLI setup tools for your project using c0nfig.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="google-site-verification" content="tWqhMLMr3tLCIsVHvSXX_qc7spW5az1XUdoP-ESeyXY" />
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
      {process.env.NODE_ENV === "production" ? (
        <GoogleTagManager gtmId={'G-H02XVDM9DP'} />
      ) : null}
      {
        process.env.NODE_ENV === 'production' ? (
          <Analytics />
        ) : null
      }
    </html>
  );
}
