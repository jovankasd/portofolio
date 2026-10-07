import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Obsidian & Atmosphere | Portfolio",
  description:
    "Portfolio karya sistem AI, knowledge infrastructure, dan product engineering.",
  openGraph: {
    title: "Obsidian & Atmosphere | Portfolio",
    description: "Karya dan catatan dari seorang AI engineer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
