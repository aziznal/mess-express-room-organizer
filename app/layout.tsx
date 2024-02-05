import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { DarkModeContextProvider } from "../lib/context/darkModeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/tanstack-query-client";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MessExpress",
  description: "An app to help you organize your room(s)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full")}>
        <QueryClientProvider client={queryClient}>
          <DarkModeContextProvider>
            {children}
            <Toaster />
          </DarkModeContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
