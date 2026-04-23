import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "University Architect",
  description: "Multi-agent degree blueprint generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
