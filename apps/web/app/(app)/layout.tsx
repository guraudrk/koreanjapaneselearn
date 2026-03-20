"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useT } from "@/lib/i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const t = useT();

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
        {/* Logo — links to home */}
        <Link href="/" style={{ padding: "0 8px", marginBottom: 16, textDecoration: "none" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            <span style={{ color: "var(--brand-kr)" }}>한</span>
            <span style={{ color: "var(--text-muted)" }}> · </span>
            <span style={{ color: "var(--brand-jp)" }}>日</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>LinguaBridge</div>
        </Link>

        {/* Language switcher */}
        <div style={{ padding: "0 4px", marginBottom: 8 }}>
          <LanguageSwitcher compact />
        </div>

        {[
          { href: "/dashboard", icon: "◈", labelKey: "nav.dashboard" as const },
          { href: "/learn", icon: "▶", labelKey: "nav.learn" as const },
          { href: "/dictionary", icon: "◉", labelKey: "nav.dictionary" as const },
          { href: "/points", icon: "★", labelKey: "nav.points" as const },
          { href: "/profile", icon: "⊙", labelKey: "nav.profile" as const },
        ].map(({ href, icon, labelKey }) => (
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
            <span>{t(labelKey)}</span>
          </Link>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--glass-border)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "0 8px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.email}
          </div>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {t("nav.logout")}
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
