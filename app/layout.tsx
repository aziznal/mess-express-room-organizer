import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/tanstack-query-client";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";
import { DarkModeProvider } from "@/components/ToggleDarkMode";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MessExpress",
  description: "An app to help you organize your room(s)",
};

const DARKMODE_COOKIE_KEY = "darkmode";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDarkMode = cookies().get(DARKMODE_COOKIE_KEY)?.value === "true";

  return (
    <html lang="en" className={cn("h-full", isDarkMode && "dark")}>
      <body className={cn(inter.className, "h-full overflow-hidden")}>
        <QueryClientProvider client={queryClient}>
          <DarkModeProvider initialValue={isDarkMode} cookieKey={DARKMODE_COOKIE_KEY}>
            {children}
            <Toaster />
          </DarkModeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
