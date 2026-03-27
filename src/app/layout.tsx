import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarMogger - Rate Your Car's Mog Score",
  description: "Upload your car. Get an AI-powered mog rating across Aura, Larp, Money, Demand and Hype. Compete on the global leaderboard. Flex your score everywhere.",
  keywords: ["car rating", "car mog", "car score", "car community", "car leaderboard", "AI car rating"],
  metadataBase: new URL("https://carmogger.com"),
  openGraph: {
    title: "CarMogger - Does Your Car Mog?",
    description: "Upload your car. Get rated across 5 brutal categories. Climb the leaderboard.",
    url: "https://carmogger.com",
    siteName: "CarMogger",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarMogger - Does Your Car Mog?",
    description: "Upload your car. Get rated. Climb the leaderboard.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
