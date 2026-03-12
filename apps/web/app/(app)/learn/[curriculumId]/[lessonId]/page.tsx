"use client";
import { useEffect, useState, useRef } from "react";
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

type AnswerState = "idle" | "correct" | "wrong";

export default function LessonPage() {
  const { curriculumId, lessonId } = useParams<{ curriculumId: string; lessonId: string }>();
  const { user } = useAuthStore();
  const mode = (user?.settings?.learningMode ?? "BOTH") as "KR" | "JP" | "BOTH";

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [totalPointsThisLesson, setTotalPointsThisLesson] = useState(0);
  const [bonusAwarded, setBonusAwarded] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareToast, setShareToast] = useState(false);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    api.get(`/lessons/${lessonId}`)
      .then((r) => setLesson(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  async function handleAnswer(correct: boolean) {
    if (answerState !== "idle") return;
    const card = lesson?.cards[currentIdx];
    const latencyMs = Date.now() - startRef.current;

    setAnswerState(correct ? "correct" : "wrong");

    // Submit to API (optimistic — don't block UI)
    try {
      const { data } = await api.post("/learning/submit", {
        lessonId,
        cardId: card?.id,
        correct,
        latencyMs,
      });
      if (data.pointsAwarded > 0) {
        setPointsEarned(data.pointsAwarded);
        setTotalPointsThisLesson((p) => p + data.pointsAwarded);
        if (data.pointsAwarded >= 50) setBonusAwarded(true);
      }
    } catch { /* DB not connected, UI still works */ }

    // Auto-advance after feedback
    setTimeout(() => {
      setAnswerState("idle");
      setFlipped(false);
      setPointsEarned(0);
      startRef.current = Date.now();
      if (lesson && currentIdx < lesson.cards.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        setCompleted(true);
      }
    }, 900);
  }

  if (loading) return <div style={{ padding: 32, color: "var(--text-muted)" }}>불러오는 중...</div>;
  if (!lesson) return <div style={{ padding: 32, color: "var(--accent-red)" }}>레슨을 찾을 수 없습니다.</div>;
  if (lesson.cards.length === 0) return (
    <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>
      <p>이 레슨에 카드가 없습니다.</p>
      <Link href={`/learn/${curriculumId}`} style={{ color: "var(--brand-both)", textDecoration: "none" }}>← 레슨 목록으로</Link>
    </div>
  );

  const cards = lesson.cards;
  const progress = cards.length > 0 ? (currentIdx / cards.length) * 100 : 0;

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

        {/* Points summary */}
        <div
          className="glass"
          style={{
            padding: "16px 32px",
            display: "flex",
            gap: 24,
            alignItems: "center",
            background: "rgba(245,158,11,0.08)",
            borderColor: "rgba(245,158,11,0.2)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent-gold)" }}>
              +{totalPointsThisLesson}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>이번 레슨 포인트</div>
          </div>
          {bonusAwarded && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent-green)" }}>+50 보너스!</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>레슨 완료</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => {
              setCurrentIdx(0);
              setCompleted(false);
              setTotalPointsThisLesson(0);
              setBonusAwarded(false);
              setFlipped(false);
            }}
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
          <button
            onClick={async () => {
              try {
                const { data } = await api.post("/share", { lessonId });
                const url = `${window.location.origin}/share/${data.code}`;
                await navigator.clipboard.writeText(url);
                setShareToast(true);
                setTimeout(() => setShareToast(false), 2500);
              } catch { /* ignore */ }
            }}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "1px solid rgba(99,102,241,0.4)",
              background: "rgba(99,102,241,0.1)",
              color: "var(--brand-both)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            공유하기 🔗
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
        {shareToast && (
          <div
            style={{
              position: "fixed",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(16,185,129,0.9)",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              zIndex: 1000,
              backdropFilter: "blur(8px)",
            }}
          >
            링크가 클립보드에 복사됐어요! ✓
          </div>
        )}
      </div>
    );
  }

  const card = cards[currentIdx];
  const borderColor =
    answerState === "correct" ? "var(--accent-green)" :
    answerState === "wrong" ? "var(--accent-red)" :
    "var(--glass-border)";

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

      {/* Points popup */}
      {pointsEarned > 0 && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            right: 32,
            fontSize: 24,
            fontWeight: 800,
            color: "var(--accent-gold)",
            animation: "fadeUp 900ms ease forwards",
            pointerEvents: "none",
            zIndex: 999,
          }}
        >
          +{pointsEarned} ⭐
        </div>
      )}

      {/* Flip Card — with answer state border */}
      {card && (
        <div
          className={answerState === "wrong" ? "shake" : ""}
          style={{
            borderRadius: 20,
            border: `2px solid ${borderColor}`,
            transition: "border-color 200ms",
            boxShadow: answerState === "correct" ? "0 0 24px rgba(16,185,129,0.3)" : "none",
          }}
        >
          <FlipCard
            en={card.en}
            ko={card.ko}
            ja={card.ja}
            koReading={card.koReading}
            jaReading={card.jaReading}
            mode={mode}
            externalFlipped={flipped}
            onFlip={() => setFlipped(true)}
          />
        </div>
      )}

      {/* Answer buttons — show after flip */}
      {flipped && answerState === "idle" && (
        <div
          className="fade-up"
          style={{ display: "flex", gap: 12, marginTop: 20 }}
        >
          <button
            onClick={() => handleAnswer(false)}
            className="btn-primary"
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 12,
              border: "2px solid rgba(239,68,68,0.4)",
              background: "rgba(239,68,68,0.08)",
              color: "var(--accent-red)",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            몰라요 ✗
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="btn-primary"
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 12,
              border: "2px solid rgba(16,185,129,0.4)",
              background: "rgba(16,185,129,0.08)",
              color: "var(--accent-green)",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            알아요 ✓
          </button>
        </div>
      )}

      {/* Hint when not flipped */}
      {!flipped && answerState === "idle" && (
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>
          카드를 탭해서 뒤집어보세요
        </p>
      )}
    </div>
  );
}
