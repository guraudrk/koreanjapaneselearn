"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  language: string;
  level: string;
  lessonCount: number;
}

export default function LearnPage() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/curriculums")
      .then((r) => setCurriculums(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 700 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
        학습 시작
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
        학습할 커리큘럼을 선택하세요
      </p>

      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>불러오는 중...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {curriculums.map((c) => {
            const color =
              c.language === "KR" ? "var(--brand-kr)" :
              c.language === "JP" ? "var(--brand-jp)" :
              "var(--brand-both)";
            const langLabel =
              c.language === "KR" ? "한국어" :
              c.language === "JP" ? "日本語" :
              "KR + JP";
            return (
              <Link
                key={c.id}
                href={`/learn/${c.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 24px",
                  borderRadius: 16,
                  background: "var(--glass-bg)",
                  border: `1px solid ${color}33`,
                  textDecoration: "none",
                  transition: "transform 150ms, background 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.background = `${color}0d`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.background = "var(--glass-bg)";
                }}
              >
                {/* Language badge */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {langLabel}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                    {c.title}
                  </div>
                  {c.description && (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {c.description}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color, fontWeight: 600 }}>{c.lessonCount}개 레슨</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{c.level}</div>
                </div>

                <span style={{ fontSize: 16, color: "var(--text-muted)" }}>→</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
