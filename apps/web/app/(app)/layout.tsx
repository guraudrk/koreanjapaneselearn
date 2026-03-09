"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--glass-border)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 8px", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            <span style={{ color: "var(--brand-kr)" }}>한</span>
            <span style={{ color: "var(--text-muted)" }}> · </span>
            <span style={{ color: "var(--brand-jp)" }}>日</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>LinguaBridge</div>
        </div>

        {[
          { href: "/dashboard", icon: "◈", label: "대시보드" },
          { href: "/learn", icon: "▶", label: "학습" },
          { href: "/dictionary", icon: "◉", label: "사전" },
          { href: "/points", icon: "★", label: "포인트" },
        ].map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: 14,
              transition: "background 150ms, color 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--glass-bg)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
