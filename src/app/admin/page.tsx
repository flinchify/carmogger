"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

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
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/waitlist", { credentials: "include" });
      if (!res.ok) return false;
      const data = await res.json();
      setEntries(data.entries || []);
      setTotal(data.total || 0);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Check existing cookie on mount
  useEffect(() => {
    const check = async () => {
      const ok = await fetchData();
      if (ok) setAuthed(true);
      setChecking(false);
    };
    check();
  }, [fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      setAuthed(true);
      await fetchData();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "carmog_admin=; path=/; max-age=0";
    setAuthed(false);
    setEntries([]);
  };

  const handleExportCSV = async () => {
    const res = await fetch("/api/admin/waitlist?format=csv", { credentials: "include" });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = async () => {
    const emails = entries.map(e => e.email).join(", ");
    await navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = entries.filter(e => e.email.toLowerCase().includes(search.toLowerCase()) || (e.name && e.name.toLowerCase().includes(search.toLowerCase())));

  if (checking) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#52525b", fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ ...cardStyle, maxWidth: 380, width: "100%", padding: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <img src="/logo-header.png" alt="CarMogger" style={{ height: 32, margin: "0 auto 16px" }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 4 }}>Admin Login</p>
            <p style={{ fontSize: 13, color: "#52525b" }}>CarMogger admin panel</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center" }}>{error}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              style={{ height: 44, borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 600, border: "none", cursor: loginLoading ? "wait" : "pointer", opacity: loginLoading ? 0.7 : 1 }}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#0a0a0b", padding: 24 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif" }}>Admin Panel</h1>
            <p style={{ fontSize: 13, color: "#52525b", marginTop: 4 }}>CarMogger waitlist management</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/rate" style={{ height: 36, padding: "0 16px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", textDecoration: "none", gap: 6 }}>
              Rate a Car (AI)
            </Link>
            <button onClick={handleLogout} style={{ height: 36, padding: "0 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#52525b", fontSize: 13, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ ...cardStyle, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 36, fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif" }}>{total}</p>
            <p style={{ fontSize: 13, color: "#52525b" }}>Total waitlist signups</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleExportCSV} style={{ height: 36, padding: "0 16px", borderRadius: 8, background: "#19191d", border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa", fontSize: 13, cursor: "pointer" }}>
              Export CSV
            </button>
            <button onClick={handleCopyAll} style={{ height: 36, padding: "0 16px", borderRadius: 8, background: "#19191d", border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa", fontSize: 13, cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy All Emails"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: 320 }}
          />
        </div>

        {/* Table */}
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>#</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Source</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#52525b", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "#3f3f46" }}>
                      {entries.length === 0 ? "No signups yet" : "No results match your search"}
                    </td>
                  </tr>
                ) : filtered.map((entry, i) => (
                  <tr key={entry.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 16px", color: "#3f3f46" }}>{i + 1}</td>
                    <td style={{ padding: "10px 16px", color: "white" }}>{entry.email}</td>
                    <td style={{ padding: "10px 16px", color: "#a1a1aa" }}>{entry.name || "—"}</td>
                    <td style={{ padding: "10px 16px", color: "#a1a1aa" }}>{entry.referral_source || "—"}</td>
                    <td style={{ padding: "10px 16px", color: "#52525b", whiteSpace: "nowrap" }}>
                      {new Date(entry.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
