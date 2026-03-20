"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? t("auth.login.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fade-up"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15), transparent)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Language switcher — fixed top right */}
        <div style={{ position: "fixed", top: 16, right: 20, zIndex: 100 }}>
          <LanguageSwitcher compact />
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
              <span style={{ color: "var(--brand-kr)" }}>한</span>
              <span style={{ color: "var(--text-primary)" }}> · </span>
              <span style={{ color: "var(--brand-jp)" }}>日</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>
              LinguaBridge
            </h1>
          </Link>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
            {t("auth.login.tagline")}
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: "var(--text-primary)" }}>
            {t("auth.login.title")}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                {t("auth.login.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color 200ms",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--brand-both)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--glass-border)")}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                {t("auth.login.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color 200ms",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--brand-both)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--glass-border)")}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: "var(--accent-red)", background: "rgba(239,68,68,0.1)", padding: "8px 12px", borderRadius: 8 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, var(--brand-both), var(--brand-kr))",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {loading ? t("auth.login.submitting") : t("auth.login.submit")}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-secondary)" }}>
            {t("auth.login.no_account")}{" "}
            <Link href="/signup" style={{ color: "var(--brand-both)", fontWeight: 500 }}>
              {t("auth.login.signup_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
