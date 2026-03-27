"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";

interface UserInfo { username: string; avatarUrl: string | null; }

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    fetch("/api/auth/me").then(r => r.ok ? r.json() : null).then(d => { if (d?.user) setUser(d.user); }).catch(() => {});
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#scoring", label: "Scoring" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/leaderboards", label: "Leaderboard" },
  ];

  return (
    <>
      {/* Floating nav bar — centered, rounded, glass on scroll */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav className={`w-full max-w-[var(--container)] rounded-2xl border transition-all duration-300 ${scrolled ? "bg-[#0a0a0b]/85 backdrop-blur-xl border-[var(--border)] shadow-lg shadow-black/20" : "bg-[var(--surface)]/60 backdrop-blur-md border-[var(--border)]"}`}>
          <div className="h-12 px-5 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="text-[14px] font-semibold text-white">carmogger</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <a key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-[13px] text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04] transition-all duration-150">{l.label}</a>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Link href={`/u/${user.username}`} className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">@{user.username}</Link>
                  <Link href="/rate" className="h-8 px-3.5 rounded-lg bg-[var(--accent)] text-white text-[13px] font-medium flex items-center hover:bg-[var(--accent-hover)] transition-colors">Rate</Link>
                </>
              ) : (
                <>
                  <button onClick={() => setAuth(true)} className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors px-2">Sign in</button>
                  <Link href="/rate" className="h-8 px-3.5 rounded-lg bg-[var(--accent)] text-white text-[13px] font-medium flex items-center hover:bg-[var(--accent-hover)] transition-colors">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button className="md:hidden p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors" onClick={() => setOpen(!open)} aria-label="Menu">
              <div className="w-4 flex flex-col gap-[4px]">
                <span className={`block h-[1.5px] bg-zinc-400 transition-all duration-200 origin-center ${open ? "rotate-45 translate-y-[2.75px]" : ""}`} />
                <span className={`block h-[1.5px] bg-zinc-400 transition-all duration-200 origin-center ${open ? "-rotate-45 -translate-y-[2.75px]" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile dropdown */}
          {open && (
            <div className="md:hidden px-5 pb-4 pt-1 border-t border-[var(--border)]">
              {links.map(l => (
                <a key={l.href} href={l.href} className="block py-2 text-[13px] text-[var(--text-muted)] hover:text-white transition-colors" onClick={() => setOpen(false)}>{l.label}</a>
              ))}
              <div className="mt-2 pt-2 border-t border-[var(--border)] flex flex-col gap-2">
                {!user && <button onClick={() => { setOpen(false); setAuth(true); }} className="py-2 text-[13px] text-[var(--text-muted)] text-left">Sign in</button>}
                <Link href="/rate" className="py-2 text-center rounded-lg bg-[var(--accent)] text-white text-[13px] font-medium" onClick={() => setOpen(false)}>Get Started</Link>
              </div>
            </div>
          )}
        </nav>
      </div>

      <AuthModal isOpen={auth} onClose={() => setAuth(false)} />
    </>
  );
}
