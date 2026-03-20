"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { ModeSwitch } from "@/components/ui/ModeSwitch";
import Link from "next/link";
import { useT } from "@/lib/i18n";

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

interface LearningProgress {
  completedCards: number;
  correctCards: number;
  correctRate: number;
  totalPoints: number;
  streak: number;
}

export default function DashboardPage() {
  const { user, setLearningMode } = useAuthStore();
  const t = useT();
  const mode = (user?.settings?.learningMode ?? "BOTH") as "KR" | "JP" | "BOTH";
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [points, setPoints] = useState<PointsBalance>({ total: 0, todayEarned: 0 });
  const [progress, setProgress] = useState<LearningProgress>({ completedCards: 0, correctCards: 0, correctRate: 0, totalPoints: 0, streak: 0 });

  useEffect(() => {
    api.get("/curriculums").then((r) => setCurriculums(r.data)).catch(() => {});
    api.get("/points/balance").then((r) => setPoints(r.data)).catch(() => {});
    api.get("/learning/progress").then((r) => setProgress(r.data)).catch(() => {});
  }, []);

  async function handleModeChange(newMode: "KR" | "JP" | "BOTH") {
    setLearningMode(newMode);
    try {
      await api.patch("/me/settings", { learningMode: newMode });
    } catch {/* optimistic update */}
  }

  const modeColor = mode === "KR" ? "var(--brand-kr)" : mode === "JP" ? "var(--brand-jp)" : "var(--brand-both)";
  const modeName = mode === "KR" ? t("common.lang_kr") : mode === "JP" ? t("common.lang_jp") : t("common.lang_both");

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            {t("dash.greeting", { name: user?.email?.split("@")[0] ?? "" })}
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
            {t("dash.subtitle")}
          </p>
        </div>
        <ModeSwitch value={mode} onChange={handleModeChange} />
      </div>

      {/* Bento Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "auto", gap: 16 }}>

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
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: modeColor, lineHeight: 1 }}>
              {progress.streak}
            </div>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{progress.streak > 0 ? "🔥" : "💤"}</div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t("dash.streak_label")}</p>
        </div>

        {/* Points Card */}
        <Link href="/points" style={{ gridColumn: "span 4", textDecoration: "none", display: "block" }}>
          <div className="glass" style={{ padding: 24, height: "100%", cursor: "pointer" }}>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: "0.08em" }}>
              TOTAL POINTS
            </p>
            <div style={{ fontSize: 52, fontWeight: 800, color: "var(--accent-gold)", lineHeight: 1 }}>{points.total}</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              {t("dash.points_label")}{points.todayEarned > 0 && (
                <span style={{ color: "var(--accent-green)", marginLeft: 8 }}>+{points.todayEarned} {t("dash.points_today")}</span>
              )}
            </p>
          </div>
        </Link>

        {/* Mode Card */}
        <div className="glass" style={{ gridColumn: "span 4", padding: 24 }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: "0.08em" }}>
            LEARNING MODE
          </p>
          <div style={{ fontSize: 28, fontWeight: 800, color: modeColor }}>
            {modeName}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t("dash.mode_label")}</p>
        </div>

        {/* Stats row */}
        <div className="glass" style={{ gridColumn: "span 4", padding: 20 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 10 }}>CARDS STUDIED</p>
          <div style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)" }}>{progress.completedCards}</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t("dash.cards_label")}</p>
        </div>

        <div className="glass" style={{ gridColumn: "span 4", padding: 20 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 10 }}>CORRECT RATE</p>
          <div style={{ fontSize: 36, fontWeight: 800, color: progress.correctRate >= 80 ? "var(--accent-green)" : progress.correctRate >= 50 ? "var(--accent-gold)" : "var(--accent-red)" }}>
            {progress.correctRate}%
          </div>
          <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ height: "100%", borderRadius: 2, width: `${progress.correctRate}%`, background: progress.correctRate >= 80 ? "var(--accent-green)" : "var(--accent-gold)", transition: "width 0.6s ease" }} />
          </div>
        </div>

        <div className="glass" style={{ gridColumn: "span 4", padding: 20 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 10 }}>CORRECT CARDS</p>
          <div style={{ fontSize: 36, fontWeight: 800, color: "var(--accent-green)" }}>{progress.correctCards}</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t("dash.correct_label")}</p>
        </div>

        {/* Curriculum List */}
        <div className="glass" style={{ gridColumn: "span 8", padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{t("dash.curriculum_title")}</h2>
            <Link href="/learn" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>
              {t("dash.view_all")}
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {curriculums.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("dash.loading_curriculum")}</p>
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
                      <span style={{ fontSize: 12, color }}>{t("common.lessons", { n: c.lessonCount })}</span>
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
            {t("dash.tip_label")}
          </p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {t("dash.tip_text")}
          </p>
        </div>

      </div>
    </div>
  );
}
