import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarMog - Rate Your Car's Mog Score",
  description: "Upload your car. Get an AI-powered mog rating across Aura, Larp, Money, Demand and Hype. Compete on the global leaderboard. Flex your score everywhere.",
  keywords: ["car rating", "car mog", "car score", "car community", "car leaderboard"],
  openGraph: {
    title: "CarMog - Rate Your Car's Mog Score",
    description: "Upload your car. Get rated. Climb the leaderboard.",
    url: "https://carmogger.com",
    siteName: "CarMog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarMog - Rate Your Car's Mog Score",
    description: "Upload your car. Get rated. Climb the leaderboard.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
