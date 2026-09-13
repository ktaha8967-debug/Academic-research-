import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AcademicAI — Open Source Academic Research Platform",
  description: "Specialized AI agents for academic paper discovery, systematic literature reviews, hypothesis generation, evidence verification, and peer review simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
