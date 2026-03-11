"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { ModeSwitch } from "@/components/ui/ModeSwitch";
import Link from "next/link";

interface Curriculum {
  id: string;
  title: string;
  language: string;
  level: string;
  lessonCount: number;
}

interface PointsBalance {
  total: number;
  todayEarned: number;
}

export default function DashboardPage() {
  const { user, setLearningMode } = useAuthStore();
  const mode = (user?.settings?.learningMode ?? "BOTH") as "KR" | "JP" | "BOTH";
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [points, setPoints] = useState<PointsBalance>({ total: 0, todayEarned: 0 });

  useEffect(() => {
    api.get("/curriculums").then((r) => setCurriculums(r.data)).catch(() => {});
    api.get("/points/balance").then((r) => setPoints(r.data)).catch(() => {});
  }, []);

  async function handleModeChange(newMode: "KR" | "JP" | "BOTH") {
    setLearningMode(newMode);
    try {
      await api.patch("/me/settings", { learningMode: newMode });
    } catch {/* optimistic update */}
  }

  const modeColor = mode === "KR" ? "var(--brand-kr)" : mode === "JP" ? "var(--brand-jp)" : "var(--brand-both)";

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            안녕하세요, {user?.email?.split("@")[0]}님 👋
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
            오늘도 한 걸음 더 나아가봐요!
          </p>
        </div>
        <ModeSwitch value={mode} onChange={handleModeChange} />
      </div>

      {/* Bento Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "auto",
          gap: 16,
        }}
      >
        {/* Streak Card */}
        <div
          className="glass"
          style={{
            gridColumn: "span 4",
            padding: 24,
            background: `linear-gradient(135deg, ${modeColor}22, transparent)`,
            borderColor: `${modeColor}44`,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: "0.08em" }}>
            TODAY&apos;S STREAK
          </p>
          <div style={{ fontSize: 52, fontWeight: 800, color: modeColor }}>0</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>연속 학습일</p>
        </div>

        {/* Points Card */}
        <Link href="/points" style={{ gridColumn: "span 4", textDecoration: "none", display: "block" }}>
          <div className="glass" style={{ padding: 24, height: "100%", cursor: "pointer" }}>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: "0.08em" }}>
              TOTAL POINTS
            </p>
            <div style={{ fontSize: 52, fontWeight: 800, color: "var(--accent-gold)" }}>{points.total}</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              누적 포인트{points.todayEarned > 0 && <span style={{ color: "var(--accent-green)", marginLeft: 8 }}>+{points.todayEarned} 오늘</span>}
            </p>
          </div>
        </Link>

        {/* Mode Card */}
        <div className="glass" style={{ gridColumn: "span 4", padding: 24 }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: "0.08em" }}>
            LEARNING MODE
          </p>
          <div style={{ fontSize: 28, fontWeight: 800, color: modeColor }}>
            {mode === "KR" ? "한국어" : mode === "JP" ? "日本語" : "KR + JP"}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>현재 학습 언어</p>
        </div>

        {/* Quick Start */}
        <div className="glass" style={{ gridColumn: "span 8", padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>
            커리큘럼
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {curriculums.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>커리큘럼을 불러오는 중...</p>
            ) : (
              curriculums.map((c) => {
                const color = c.language === "KR" ? "var(--brand-kr)" : c.language === "JP" ? "var(--brand-jp)" : "var(--brand-both)";
                return (
                  <Link
                    key={c.id}
                    href={`/learn/${c.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${color}33`,
                      textDecoration: "none",
                      transition: "background 150ms",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${color}11`)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                  >
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{c.title}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>{c.level}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, color: color }}>{c.lessonCount}개 레슨</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>→</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Tip Card */}
        <div
          className="glass"
          style={{
            gridColumn: "span 4",
            padding: 24,
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), transparent)",
            borderColor: "rgba(245,158,11,0.2)",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--accent-gold)", marginBottom: 8, letterSpacing: "0.08em" }}>
            DID YOU KNOW?
          </p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            한국어의 <strong style={{ color: "var(--brand-kr)" }}>준비</strong>(準備)와 일본어의{" "}
            <strong style={{ color: "var(--brand-jp)" }}>じゅんび</strong>는 같은 한자어예요!
          </p>
        </div>
      </div>
    </div>
  );
}
