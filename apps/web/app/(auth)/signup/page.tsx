"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: "", password: "", nativeLanguage: "en" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", form);
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "회원가입에 실패했습니다. 다시 시도해주세요.");
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
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12), transparent)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            <span style={{ color: "var(--brand-kr)" }}>한</span>
            <span style={{ color: "var(--text-primary)" }}> · </span>
            <span style={{ color: "var(--brand-jp)" }}>日</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>LinguaBridge</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
            지금 시작하면 두 언어가 기다립니다
          </p>
        </div>

        <div className="glass" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: "var(--text-primary)" }}>
            계정 만들기
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "email", label: "이메일", type: "email", placeholder: "you@example.com" },
              { key: "password", label: "비밀번호", type: "password", placeholder: "8자 이상" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => update(key, e.target.value)}
                  required
                  placeholder={placeholder}
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
            ))}

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                모국어
              </label>
              <select
                value={form.nativeLanguage}
                onChange={(e) => update("nativeLanguage", e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  outline: "none",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} style={{ background: "var(--bg-elevated)" }}>
                    {l.label}
                  </option>
                ))}
              </select>
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
                background: "linear-gradient(135deg, var(--brand-both), var(--brand-jp))",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {loading ? "가입 중..." : "무료로 시작하기"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-secondary)" }}>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" style={{ color: "var(--brand-both)", fontWeight: 500 }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
