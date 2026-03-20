"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useT } from "@/lib/i18n";

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const FEATURES = [
    { icon: "⚡", titleKey: "landing.feat1_title" as const, descKey: "landing.feat1_desc" as const, color: "var(--brand-both)" },
    { icon: "🃏", titleKey: "landing.feat2_title" as const, descKey: "landing.feat2_desc" as const, color: "var(--brand-kr)" },
    { icon: "🤖", titleKey: "landing.feat3_title" as const, descKey: "landing.feat3_desc" as const, color: "var(--brand-jp)" },
    { icon: "⭐", titleKey: "landing.feat4_title" as const, descKey: "landing.feat4_desc" as const, color: "var(--accent-gold)" },
  ];

  useEffect(() => {
    const handler = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateX(-50%) translateY(${window.scrollY * 0.2}px)`;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(13,13,26,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            <span style={{ color: "var(--brand-kr)" }}>한</span>
            <span style={{ color: "var(--text-muted)" }}> · </span>
            <span style={{ color: "var(--brand-jp)" }}>日</span>
            <span style={{ fontSize: 14, color: "var(--text-secondary)", marginLeft: 8, fontWeight: 500 }}>
              LinguaBridge
            </span>
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/login"
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/signup"
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, var(--brand-both), var(--brand-kr))",
              color: "#fff",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {t("landing.cta_start")}
          </Link>
          <LanguageSwitcher compact />
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 24px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={heroRef}
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="fade-up">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              fontSize: 12,
              color: "var(--brand-both)",
              marginBottom: 28,
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            {t("landing.badge")}
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            <span style={{ color: "var(--brand-kr)" }}>{t("landing.hero_title_1")}</span>
            {" "}{t("landing.hero_title_and")}{" "}
            <span style={{ color: "var(--brand-jp)" }}>{t("landing.hero_title_2")}</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>{t("landing.hero_title_3")}</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 19px)",
              color: "var(--text-secondary)",
              maxWidth: 560,
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            {t("landing.hero_desc")}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/signup"
              className="btn-primary"
              style={{
                padding: "14px 32px",
                borderRadius: 14,
                background: "linear-gradient(135deg, var(--brand-both), var(--brand-kr))",
                color: "#fff",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "0 0 32px rgba(99,102,241,0.35)",
              }}
            >
              {t("landing.cta_start")}
            </Link>
            <Link
              href="/login"
              style={{
                padding: "14px 32px",
                borderRadius: 14,
                border: "1px solid var(--glass-border)",
                background: "var(--glass-bg)",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 16,
              }}
            >
              {t("landing.cta_login")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 48 }}>
          {t("landing.why_title")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => (
            <div
              key={f.titleKey}
              className="glass"
              style={{ padding: 28, transition: "transform 200ms" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: f.color }}>{t(f.titleKey)}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "80px 24px" }}>
        <div
          className="glass"
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "48px 32px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(255,77,109,0.06))",
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{t("landing.final_title")}</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28 }}>{t("landing.final_desc")}</p>
          <Link
            href="/signup"
            className="btn-primary"
            style={{
              padding: "14px 40px",
              borderRadius: 14,
              background: "linear-gradient(135deg, var(--brand-both), var(--brand-kr))",
              color: "#fff",
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 700,
              display: "inline-block",
            }}
          >
            {t("landing.cta_start")}
          </Link>
        </div>
      </section>
    </div>
  );
}
