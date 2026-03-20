"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { ModeSwitch } from "@/components/ui/ModeSwitch";
import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function ProfilePage() {
  const { user, setLearningMode, logout } = useAuthStore();
  const t = useT();
  const mode = (user?.settings?.learningMode ?? "BOTH") as "KR" | "JP" | "BOTH";
  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [saveMsg, setSaveMsg] = useState("");

  const nativeLangLabel: Record<string, string> = {
    en: "English", ko: "한국어", ja: "日本語", zh: "中文", es: "Español", fr: "Français",
  };

  async function handleModeChange(newMode: "KR" | "JP" | "BOTH") {
    setLearningMode(newMode);
    try {
      await api.patch("/me/settings", { learningMode: newMode });
      setSaveMsg(t("profile.saved"));
      setTimeout(() => setSaveMsg(""), 2000);
    } catch { setSaveMsg(t("profile.save_failed")); }
  }

  async function handleNotificationsToggle() {
    const next = !notifications;
    setNotifications(next);
    try {
      await api.patch("/me/settings", { notifications: next });
    } catch { setNotifications(!next); }
  }

  if (!user) return null;

  const avatarLetter = user.email[0].toUpperCase();

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <Link href="/dashboard" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
          {t("common.back_dashboard")}
        </Link>
      </div>

      {/* Avatar + basic info */}
      <div className="glass" style={{ padding: 28, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--brand-kr), var(--brand-jp))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {avatarLetter}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            {user.email}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {t("profile.native_lang", { lang: nativeLangLabel[user.nativeLanguage] ?? user.nativeLanguage })}
          </div>
        </div>
      </div>

      {/* Learning mode */}
      <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{t("profile.learning_title")}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              {t("profile.learning_desc")}
            </div>
          </div>
          {saveMsg && <span style={{ fontSize: 12, color: "var(--accent-green)" }}>{saveMsg}</span>}
        </div>
        <ModeSwitch value={mode} onChange={handleModeChange} />
      </div>

      {/* Notifications */}
      <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{t("profile.notifications")}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              {t("profile.notifications_desc")}
            </div>
          </div>
          <button
            onClick={handleNotificationsToggle}
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              background: notifications ? "var(--accent-green)" : "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background 200ms",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: notifications ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 200ms",
              }}
            />
          </button>
        </div>
      </div>

      {/* Account actions */}
      <div className="glass" style={{ padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>{t("profile.account")}</div>
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.06)",
            color: "var(--accent-red)",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "left",
          }}
        >
          {t("profile.logout")}
        </button>
      </div>
    </div>
  );
}
