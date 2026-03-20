"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useT } from "@/lib/i18n";

interface PointsBalance {
  total: number;
  todayEarned: number;
}

interface LeaderboardEntry {
  userId: string;
  total: number;
  rank?: number;
}

export default function PointsPage() {
  const t = useT();
  const [balance, setBalance] = useState<PointsBalance | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/points/balance").then((r) => setBalance(r.data)).catch(() => {}),
      api.get("/points/leaderboard").then((r) => setLeaderboard(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 32, color: "var(--text-muted)" }}>{t("points.loading")}</div>;
  }

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <Link href="/dashboard" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
          {t("common.back_dashboard")}
        </Link>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: "var(--text-primary)" }}>
        {t("points.title")}
      </h1>

      {/* Balance Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <div
          className="glass"
          style={{
            padding: 28,
            background: "linear-gradient(135deg, rgba(245,158,11,0.12), transparent)",
            borderColor: "rgba(245,158,11,0.25)",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>
            TOTAL POINTS
          </p>
          <div style={{ fontSize: 52, fontWeight: 800, color: "var(--accent-gold)" }}>
            {balance?.total ?? 0}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t("points.total_label")}</p>
        </div>

        <div
          className="glass"
          style={{
            padding: 28,
            background: "linear-gradient(135deg, rgba(16,185,129,0.08), transparent)",
            borderColor: "rgba(16,185,129,0.2)",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>
            TODAY EARNED
          </p>
          <div style={{ fontSize: 52, fontWeight: 800, color: "var(--accent-green)" }}>
            +{balance?.todayEarned ?? 0}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t("points.today_label")}</p>
        </div>
      </div>

      {/* How to earn */}
      <div className="glass" style={{ padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>
          {t("points.how_title")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { labelKey: "points.correct_card" as const, points: "+10", color: "var(--accent-green)" },
            { labelKey: "points.lesson_bonus" as const, points: "+50", color: "var(--accent-gold)" },
          ].map((item) => (
            <div
              key={item.labelKey}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{t(item.labelKey)}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>
          {t("points.leaderboard")}
        </h2>
        {leaderboard.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>
            {t("points.no_data")}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {leaderboard.map((entry, idx) => {
              const rank = idx + 1;
              const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}.`;
              return (
                <div
                  key={entry.userId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: rank <= 3 ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${rank <= 3 ? "rgba(245,158,11,0.15)" : "var(--glass-border)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: rank <= 3 ? 18 : 13, minWidth: 28, color: "var(--text-muted)" }}>
                      {medal}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "monospace" }}>
                      {entry.userId.slice(0, 8)}...
                    </span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-gold)" }}>
                    {entry.total} pts
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
