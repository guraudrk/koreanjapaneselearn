"use client";
import { useState } from "react";

interface FlipCardProps {
  en: string;
  ko: string;
  ja: string;
  koReading?: string | null;
  jaReading?: string | null;
  mode: "KR" | "JP" | "BOTH";
  externalFlipped?: boolean;
  onFlip?: () => void;
}

export function FlipCard({ en, ko, ja, koReading, jaReading, mode, externalFlipped, onFlip }: FlipCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const flipped = externalFlipped !== undefined ? externalFlipped : internalFlipped;

  function handleClick() {
    if (externalFlipped !== undefined) {
      onFlip?.();
    } else {
      setInternalFlipped((f) => !f);
    }
  }

  return (
    <div
      className={`flip-card${flipped ? " flipped" : ""}`}
      style={{ width: "100%", minHeight: 240, cursor: "pointer" }}
      onClick={handleClick}
    >
      <div className="flip-card-inner" style={{ width: "100%", minHeight: 240 }}>
        {/* Front */}
        <div
          className="flip-card-front glass"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            English
          </span>
          <span style={{ fontSize: 40, fontWeight: 700, color: "var(--text-primary)", textAlign: "center" }}>
            {en}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
            Tap to reveal
          </span>
        </div>

        {/* Back */}
        <div
          className="flip-card-back glass"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: mode === "BOTH" ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            gap: mode === "BOTH" ? 0 : 16,
          }}
        >
          {(mode === "KR" || mode === "BOTH") && (
            <div
              style={{
                flex: mode === "BOTH" ? 1 : undefined,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: 24,
                borderRight: mode === "BOTH" ? "1px solid var(--glass-border)" : "none",
              }}
            >
              <span style={{ fontSize: 11, color: "var(--brand-kr)", fontWeight: 600, letterSpacing: "0.08em" }}>
                한국어
              </span>
              <span style={{ fontSize: 36, fontWeight: 700, color: "var(--text-primary)" }}>
                {ko}
              </span>
              {koReading && (
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{koReading}</span>
              )}
            </div>
          )}
          {(mode === "JP" || mode === "BOTH") && (
            <div
              style={{
                flex: mode === "BOTH" ? 1 : undefined,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: 24,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--brand-jp)", fontWeight: 600, letterSpacing: "0.08em" }}>
                日本語
              </span>
              <span style={{ fontSize: 36, fontWeight: 700, color: "var(--text-primary)" }}>
                {ja}
              </span>
              {jaReading && (
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{jaReading}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
