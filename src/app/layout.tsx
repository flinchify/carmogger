import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarMog - Rate Your Car's Mog Score",
  description: "Upload your car, get an AI-powered mog rating. Compete on the leaderboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
