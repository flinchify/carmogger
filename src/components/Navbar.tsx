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
      <div style={{ position: "fixed", top: 16, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "0 16px" }}>
        <nav style={{ width: "100%", maxWidth: 1100, borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.3s", background: scrolled ? "rgba(10,10,11,0.85)" : "rgba(17,17,20,0.6)", backdropFilter: scrolled ? "blur(20px)" : "blur(12px)" }}>
          <div style={{ height: 48, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>carmogger</span>
            </Link>

            <div className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
              {links.map(l => (
                <a key={l.href} href={l.href} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, color: "#52525b", textDecoration: "none", transition: "color 0.15s" }} onMouseOver={e => (e.currentTarget.style.color = "white")} onMouseOut={e => (e.currentTarget.style.color = "#52525b")}>{l.label}</a>
              ))}
            </div>

            <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
              {user ? (
                <>
                  <Link href={`/u/${user.username}`} style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>@{user.username}</Link>
                  <Link href="/rate" style={{ height: 32, padding: "0 14px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", textDecoration: "none" }}>Rate</Link>
                </>
              ) : (
                <>
                  <button onClick={() => setAuth(true)} style={{ fontSize: 13, color: "#52525b", background: "none", border: "none", cursor: "pointer", padding: "0 8px" }}>Sign in</button>
                  <Link href="/rate" style={{ height: 32, padding: "0 14px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", textDecoration: "none" }}>Get Started</Link>
                </>
              )}
            </div>

            <button className="md:hidden" onClick={() => setOpen(!open)} style={{ padding: 6, background: "none", border: "none", cursor: "pointer" }} aria-label="Menu">
              <div style={{ width: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "block", height: 1.5, background: "#a1a1aa", transition: "all 0.2s", transform: open ? "rotate(45deg) translateY(2.75px)" : "none", transformOrigin: "center" }} />
                <span style={{ display: "block", height: 1.5, background: "#a1a1aa", transition: "all 0.2s", transform: open ? "rotate(-45deg) translateY(-2.75px)" : "none", transformOrigin: "center" }} />
              </div>
            </button>
          </div>

          {open && (
            <div className="md:hidden" style={{ padding: "4px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {links.map(l => (
                <a key={l.href} href={l.href} style={{ display: "block", padding: "8px 0", fontSize: 13, color: "#52525b", textDecoration: "none" }} onClick={() => setOpen(false)}>{l.label}</a>
              ))}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 8 }}>
                {!user && <button onClick={() => { setOpen(false); setAuth(true); }} style={{ padding: "8px 0", fontSize: 13, color: "#52525b", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>Sign in</button>}
                <Link href="/rate" style={{ padding: "8px 0", textAlign: "center", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 500, textDecoration: "none" }} onClick={() => setOpen(false)}>Get Started</Link>
              </div>
            </div>
          )}
        </nav>
      </div>
      <AuthModal isOpen={auth} onClose={() => setAuth(false)} />
    </>
  );
}
