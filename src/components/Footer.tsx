"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="ctr" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }} className="sm:grid-cols-4 grid-cols-2">
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 8 }}>carmogger</p>
            <p style={{ fontSize: 13, color: "#52525b", lineHeight: 1.6 }}>AI-powered mog scores.</p>
          </div>
          <div>
            <p className="mono" style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Product</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/rate" style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>Rate Your Car</Link>
              <Link href="/leaderboards" style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>Leaderboard</Link>
              <Link href="/pricing" style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>Pricing</Link>
            </div>
          </div>
          <div>
            <p className="mono" style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Company</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="mailto:hello@carmogger.com" style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
          <div>
            <p className="mono" style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Legal</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/terms" style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>Terms</Link>
              <Link href="/privacy" style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>Privacy</Link>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="ctr" style={{ paddingTop: 16, paddingBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p className="mono" style={{ fontSize: 11, color: "#3f3f46" }}>&copy; 2026 CarMogger</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="https://x.com/carmogger" target="_blank" rel="noopener" style={{ fontSize: 11, color: "#3f3f46", textDecoration: "none" }}>X</a>
            <a href="https://instagram.com/carmogger" target="_blank" rel="noopener" style={{ fontSize: 11, color: "#3f3f46", textDecoration: "none" }}>Instagram</a>
            <a href="https://tiktok.com/@carmogger" target="_blank" rel="noopener" style={{ fontSize: 11, color: "#3f3f46", textDecoration: "none" }}>TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
