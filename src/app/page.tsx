"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 20, transition: "border-color 0.15s" };
const sectionStyle: React.CSSProperties = { width: "100%", paddingTop: 80, paddingBottom: 80 };

function WaitlistForm({ onSuccess }: { onSuccess: (pos: number, msg: string) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      onSuccess(data.position, data.message);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, maxWidth: 440, marginLeft: "auto", marginRight: "auto", flexWrap: "wrap", justifyContent: "center" }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        style={{
          flex: "1 1 240px",
          height: 48,
          padding: "0 16px",
          borderRadius: 10,
          background: "#111114",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          fontSize: 15,
          outline: "none",
          fontFamily: "inherit",
          minWidth: 0,
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          height: 48,
          padding: "0 28px",
          borderRadius: 10,
          background: "#3b82f6",
          color: "white",
          fontSize: 15,
          fontWeight: 600,
          border: "none",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.15s",
          whiteSpace: "nowrap",
          fontFamily: "inherit",
        }}
      >
        {loading ? "Joining..." : "Join Waitlist"}
      </button>
      {error && <p style={{ width: "100%", fontSize: 13, color: "#ef4444", marginTop: 4, textAlign: "center" }}>{error}</p>}
    </form>
  );
}

function SuccessState({ position, message }: { position: number; message: string }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>&#10003;</div>
      <p style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 8 }}>{message}</p>
      <p style={{ fontSize: 14, color: "#a1a1aa" }}>
        You are number <span style={{ color: "#3b82f6", fontWeight: 700 }}>{position}</span> on the list.
      </p>
    </div>
  );
}

