import type { Metadata } from "next";
import "./globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
// Vercel Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { Readex_Pro } from "next/font/google";

const readexPro = Readex_Pro({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Abdul Khader's Portfolio",
    default: "Abdul Khader - Data Science & Machine Learning Enthusiast",
  },
  description: "Student from Hyderabad, India, passionate about Data Science, Machine Learning, and Web Development. Exploring tech frontiers like Cybersecurity and Blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${readexPro.className} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider attribute="class">
            <Toaster />
            {children}
          </ThemeProvider>
        </NuqsAdapter>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
