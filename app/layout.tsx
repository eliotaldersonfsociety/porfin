import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";  // Asegúrate de que la ruta sea correcta
import { SessionProvider } from "../context/SessionContext"; // Asegúrate de que la ruta sea correcta
import { Toaster } from "react-hot-toast"; // Para las notificaciones

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your E-commerce Store",
  description: "Shop the latest products with our easy-to-use platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Envuelve los children con los contextos */}
        <SessionProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
