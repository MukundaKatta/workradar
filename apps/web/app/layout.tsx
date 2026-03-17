import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkRadar — AI-Powered Job Discovery",
  description:
    "Stop searching. Start discovering. WorkRadar uses AI to match you with opportunities that fit your skills, goals, and preferences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
