import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Web",
  description: "Interfaz moderna de chat AI con OpenCart",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es"
      suppressHydrationWarning={true}
    >
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
