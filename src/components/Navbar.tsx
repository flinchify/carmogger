"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface NavbarProps {
  onJoinClick?: () => void;
}

export default function Navbar({ onJoinClick }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleJoin = () => {
    if (onJoinClick) {
      onJoinClick();
    } else {
      document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div style={{ position: "fixed", top: 16, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "0 16px" }}>
      <nav style={{ width: "100%", maxWidth: 1100, borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.3s", background: scrolled ? "rgba(10,10,11,0.85)" : "rgba(17,17,20,0.6)", backdropFilter: scrolled ? "blur(20px)" : "blur(12px)" }}>
        <div style={{ height: 48, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Mobile hamburger (left on mobile) */}
          <button className="md:hidden" onClick={() => setOpen(!open)} style={{ padding: 6, background: "none", border: "none", cursor: "pointer" }} aria-label="Menu">
            <div style={{ width: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "block", height: 1.5, background: "#a1a1aa", transition: "all 0.2s", transform: open ? "rotate(45deg) translateY(2.75px)" : "none", transformOrigin: "center" }} />
              <span style={{ display: "block", height: 1.5, background: "#a1a1aa", transition: "all 0.2s", transform: open ? "rotate(-45deg) translateY(-2.75px)" : "none", transformOrigin: "center" }} />
            </div>
          </button>

          {/* Spacer for desktop left side */}
          <div className="hidden md:block" style={{ width: 120 }} />

          {/* Centered logo */}
          <Link href="/" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo-header.png" alt="CarMogger" style={{ height: 28, width: "auto" }} />
          </Link>

          {/* Join Waitlist button (right) */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
            <button onClick={handleJoin} style={{ height: 32, padding: "0 14px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", border: "none", cursor: "pointer" }}>Join Waitlist</button>
          </div>

          {/* Mobile: right side spacer to balance hamburger */}
          <div className="md:hidden" style={{ width: 28 }} />
        </div>

        {open && (
          <div className="md:hidden" style={{ padding: "4px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => { setOpen(false); handleJoin(); }} style={{ width: "100%", padding: "8px 0", textAlign: "center", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>Join Waitlist</button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
