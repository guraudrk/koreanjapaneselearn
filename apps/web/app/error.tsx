"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base, #0D0D1A)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>
          문제가 발생했어요
        </h2>
        <p style={{ fontSize: 14, color: "rgba(241,245,249,0.5)", marginBottom: 24 }}>
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "10px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366F1, #FF4D6D)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
