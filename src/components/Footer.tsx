"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-8">
      <div className="max-w-[1080px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[15px] font-bold text-white mb-3">carmogger</p>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed max-w-[200px]">AI-powered car rating platform.</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">Product</p>
            <div className="flex flex-col gap-2">
              <Link href="/rate" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Rate Your Car</Link>
              <Link href="/leaderboards" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Leaderboards</Link>
              <Link href="/pricing" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">Company</p>
            <div className="flex flex-col gap-2">
              <a href="mailto:hello@carmogger.com" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">Legal</p>
            <div className="flex flex-col gap-2">
              <Link href="/terms" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="max-w-[1080px] mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-[12px] text-[var(--text-muted)]">&copy; 2026 CarMogger</p>
          <div className="flex items-center gap-3">
            {[
              { href: "https://x.com/carmogger", label: "X" },
              { href: "https://instagram.com/carmogger", label: "IG" },
              { href: "https://tiktok.com/@carmogger", label: "TT" },
            ].map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--text-muted)] hover:text-white transition-colors">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
