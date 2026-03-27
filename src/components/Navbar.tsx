"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";

interface UserInfo {
  username: string;
  avatarUrl: string | null;
  level: number;
  league: string;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
              { href: "/#how-it-works", label: "How it Works" },
              { href: "/#leaderboard", label: "Leaderboard" },
              { href: "/#leagues", label: "Leagues" },
              { href: "/#scoring", label: "Scoring" },
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

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-all press-effect"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center text-xs font-black text-blue-400">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--text-secondary)]">@{user.username}</span>
                </Link>
                <Link
                  href="/rate"
                  className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold hover:from-blue-400 hover:to-blue-500 transition-all press-effect btn-shine shadow-lg shadow-blue-500/25"
                >
                  Rate
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-all press-effect"
                >
                  Sign in
                </button>
                <Link
                  href="/rate"
                  className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold hover:from-blue-400 hover:to-blue-500 transition-all press-effect btn-shine shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Get Your Score
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger - SVG lines */}
          <button className="md:hidden p-2 press-effect" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="20" height="16" viewBox="0 0 20 16" className="text-white">
              <rect
                y={menuOpen ? "7" : "0"}
                width="20"
                height="2"
                rx="1"
                fill="currentColor"
                className="transition-all duration-300 origin-center"
                style={{ transform: menuOpen ? "rotate(45deg)" : "none" }}
              />
              <rect
                y="7"
                width={menuOpen ? "0" : "14"}
                height="2"
                rx="1"
                fill="currentColor"
                className="transition-all duration-300"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <rect
                y={menuOpen ? "7" : "14"}
                width="20"
                height="2"
                rx="1"
                fill="currentColor"
                className="transition-all duration-300 origin-center"
                style={{ transform: menuOpen ? "rotate(-45deg)" : "none" }}
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-5 pb-5 pt-2 space-y-1 border-t border-[var(--border)]">
            {[
              { href: "/#how-it-works", label: "How it Works" },
              { href: "/#leaderboard", label: "Leaderboard" },
              { href: "/#leagues", label: "Leagues" },
              { href: "/#scoring", label: "Scoring" },
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
            {user ? (
              <>
                <Link
                  href={`/profile/${user.username}`}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/rate"
                  className="block px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-center mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Rate My Car
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMenuOpen(false); setAuthOpen(true); }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  Sign in with Google
                </button>
                <Link
                  href="/rate"
                  className="block px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 text-center mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Your Score
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
