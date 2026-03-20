"use client";
import { useLocaleStore, type Locale } from "@/store/locale";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ko", label: "한" },
  { value: "ja", label: "日" },
];

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { locale, setLocale } = useLocaleStore();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid var(--glass-border)",
        borderRadius: 8,
        padding: 2,
      }}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLocale(opt.value)}
          style={{
            padding: compact ? "3px 7px" : "4px 10px",
            borderRadius: 6,
            border: "none",
            background: locale === opt.value ? "rgba(99,102,241,0.3)" : "transparent",
            color: locale === opt.value ? "var(--brand-both)" : "var(--text-muted)",
            fontSize: compact ? 11 : 12,
            fontWeight: locale === opt.value ? 700 : 400,
            cursor: "pointer",
            transition: "background 150ms, color 150ms",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
