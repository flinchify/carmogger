"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-2xl transition-all duration-500 nav-float ${
      scrolled ? "scrolled top-3" : "bg-transparent"
    }`}>
      <div className="px-5 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 press-effect group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <span className="relative z-10">M</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            car<span className="text-[var(--accent)]">mogger</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "#how-it-works", label: "How it Works" },
            { href: "#leaderboard", label: "Leaderboard" },
            { href: "#leagues", label: "Leagues" },
            { href: "#scoring", label: "Scoring" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/rate"
            className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold hover:from-blue-400 hover:to-blue-500 transition-all press-effect btn-shine shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Get Your Score
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 press-effect" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="relative w-5 h-4">
            <span className={`absolute left-0 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "w-5 top-2 rotate-45" : "w-5 top-0"}`} />
            <span className={`absolute left-0 top-2 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-3.5 opacity-100"}`} />
            <span className={`absolute left-0 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "w-5 top-2 -rotate-45" : "w-5 top-4"}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-5 pt-2 space-y-1 border-t border-[var(--border)]">
          {[
            { href: "#how-it-works", label: "How it Works" },
            { href: "#leaderboard", label: "Leaderboard" },
            { href: "#leagues", label: "Leagues" },
            { href: "#scoring", label: "Scoring" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/rate"
            className="block px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Get Your Score
          </Link>
        </div>
      </div>
    </nav>
  );
}
