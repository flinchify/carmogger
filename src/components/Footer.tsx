"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-xs font-black text-white">M</div>
              <span className="text-sm font-bold text-white">car<span className="text-blue-500">mogger</span></span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">AI-powered car rating platform. Upload, get scored, compete.</p>
            <div className="flex items-center gap-2 mt-5">
              {[
                { href: "https://instagram.com/carmogger", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                { href: "https://tiktok.com/@carmogger", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.13a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-2-.59l.02.01z"/></svg> },
                { href: "https://x.com/carmogger", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/[0.12] transition-all duration-200">{s.icon}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/rate" className="text-sm text-zinc-500 hover:text-white transition-colors">Rate Your Car</Link></li>
              <li><Link href="/leaderboards" className="text-sm text-zinc-500 hover:text-white transition-colors">Leaderboards</Link></li>
              <li><Link href="/compare" className="text-sm text-zinc-500 hover:text-white transition-colors">Compare</Link></li>
              <li><Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="mailto:hello@carmogger.com" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact</a></li>
              <li><Link href="/pricing" className="text-sm text-zinc-500 hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/terms" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">2026 CarMogger. All rights reserved.</p>
          <p className="text-xs text-zinc-600">Built in Australia.</p>
        </div>
      </div>
    </footer>
  );
}
