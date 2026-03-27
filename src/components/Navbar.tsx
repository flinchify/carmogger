"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";

interface UserInfo { username: string; avatarUrl: string | null; }

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    fetch("/api/auth/me").then(r => r.ok ? r.json() : null).then(d => { if (d?.user) setUser(d.user); }).catch(() => {});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#scoring", label: "Scoring" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/leaderboards", label: "Leaderboard" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-[#09090b]/90 backdrop-blur-md border-b border-[var(--border)]" : ""}`}>
        <div className="max-w-[1080px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-white tracking-tight">carmogger</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.href} href={l.href} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">{l.label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href={`/u/${user.username}`} className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">@{user.username}</Link>
                <Link href="/rate" className="h-8 px-4 rounded-[var(--radius-sm)] bg-white text-[#09090b] text-[13px] font-medium flex items-center hover:bg-zinc-200 transition-colors">Rate</Link>
              </>
            ) : (
              <>
                <button onClick={() => setAuthOpen(true)} className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Sign in</button>
                <Link href="/rate" className="h-8 px-4 rounded-[var(--radius-sm)] bg-white text-[#09090b] text-[13px] font-medium flex items-center hover:bg-zinc-200 transition-colors">Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 -mr-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className="w-4 flex flex-col gap-[5px]">
              <span className={`block h-[1.5px] bg-zinc-400 transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-[3.25px]" : ""}`} />
              <span className={`block h-[1.5px] bg-zinc-400 transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-[3.25px]" : ""}`} />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#09090b] border-b border-[var(--border)] px-6 pb-4 pt-1">
            {links.map(l => (
              <a key={l.href} href={l.href} className="block py-2 text-[14px] text-[var(--text-muted)] hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <div className="mt-3 pt-3 border-t border-[var(--border)] flex flex-col gap-2">
              {user ? (
                <Link href="/rate" className="py-2 text-center rounded-[var(--radius-sm)] bg-white text-[#09090b] text-[13px] font-medium" onClick={() => setMenuOpen(false)}>Rate My Car</Link>
              ) : (
                <>
                  <button onClick={() => { setMenuOpen(false); setAuthOpen(true); }} className="py-2 text-[13px] text-[var(--text-muted)] text-left">Sign in</button>
                  <Link href="/rate" className="py-2 text-center rounded-[var(--radius-sm)] bg-white text-[#09090b] text-[13px] font-medium" onClick={() => setMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
