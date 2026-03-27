"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import AuthModal from "@/components/AuthModal";

interface UserInfo {
  username: string;
  avatarUrl: string | null;
  level: number;
  league: string;
}

const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#scoring", label: "Scoring" },
  { href: "/#leaderboard", label: "Leaderboard" },
  { href: "/#leagues", label: "Leagues" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setUser(d.user);
      })
      .catch(() => {});
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setMenuOpen(false);
      if (href.startsWith("/#")) {
        e.preventDefault();
        const id = href.slice(2);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl rounded-2xl nav-glass border border-transparent ${
          scrolled ? "scrolled" : "bg-white/0"
        }`}
      >
        <div className="px-5 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center font-black text-sm text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              M
            </div>
            <span
              className={`text-lg font-black tracking-tight transition-colors duration-300 ${
                scrolled ? "text-[#0f172a]" : "text-white"
              }`}
            >
              car<span className="text-blue-500">mogger</span>
            </span>
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 hover:scale-[1.04] ${
                  scrolled
                    ? "text-gray-500 hover:text-[#0f172a] hover:bg-gray-100/70"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth — right */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {user ? (
              <>
                <Link
                  href={`/u/${user.username}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-[1.03] ${
                    scrolled
                      ? "text-gray-600 hover:bg-gray-100/70"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-xs font-black text-blue-500">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium">@{user.username}</span>
                </Link>
                <Link
                  href="/rate"
                  className="px-5 py-2 rounded-xl bg-blue-500 text-white text-sm font-bold magnetic-btn btn-shine"
                >
                  Rate
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen(true)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.04] ${
                    scrolled
                      ? "text-gray-500 hover:text-[#0f172a] hover:bg-gray-100/70"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Sign in
                </button>
                <Link
                  href="/rate"
                  className="px-5 py-2 rounded-xl bg-blue-500 text-white text-sm font-bold magnetic-btn btn-shine shadow-md shadow-blue-500/20"
                >
                  Get Your Score
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${
                  scrolled ? "bg-[#0f172a]" : "bg-white"
                } ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              />
              <span
                className={`block h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? "bg-[#0f172a]" : "bg-white"
                } ${menuOpen ? "opacity-0 scale-0" : ""}`}
              />
              <span
                className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${
                  scrolled ? "bg-[#0f172a]" : "bg-white"
                } ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-out overflow-hidden ${
            menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 pt-2 space-y-1 border-t border-gray-200/40 bg-white rounded-b-2xl">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#0f172a] hover:bg-gray-50 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Link
                    href={`/u/${user.username}`}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#0f172a] hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/rate"
                    className="block px-4 py-3 rounded-xl text-sm font-bold text-white bg-blue-500 text-center hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Rate My Car
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setAuthOpen(true);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#0f172a] hover:bg-gray-50 transition-all duration-200"
                  >
                    Sign in
                  </button>
                  <Link
                    href="/rate"
                    className="block px-4 py-3 rounded-xl text-sm font-bold text-white bg-blue-500 text-center hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Your Score
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
