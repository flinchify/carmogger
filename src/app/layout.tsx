import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarMogger",
  description: "Upload your car. Get an AI-powered rating across Aura, Larp, Money, Demand and Hype. Compete on the global leaderboard.",
  keywords: ["car rating", "car mog", "car score", "car community", "AI car rating"],
  metadataBase: new URL("https://carmogger.com"),
  openGraph: { title: "CarMogger — AI Car Ratings", description: "Upload your car. Get rated across 5 categories. Climb the leaderboard.", url: "https://carmogger.com", siteName: "CarMogger", type: "website" },
  twitter: { card: "summary_large_image", title: "CarMogger — AI Car Ratings", description: "Upload your car. Get rated. Climb the leaderboard." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="w-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="w-full min-h-screen">{children}</body>
    </html>
  );
}
