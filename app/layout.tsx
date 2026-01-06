import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "คาเฟ่ 101 | Recipe Calculator",
  description: "เครื่องคำนวณสูตรเครื่องดื่มคาเฟ่ - มัทฉะ กาแฟ ชาไทย โกโก้",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
