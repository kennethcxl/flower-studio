import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bouquet Atelier",
  description: "Generate florist-styled bouquet inspiration from selected bouquet specs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
