"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useT } from "@/lib/i18n";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  _count: { cards: number };
}

export default function CurriculumPage() {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  useEffect(() => {
    api.get(`/curriculums/${curriculumId}/lessons`)
      .then((r) => setLessons(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [curriculumId]);

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 700 }}>
      <Link href="/dashboard" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
        {t("curriculum.back")}
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{t("curriculum.title")}</h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
        {t("curriculum.subtitle")}
      </p>

      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("common.loading")}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lessons.map((lesson, idx) => (
            <Link
              key={lesson.id}
              href={`/learn/${curriculumId}/${lesson.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 20px",
                borderRadius: 14,
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                textDecoration: "none",
                transition: "transform 150ms, background 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.background = "var(--glass-bg)";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, var(--brand-both), var(--brand-kr))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{lesson.title}</div>
                {lesson.description && (
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{lesson.description}</div>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {t("curriculum.card_count", { n: lesson._count?.cards ?? 0 })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
