import SiteNavigation from "@/components/layout/site-navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThirdwebProvider } from "@/lib/thirdweb";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-background antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <ThirdwebProvider>
            <SiteNavigation />
            {children}
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
