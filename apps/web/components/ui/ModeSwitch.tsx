"use client";
import { useT } from "@/lib/i18n";

interface ModeSwitchProps {
  value: "KR" | "JP" | "BOTH";
  onChange: (mode: "KR" | "JP" | "BOTH") => void;
}

export function ModeSwitch({ value, onChange }: ModeSwitchProps) {
  const t = useT();
  const modes: { label: string; value: "KR" | "JP" | "BOTH"; color: string }[] = [
    { label: t("common.lang_kr"), value: "KR", color: "var(--brand-kr)" },
    { label: t("common.lang_both"), value: "BOTH", color: "var(--brand-both)" },
    { label: t("common.lang_jp"), value: "JP", color: "var(--brand-jp)" },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "999px",
        padding: "4px",
        gap: "4px",
      }}
    >
      {modes.map((m) => {
        const active = value === m.value;
        return (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: active ? 700 : 400,
              background: active ? m.color : "transparent",
              color: active ? "#fff" : "var(--text-secondary)",
              transition: "all 200ms ease",
              boxShadow: active ? `0 0 16px ${m.color}66` : "none",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
