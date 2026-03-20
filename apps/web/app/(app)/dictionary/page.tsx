"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useT } from "@/lib/i18n";

interface DictionaryEntry {
  id: string;
  en: string;
  ko: string;
  ja: string;
  koReading: string | null;
  jaReading: string | null;
  tags: string[];
  examples: { en: string; ko: string; ja: string }[] | null;
}

interface AiResult {
  translations: Record<string, string>;
  explanation: string;
  usage: { usedToday: number; remainingToday: number };
}

export default function DictionaryPage() {
  const t = useT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [aiResult, setAiResult] = useState<Record<string, AiResult | null>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/dictionary/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAiExplain(entryId: string, inputText: string, inputLang: string, output: string[]) {
    setAiLoading((prev) => ({ ...prev, [entryId]: true }));
    try {
      const { data } = await api.post("/ai/translate-explain", { inputText, inputLang, output });
      setAiResult((prev) => ({ ...prev, [entryId]: data }));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setAiResult((prev) => ({
        ...prev,
        [entryId]: {
          translations: {},
          explanation: status === 429 ? t("common.ai_limit") : t("common.ai_error"),
          usage: { usedToday: 20, remainingToday: 0 },
        },
      }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [entryId]: false }));
    }
  }

  return (
    <div className="fade-up" style={{ padding: 32, maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{t("dict.title")}</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          {t("dict.subtitle")}
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("dict.placeholder")}
          style={{
            flex: 1,
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: 12,
            padding: "12px 16px",
            color: "var(--text-primary)",
            fontSize: 15,
            outline: "none",
            transition: "border-color 200ms",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--brand-both)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--glass-border)")}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, var(--brand-both), var(--brand-jp))",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? t("dict.searching") : t("dict.search")}
        </button>
      </form>

      {/* Results */}
      {!searched && (
        <div className="glass" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 14 }}>{t("dict.empty_hint")}</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="glass" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😢</div>
          <p style={{ fontSize: 14 }}>
            {t("dict.no_results", { q: query })}
          </p>
          <p style={{ fontSize: 12, marginTop: 6 }}>{t("dict.no_results_hint")}</p>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {t("dict.result_count", { n: results.length })}
          </p>
          {results.map((entry) => (
            <div
              key={entry.id}
              className="glass"
              style={{ padding: 24, transition: "transform 200ms" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              {/* English */}
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                {entry.en}
                {entry.tags.length > 0 && (
                  <span style={{ marginLeft: 10 }}>
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "rgba(99,102,241,0.15)",
                          color: "var(--brand-both)",
                          marginLeft: 4,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </div>

              {/* KR + JP side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 10,
                    background: "rgba(255,77,109,0.06)",
                    border: "1px solid rgba(255,77,109,0.15)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "var(--brand-kr)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.06em" }}>
                    {t("common.lang_kr")}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{entry.ko}</div>
                  {entry.koReading && (
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{entry.koReading}</div>
                  )}
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 10,
                    background: "rgba(192,132,252,0.06)",
                    border: "1px solid rgba(192,132,252,0.15)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "var(--brand-jp)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.06em" }}>
                    {t("common.lang_jp")}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{entry.ja}</div>
                  {entry.jaReading && (
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{entry.jaReading}</div>
                  )}
                </div>
              </div>

              {/* Examples */}
              {entry.examples && Array.isArray(entry.examples) && entry.examples.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--glass-border)" }}>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{t("dict.examples")}</p>
                  {(entry.examples as { en: string; ko: string; ja: string }[]).map((ex, i) => (
                    <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                      <span style={{ color: "var(--text-muted)" }}>EN </span>{ex.en} ·{" "}
                      <span style={{ color: "var(--brand-kr)" }}>KR </span>{ex.ko} ·{" "}
                      <span style={{ color: "var(--brand-jp)" }}>JP </span>{ex.ja}
                    </div>
                  ))}
                </div>
              )}

              {/* AI Explain */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--glass-border)" }}>
                <button
                  onClick={() => handleAiExplain(entry.id, entry.en, "en", ["ko", "ja"])}
                  disabled={aiLoading[entry.id]}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(99,102,241,0.35)",
                    background: "rgba(99,102,241,0.08)",
                    color: "var(--brand-both)",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {aiLoading[entry.id] ? t("common.ai_analyzing") : t("common.ai_explain")}
                </button>

                {aiResult[entry.id] && (
                  <div className="glass" style={{ marginTop: 10, padding: 14, background: "rgba(99,102,241,0.05)" }}>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                      {aiResult[entry.id]!.explanation}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, marginBottom: 0 }}>
                      {t("common.ai_remaining", { n: aiResult[entry.id]!.usage.remainingToday })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
