"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 press-effect">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center font-black text-sm">
            M
          </div>
          <span className="text-lg font-black tracking-tight">
            Car<span className="text-[var(--accent)]">Mog</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/rate" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
            Rate
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
            Leaderboard
          </Link>
          <Link href="/leagues" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
            Leagues
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/rate"
            className="px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-bold hover:brightness-110 transition-all press-effect animate-pulse-glow"
          >
            Rate Your Car
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link href="/rate" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Rate Your Car</Link>
            <Link href="/leaderboard" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
            <Link href="/leagues" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Leagues</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
