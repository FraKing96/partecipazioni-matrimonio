import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Nicole & Francesco — 20 Maggio 2027",
  description:
    "Siamo felici di invitarvi al nostro matrimonio. Confermate la vostra partecipazione.",
  openGraph: {
    title: "Nicole & Francesco — Matrimonio",
    description: "20 Maggio 2027 — Conferma la tua partecipazione",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${cormorant.variable} ${lato.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
