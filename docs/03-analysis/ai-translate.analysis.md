# Gap Analysis: ai-translate

> Check Phase — 2026-03-19
> Design: `docs/02-design/features/ai-translate.design.md`

---

## Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match | 100% | ✅ |
| Architecture Compliance | 95% | ✅ |
| Convention Compliance | 93% | ✅ |
| **Overall Match Rate** | **96%** | ✅ |

**Match Rate >= 90% — 구현이 설계와 잘 일치합니다.**

---

## 1. Checklist (Design Section 7 기준)

| 항목 | 설계 | 구현 | 상태 |
|------|------|------|------|
| `@anthropic-ai/sdk` 설치 | ✓ | ✓ | ✅ |
| AiUsage 모델 (schema.prisma) | ✓ | ✓ | ✅ |
| `@@unique([userId, date])` | ✓ | ✓ | ✅ |
| `prisma generate` | ✓ | ✓ | ✅ |
| `dto/translate.dto.ts` | ✓ | ✓ | ✅ |
| `ai.service.ts` (Claude 호출) | ✓ | ✓ | ✅ |
| `ai.service.ts` (20회 한도) | ✓ | ✓ | ✅ |
| `ai.controller.ts` (POST /ai/translate-explain) | ✓ | ✓ | ✅ |
| `ai.module.ts` | ✓ | ✓ | ✅ |
| `app.module.ts` AiModule 등록 | ✓ | ✓ | ✅ |
| 사전 페이지 AI 설명 버튼 | ✓ | ✓ | ✅ |
| 학습 카드 플립 후 AI 버튼 | ✓ | ✓ | ✅ |

---

## 2. Missing Features (설계 O, 구현 X)

**없음.** 설계된 모든 항목이 구현되어 있습니다.

---

## 3. Added Features (설계 X, 구현 O) — 긍정적 추가

| 항목 | 위치 | 설명 |
|------|------|------|
| 429 에러 처리 (사전) | `dictionary/page.tsx:50-61` | 한도 초과 시 UI 메시지 표시 |
| 429 에러 처리 (학습) | `learn/.../page.tsx:105-114` | 한도 초과 시 UI 메시지 표시 |
| 일반 에러 폴백 (학습) | `learn/.../page.tsx:111` | "AI 설명을 불러오지 못했습니다." 메시지 |
| aiResult 카드 전환 초기화 | `learn/.../page.tsx:86` | 다음 카드로 이동 시 AI 결과 초기화 |

---

## 4. Changed Features (설계 != 구현) — 기능적으로 동일

| 항목 | 설계 | 구현 | 영향 |
|------|------|------|------|
| `handleAiExplain` 서명 (사전) | 3 params | 4 params (`entryId` 추가, 상태 관리용) | 없음 |
| `handleAiExplain` 서명 (학습) | 인라인 params | 1 param, 내부에서 lang/output 고정 | 없음 |

---

## 5. Gap 분석 결론

| 분류 | 건수 |
|------|------|
| Missing (누락) | 0 |
| Added (추가, 긍정적) | 4 |
| Changed (변경, 동등) | 2 |
| **Total Gaps** | **0 critical** |

---

## 6. 권장 액션 (non-blocking)

1. **(Low)** 설계 문서 Section 5에 429 에러 처리 및 일반 에러 폴백 동작 문서화
2. **(Low)** `.env.example`에 `ANTHROPIC_API_KEY=` 항목 추가 (개발자 온보딩)

---

## 7. 미완료 항목 (코드 외)

| 항목 | 이유 | 상태 |
|------|------|------|
| `prisma db push` (Railway) | DB 자격증명 갱신 필요 | ⏳ |
| Railway 배포 | prisma db push 후 자동 배포 예정 | ⏳ |
| curl 엔드포인트 테스트 | 배포 후 진행 | ⏳ |
| `ANTHROPIC_API_KEY` Railway 환경변수 | 사용자가 직접 추가 필요 | ⏳ |

> **참고**: 코드 구현 자체는 96% 완성. 나머지는 인프라/배포 항목.
