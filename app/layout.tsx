import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
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

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jovanka Surya Dilla — AI Orchestrator",
  description:
    "Portofolio Jovanka Surya Dilla, AI Orchestrator dan Agentic Systems Engineer.",
  openGraph: {
    title: "Jovanka Surya Dilla — AI Orchestrator",
    description: "Portofolio rekayasa sistem AI dan orkestrasi agen otonom oleh Jovanka Surya Dilla.",
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
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} min-h-screen antialiased bg-surface text-on-surface`}
      >
        {children}
      </body>
    </html>
  );
}
