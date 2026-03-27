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
    fetch("/api/auth/me").then(r => r.ok ? r.json() : null).then(d => { if (d?.user) setUser(d.user); }).catch(() => {});
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/leaderboards", label: "Leaderboard" },
    { href: "/#scoring", label: "Scoring" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-xs font-black text-white">M</div>
            <span className="text-sm font-bold text-white tracking-tight">
              car<span className="text-blue-500">mogger</span>
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="px-3 py-1.5 rounded-md text-[13px] text-zinc-400 hover:text-white transition-colors duration-200">
                {link.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href={`/u/${user.username}`} className="text-[13px] text-zinc-400 hover:text-white transition-colors">@{user.username}</Link>
                <Link href="/rate" className="px-4 py-2 rounded-md bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 transition-colors">Rate</Link>
              </>
            ) : (
              <>
                <button onClick={() => setAuthOpen(true)} className="text-[13px] text-zinc-400 hover:text-white transition-colors">Sign in</button>
                <Link href="/rate" className="px-4 py-2 rounded-md bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 transition-colors">Get Your Score</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 -mr-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4.5px]" : ""}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-6 pb-6 pt-2 space-y-1 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/[0.06]">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block py-2.5 text-sm text-zinc-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>{link.label}</a>
            ))}
            <div className="pt-3 mt-3 border-t border-white/[0.06] flex flex-col gap-2">
              {user ? (
                <>
                  <Link href={`/u/${user.username}`} className="text-sm text-zinc-400" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <Link href="/rate" className="block py-2.5 rounded-md bg-white text-black text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>Rate My Car</Link>
                </>
              ) : (
                <>
                  <button onClick={() => { setMenuOpen(false); setAuthOpen(true); }} className="text-sm text-zinc-400 text-left">Sign in</button>
                  <Link href="/rate" className="block py-2.5 rounded-md bg-white text-black text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>Get Your Score</Link>
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
