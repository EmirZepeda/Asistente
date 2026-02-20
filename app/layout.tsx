// app/layout.tsx
import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: "Vault.Lock - Emir Zepeda",
  description: "Bóveda de seguridad biométrica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#0a0f1a]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}