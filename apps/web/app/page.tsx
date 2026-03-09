"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const FEATURES = [
  {
    icon: "⚡",
    title: "동시 학습",
    desc: "한국어·일본어를 한 화면에서 비교하며 배웁니다. 공통 한자어를 한번에 익혀보세요.",
    color: "var(--brand-both)",
  },
  {
    icon: "🃏",
    title: "비교 플래시카드",
    desc: "앞면 영어, 뒷면 KR+JP 나란히. 공통점과 차이점이 한눈에.",
    color: "var(--brand-kr)",
  },
  {
    icon: "🤖",
    title: "AI 번역 + 설명",
    desc: "내 언어로 입력하면 문법·뉘앙스까지 설명해주는 AI. 무료 일일 제공.",
    color: "var(--brand-jp)",
  },
  {
    icon: "⭐",
    title: "포인트 시스템",
    desc: "학습할수록 포인트가 쌓입니다. 친구와 공유하고 랭킹을 겨뤄보세요.",
    color: "var(--accent-gold)",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

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
        <div style={{ fontSize: 20, fontWeight: 800 }}>
          <span style={{ color: "var(--brand-kr)" }}>한</span>
          <span style={{ color: "var(--text-muted)" }}> · </span>
          <span style={{ color: "var(--brand-jp)" }}>日</span>
          <span style={{ fontSize: 14, color: "var(--text-secondary)", marginLeft: 8, fontWeight: 500 }}>
            LinguaBridge
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
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
            로그인
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
            무료 시작
          </Link>
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
            ✦ 세계 최초 KR+JP 동시 학습 플랫폼
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            <span style={{ color: "var(--brand-kr)" }}>한국어</span>
            {" "}와{" "}
            <span style={{ color: "var(--brand-jp)" }}>일본어</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>동시에 정복하세요</span>
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
            두 언어의 공통점과 차이를 비교하며 배우는 스마트 학습.
            비교 플래시카드, AI 번역 설명, 포인트 시스템으로 실력을 키우세요.
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
              무료로 시작하기 →
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
              로그인
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 48 }}>
          왜 LinguaBridge인가요?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass"
              style={{ padding: 28, transition: "transform 200ms" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: f.color }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>
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
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>지금 바로 시작하세요</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28 }}>무료로 시작, 언제든 업그레이드</p>
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
            무료로 시작하기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
