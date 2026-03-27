"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)]">
      <div className="w-full max-w-[var(--container)] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[14px] font-semibold text-white mb-2">carmogger</p>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">AI-powered car ratings.</p>
          </div>
          <div>
            <p className="mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-3">Product</p>
            <div className="flex flex-col gap-2">
              <Link href="/rate" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Rate Your Car</Link>
              <Link href="/leaderboards" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Leaderboard</Link>
              <Link href="/pricing" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <p className="mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-3">Company</p>
            <div className="flex flex-col gap-2">
              <a href="mailto:hello@carmogger.com" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div>
            <p className="mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-3">Legal</p>
            <div className="flex flex-col gap-2">
              <Link href="/terms" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-[var(--border)]">
        <div className="w-full max-w-[var(--container)] mx-auto px-6 py-4 flex items-center justify-between">
          <p className="mono text-[11px] text-[var(--text-muted)]">&copy; 2026 CarMogger</p>
          <div className="flex items-center gap-4">
            <a href="https://x.com/carmogger" target="_blank" rel="noopener" className="text-[11px] text-[var(--text-muted)] hover:text-white transition-colors">X</a>
            <a href="https://instagram.com/carmogger" target="_blank" rel="noopener" className="text-[11px] text-[var(--text-muted)] hover:text-white transition-colors">Instagram</a>
            <a href="https://tiktok.com/@carmogger" target="_blank" rel="noopener" className="text-[11px] text-[var(--text-muted)] hover:text-white transition-colors">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
