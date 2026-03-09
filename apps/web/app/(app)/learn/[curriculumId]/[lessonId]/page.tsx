"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { FlipCard } from "@/components/ui/FlipCard";
import { useAuthStore } from "@/store/auth";

interface Card {
  id: string;
  en: string;
  ko: string;
  ja: string;
  koReading: string | null;
  jaReading: string | null;
  type: string;
}

interface LessonDetail {
  id: string;
  title: string;
  cards: Card[];
}

export default function LessonPage() {
  const { curriculumId, lessonId } = useParams<{ curriculumId: string; lessonId: string }>();
  const { user } = useAuthStore();
  const mode = (user?.settings?.learningMode ?? "BOTH") as "KR" | "JP" | "BOTH";

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/lessons/${lessonId}`)
      .then((r) => setLesson(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) return <div style={{ padding: 32, color: "var(--text-muted)" }}>불러오는 중...</div>;
  if (!lesson) return <div style={{ padding: 32, color: "var(--accent-red)" }}>레슨을 찾을 수 없습니다.</div>;

  const cards = lesson.cards;
  const progress = cards.length > 0 ? ((currentIdx) / cards.length) * 100 : 0;

  if (completed) {
    return (
      <div
        className="fade-up"
        style={{
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 64 }}>🎉</div>
        <h2 style={{ fontSize: 28, fontWeight: 700 }}>레슨 완료!</h2>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          {cards.length}개 카드를 모두 학습했습니다
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => { setCurrentIdx(0); setCompleted(false); }}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "1px solid var(--glass-border)",
              background: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            다시 학습
          </button>
          <Link
            href={`/learn/${curriculumId}`}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, var(--brand-both), var(--brand-kr))",
              color: "#fff",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            다음 레슨 →
          </Link>
        </div>
      </div>
    );
  }

  const card = cards[currentIdx];

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <Link href={`/learn/${curriculumId}`} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
          ← {lesson.title}
        </Link>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {currentIdx + 1} / {cards.length}
        </span>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 32 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Flip Card */}
      {card && (
        <FlipCard
          en={card.en}
          ko={card.ko}
          ja={card.ja}
          koReading={card.koReading}
          jaReading={card.jaReading}
          mode={mode}
        />
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        {currentIdx > 0 && (
          <button
            onClick={() => setCurrentIdx((i) => i - 1)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              border: "1px solid var(--glass-border)",
              background: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ← 이전
          </button>
        )}
        <button
          onClick={() => {
            if (currentIdx < cards.length - 1) setCurrentIdx((i) => i + 1);
            else setCompleted(true);
          }}
          className="btn-primary"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, var(--brand-both), var(--brand-kr))",
            color: "#fff",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {currentIdx < cards.length - 1 ? "다음 →" : "레슨 완료 🎉"}
        </button>
      </div>
    </div>
  );
}