export default function Home() {
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [faq, setFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/waitlist").then(r => r.json()).then(d => setWaitlistCount(d.count || 0)).catch(() => {});
  }, []);

  const handleSuccess = (pos: number, msg: string) => {
    setPosition(pos);
    setSuccessMsg(msg);
    setSubmitted(true);
    setWaitlistCount(pos);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar onJoinClick={scrollToForm} />

      {/* ===== HERO ===== */}
      <section style={{ width: "100%", paddingTop: 130, paddingBottom: 48 }}>
        <div className="ctr" style={{ textAlign: "center" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 12, color: "#3b82f6", marginBottom: 20 }}>Coming Soon</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(32px, 7vw, 56px)", fontWeight: 800, color: "white", lineHeight: 1.05, margin: "0 auto", maxWidth: 680, fontFamily: "Outfit, sans-serif" }}>
            Your car deserves<br />
            <span style={{ color: "#3b82f6" }}>a mog score.</span>
          </h1>
          <p className="fade-up d3" style={{ marginTop: 20, fontSize: 16, color: "#a1a1aa", lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            CarMogger rates your car across 5 brutal axes using AI. Upload, get scored, flex on everyone. Be first in line.
          </p>

          {/* Email capture */}
          <div ref={formRef} className="fade-up d4" style={{ marginTop: 36 }}>
            {submitted ? (
              <SuccessState position={position} message={successMsg} />
            ) : (
              <WaitlistForm onSuccess={handleSuccess} />
            )}
          </div>

          {/* Social proof counter */}
          {waitlistCount > 0 && (
            <p className="fade-up d5 mono" style={{ marginTop: 20, fontSize: 12, color: "#52525b" }}>
              {waitlistCount.toLocaleString()} {waitlistCount === 1 ? "person" : "people"} on the waitlist
            </p>
          )}

          {/* Terminal demo */}
          <div className="fade-up d6" style={{ marginTop: 56, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", maxWidth: 640, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 4 }}>
                {["Upload", "Analyze", "Score"].map((tab, i) => (
                  <span key={tab} className="mono" style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, background: i === 2 ? "rgba(59,130,246,0.1)" : "transparent", color: i === 2 ? "#60a5fa" : "#3f3f46" }}>{tab}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: "24px 24px" }}>
              <p className="mono" style={{ fontSize: 11, color: "#3f3f46", marginBottom: 4 }}>mog_score</p>
              <p style={{ fontSize: 40, fontWeight: 800, color: "#3f3f46", lineHeight: 1, fontFamily: "Outfit, sans-serif" }}>--<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4 }}>/ 100</span></p>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { l: "Aura", c: "#8B5CF6" },
                  { l: "Larp", c: "#10B981" },
                  { l: "Money", c: "#3B82F6" },
                  { l: "Demand", c: "#F59E0B" },
                  { l: "Hype", c: "#EC4899" },
                ].map(a => (
                  <div key={a.l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.c, flexShrink: 0 }} />
                    <span className="mono" style={{ fontSize: 11, color: "#a1a1aa", width: 56 }}>{a.l}</span>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#19191d", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 2, width: "0%", background: a.c }} />
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: "#3f3f46", width: 28, textAlign: "right" }}>--</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={sectionStyle}>
        <div className="ctr">
          <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ How it works ]</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 40, textAlign: "center" }}>Upload. Rate. Compete.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>, title: "Upload Photos", desc: "Drop 1-4 images. Front, rear, side, interior." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M2 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, title: "AI Identifies", desc: "Gemini detects make, model, year, trim, mods." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, title: "5-Axis Mog Score", desc: "Aura, Larp, Money, Demand, Hype. 0-100 each." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>, title: "Compete", desc: "Leaderboard, XP, 6 leagues, seasonal resets." },
            ].map(item => (
              <div key={item.title} style={cardStyle}>
                <div style={{ marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#52525b", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCORING ===== */}
      <section id="scoring" style={sectionStyle}>
        <div className="ctr">
          <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ Scoring system ]</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 12, textAlign: "center" }}>5 axes. No mercy.</h2>
          <p style={{ fontSize: 14, color: "#52525b", marginBottom: 40, maxWidth: 460, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>Each axis scored 0-100 by Gemini AI. Your Mog Score is the weighted average.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { name: "Aura", w: "25%", desc: "Presence, stance, proportions", color: "#8B5CF6" },
              { name: "Larp", w: "20%", desc: "Authenticity vs. fake parts", color: "#10B981" },
              { name: "Money", w: "20%", desc: "Build value, parts quality", color: "#3B82F6" },
              { name: "Demand", w: "20%", desc: "Market desirability", color: "#F59E0B" },
              { name: "Hype", w: "15%", desc: "Social / viral potential", color: "#EC4899" },
            ].map(a => (
              <div key={a.name} style={cardStyle}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginBottom: 12 }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{a.name}</h3>
                <p className="mono" style={{ fontSize: 10, color: "#3f3f46", marginTop: 2 }}>{a.w}</p>
                <p style={{ fontSize: 13, color: "#52525b", marginTop: 8, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={sectionStyle}>
        <div className="ctr">
          <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ FAQ ]</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 40, lineHeight: 1.1, textAlign: "center" }}>
            Frequently asked<br />questions.
          </h2>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
            {[
              { q: "What is CarMogger?", a: "An AI-powered car rating platform. Upload photos and get your mog score across 5 axes: Aura, Larp, Money, Demand, and Hype." },
              { q: "How does the scoring work?", a: "Gemini AI analyzes your photos, identifies the car, and scores each axis 0-100 using a consistent rubric. Your Mog Score is the weighted average." },
              { q: "When does it launch?", a: "Soon. Join the waitlist to be first in line. We'll email you as soon as it's ready." },
              { q: "Is it free?", a: "There will be a free tier with limited analyses. Premium plans unlock more features." },
              { q: "What are leagues?", a: "A progression system. Earn XP by uploading, getting views, and ranking. 6 leagues, 3 divisions each, with seasonal resets." },
            ].map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <button onClick={() => setFaq(faq === i ? null : i)} style={{ width: "100%", padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "white", paddingRight: 16 }}>{item.q}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" style={{ flexShrink: 0, transition: "transform 0.2s", transform: faq === i ? "rotate(45deg)" : "none" }}><path d="M12 5v14M5 12h14"/></svg>
                </button>
                <div style={{ overflow: "hidden", maxHeight: faq === i ? 160 : 0, paddingBottom: faq === i ? 16 : 0, transition: "all 0.2s" }}>
                  <p style={{ fontSize: 13, color: "#52525b", lineHeight: 1.6 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section style={sectionStyle}>
        <div className="ctr" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 12 }}>Don&apos;t miss launch day.</h2>
          <p style={{ fontSize: 14, color: "#52525b", marginBottom: 32 }}>Join the waitlist and be first to get your mog score.</p>
          {submitted ? (
            <p style={{ fontSize: 14, color: "#3b82f6", fontWeight: 500 }}>You&apos;re on the list! We&apos;ll be in touch.</p>
          ) : (
            <WaitlistForm onSuccess={handleSuccess} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
