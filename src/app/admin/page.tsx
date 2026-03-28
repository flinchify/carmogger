"use client";

import { useEffect, useState, useCallback } from "react";

interface WaitlistEntry {
  id: number;
  email: string;
  name: string | null;
  referral_source: string | null;
  created_at: string;
}

const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 20 };
const inputStyle: React.CSSProperties = { width: "100%", height: 44, padding: "0 14px", borderRadius: 8, background: "#19191d", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const };

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/waitlist", {
        headers: { "x-admin-secret": "cookie-auth" },
        credentials: "include",
      });
      if (!res.ok) return false;
      const data = await res.json();
      setEntries(data.entries || []);
      setTotal(data.total || 0);
      setAuthed(true);
      setError("");
      return true;
    } catch {
      return false;
    }
  }, []);

  // Check cookie on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Try fetching with cookie - the admin waitlist route checks query param or header
      // We'll pass the secret from cookie via a dedicated check
      const hasCookie = document.cookie.includes("carmog_admin=");
      if (hasCookie) {
        // Cookie exists, try to load data using query param from URL if present
        const params = new URLSearchParams(window.location.search);
        const q = params.get("secret");
        if (q) {
          const res = await fetch(`/api/admin/waitlist?secret=${encodeURIComponent(q)}`);
          if (res.ok) {
            const data = await res.json();
            setEntries(data.entries || []);
            setTotal(data.total || 0);
            setAuthed(true);
          }
        } else {
          setAuthed(true);
        }
      }
      setChecking(false);
    };
    checkAuth();
  }, []);

  // When authed, load data
  useEffect(() => {
    if (authed && entries.length === 0) {
      // Fetch using stored mechanism
      const params = new URLSearchParams(window.location.search);
      const q = params.get("secret");
      if (q) {
        fetch(`/api/admin/waitlist?secret=${encodeURIComponent(q)}`)
          .then(r => r.json())
          .then(data => {
            setEntries(data.entries || []);
            setTotal(data.total || 0);
          })
          .catch(() => {});
      }
    }
  }, [authed, entries.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }
      setAuthed(true);
      // Now fetch waitlist data using the password as the secret
      const wlRes = await fetch(`/api/admin/waitlist?secret=${encodeURIComponent(password)}`);
      if (wlRes.ok) {
        const data = await wlRes.json();
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      }
    } catch {
      setError("Failed to connect");
    }
  };

  const handleLogout = () => {
    document.cookie = "carmog_admin=; path=/; max-age=0";
    setAuthed(false);
    setEntries([]);
    setTotal(0);
    setEmail("");
    setPassword("");
  };

  const exportCSV = () => {
    window.open(`/api/admin/waitlist?secret=${encodeURIComponent(password)}&format=csv`, "_blank");
  };

  const copyEmails = () => {
    const emails = entries.map(e => e.email).join(", ");
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const filtered = entries.filter(e =>
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.name && e.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#52525b", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <form onSubmit={handleLogin} style={{ ...cardStyle, width: "100%", maxWidth: 360 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, fontFamily: "Outfit, sans-serif" }}>Admin Login</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={inputStyle}
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={inputStyle}
            />
            <button type="submit" style={{ width: "100%", height: 44, borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Sign In
            </button>
          </div>
          {error && <p style={{ marginTop: 12, fontSize: 13, color: "#ef4444" }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b", padding: "24px 16px" }}>
      <div style={{ maxWidth: 960, marginLeft: "auto", marginRight: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif" }}>Waitlist Admin</h1>
            <p style={{ fontSize: 13, color: "#52525b", marginTop: 4 }}>carmogger.com</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ fontSize: 13, color: "#52525b", textDecoration: "none" }}>&larr; Back to site</a>
            <button onClick={handleLogout} style={{ height: 32, padding: "0 14px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#a1a1aa", fontSize: 13, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats card */}
        <div style={{ ...cardStyle, textAlign: "center", marginBottom: 24 }}>
          <p className="mono" style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Total Signups</p>
          <p style={{ fontSize: 48, fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif" }}>{total}</p>
        </div>

        {/* Quick links */}
        <div style={{ ...cardStyle, marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <a href="/rate" style={{ height: 40, padding: "0 20px", borderRadius: 8, background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, transparent 60%)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Rate a Car (AI)
          </a>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={exportCSV} style={{ height: 36, padding: "0 16px", borderRadius: 8, background: "#19191d", border: "1px solid rgba(255,255,255,0.07)", color: "#a1a1aa", fontSize: 13, cursor: "pointer" }}>
            Export CSV
          </button>
          <button onClick={copyEmails} style={{ height: 36, padding: "0 16px", borderRadius: 8, background: "#19191d", border: "1px solid rgba(255,255,255,0.07)", color: "#a1a1aa", fontSize: 13, cursor: "pointer" }}>
            {copied ? "Copied!" : "Copy All Emails"}
          </button>
          <div style={{ flex: 1 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search emails..."
            style={{ height: 36, padding: "0 14px", borderRadius: 8, background: "#19191d", border: "1px solid rgba(255,255,255,0.07)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", minWidth: 180 }}
          />
        </div>

        {/* Table */}
        <div style={{ ...cardStyle, padding: 0, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>#</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Email</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Source</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr key={entry.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "10px 16px", color: "#3f3f46" }}>{i + 1}</td>
                  <td style={{ padding: "10px 16px", color: "white" }}>{entry.email}</td>
                  <td style={{ padding: "10px 16px", color: "#a1a1aa" }}>{entry.name || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#a1a1aa" }}>{entry.referral_source || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#52525b", whiteSpace: "nowrap" }}>
                    {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "#3f3f46" }}>
                    {search ? "No results found." : "No signups yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
