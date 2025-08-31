import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TinyCompress - Next.js with Sharp",
  description: "Image compression with Sharp library and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
