"use client";

interface ModeSwitchProps {
  value: "KR" | "JP" | "BOTH";
  onChange: (mode: "KR" | "JP" | "BOTH") => void;
}

const modes: { label: string; value: "KR" | "JP" | "BOTH"; color: string }[] = [
  { label: "한국어", value: "KR", color: "var(--brand-kr)" },
  { label: "동시학습", value: "BOTH", color: "var(--brand-both)" },
  { label: "日本語", value: "JP", color: "var(--brand-jp)" },
];

export function ModeSwitch({ value, onChange }: ModeSwitchProps) {
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
