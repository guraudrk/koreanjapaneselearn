import Link from "next/link";

export default function NotFound() {
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
        <div style={{ fontSize: 72, fontWeight: 900, color: "rgba(241,245,249,0.05)", marginBottom: 0 }}>
          404
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 8, marginTop: -8 }}>
          페이지를 찾을 수 없어요
        </h2>
        <p style={{ fontSize: 14, color: "rgba(241,245,249,0.4)", marginBottom: 28 }}>
          요청하신 페이지가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link
          href="/dashboard"
          style={{
            padding: "10px 24px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366F1, #FF4D6D)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          대시보드로 →
        </Link>
      </div>
    </div>
  );
}
