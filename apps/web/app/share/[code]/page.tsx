import { Metadata } from "next";

interface Card {
  id: string;
  en: string;
  ko: string;
  ja: string;
  koReading: string | null;
  jaReading: string | null;
  type: string;
}

interface ShareData {
  code: string;
  lesson: {
    id: string;
    title: string;
    curriculum: { title: string; language: string };
    cards: Card[];
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function getShareData(code: string): Promise<ShareData | null> {
  try {
    const res = await fetch(`${API_BASE}/share/${code}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const data = await getShareData(code);
  if (!data) return { title: "LinguaBridge — Shared Lesson" };
  return {
    title: `${data.lesson.title} — LinguaBridge`,
    description: `${data.lesson.cards.length}개 카드 · ${data.lesson.curriculum.title} · LinguaBridge에서 한국어 & 일본어를 배워보세요!`,
    openGraph: {
      title: `${data.lesson.title} — LinguaBridge`,
      description: `${data.lesson.cards.length}개 카드 · ${data.lesson.curriculum.title}`,
      siteName: "LinguaBridge",
    },
  };
}

export default async function SharePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getShareData(code);

  if (!data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base, #0D0D1A)",
          color: "var(--text-primary, #F1F5F9)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>공유 링크를 찾을 수 없습니다</h1>
          <p style={{ color: "rgba(241,245,249,0.5)", marginBottom: 24 }}>링크가 만료되었거나 잘못된 주소입니다.</p>
          <a
            href="/"
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366F1, #FF4D6D)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            LinguaBridge 시작하기
          </a>
        </div>
      </div>
    );
  }

  const langColor = data.lesson.curriculum.language === "KR"
    ? "#FF4D6D"
    : data.lesson.curriculum.language === "JP"
    ? "#C084FC"
    : "#6366F1";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base, #0D0D1A)",
        color: "var(--text-primary, #F1F5F9)",
        fontFamily: "Inter, sans-serif",
        padding: "40px 16px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href="/" style={{ color: langColor, fontWeight: 700, textDecoration: "none", fontSize: 18 }}>
            LinguaBridge
          </a>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>
            {data.lesson.title}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(241,245,249,0.5)" }}>
            {data.lesson.curriculum.title} · {data.lesson.cards.length}개 카드
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 40 }}>
          {data.lesson.cards.map((card) => (
            <div
              key={card.id}
              style={{
                padding: 20,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#F1F5F9" }}>{card.en}</p>
              <div style={{ display: "flex", gap: 16 }}>
                <div>
                  <span style={{ fontSize: 10, color: "#FF4D6D", fontWeight: 600, display: "block", marginBottom: 2 }}>KR</span>
                  <span style={{ fontSize: 15, color: "#F1F5F9" }}>{card.ko}</span>
                  {card.koReading && (
                    <span style={{ fontSize: 11, color: "rgba(241,245,249,0.5)", display: "block" }}>{card.koReading}</span>
                  )}
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "#C084FC", fontWeight: 600, display: "block", marginBottom: 2 }}>JP</span>
                  <span style={{ fontSize: 15, color: "#F1F5F9" }}>{card.ja}</span>
                  {card.jaReading && (
                    <span style={{ fontSize: 11, color: "rgba(241,245,249,0.5)", display: "block" }}>{card.jaReading}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "rgba(241,245,249,0.6)", marginBottom: 16 }}>
            한국어 & 일본어를 함께 배워보세요
          </p>
          <a
            href="/signup"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              borderRadius: 14,
              background: `linear-gradient(135deg, #6366F1, ${langColor})`,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            무료로 시작하기 →
          </a>
        </div>
      </div>
    </div>
  );
}
