# [T-0023] AI 번역·설명 기능 — Do & Check Phase

## 날짜
2026-03-19

## Goal
ai-translate 기능 구현(Do) 및 Gap 분석(Check) 완료

---

## 작업 내용

### 1. Do Phase — 구현

#### 1-1. DB 스키마
- `apps/api/prisma/schema.prisma`에 `AiUsage` 모델 추가
  - `@@unique([userId, date])` 복합 유니크 인덱스
  - `User` 모델에 `aiUsages AiUsage[]` 관계 추가
- `npx prisma generate` 실행 → Prisma Client 재생성

#### 1-2. API 모듈 (4개 파일)

| 파일 | 내용 |
|------|------|
| `apps/api/src/modules/ai/dto/translate.dto.ts` | `@IsString`, `@IsIn`, `@IsArray` 데코레이터 |
| `apps/api/src/modules/ai/ai.service.ts` | Claude haiku-4-5 호출, 일일 20회 한도, upsert 사용량 추적 |
| `apps/api/src/modules/ai/ai.controller.ts` | `POST /ai/translate-explain`, JWT 인증 |
| `apps/api/src/modules/ai/ai.module.ts` | AiService + AiController 등록 |

#### 1-3. app.module.ts
- `AiModule` import 추가

#### 1-4. Web UI

| 파일 | 변경 내용 |
|------|---------|
| `apps/web/app/(app)/dictionary/page.tsx` | 검색 결과 카드 하단 "✨ AI 설명" 버튼 + 결과 카드 |
| `apps/web/app/(app)/learn/[curriculumId]/[lessonId]/page.tsx` | 플립 후 "✨ AI 설명 보기" 버튼 + 결과 카드 |

두 페이지 모두 429 에러 시 안내 메시지, 일반 에러 폴백 처리 포함

#### 1-5. 빌드 검증
- `npx tsc --noEmit` → API 0 errors, Web 0 errors

---

### 2. Check Phase — Gap 분석

| 항목 | 결과 |
|------|------|
| Match Rate | **96%** |
| Missing (누락) | 0건 |
| Added (긍정적 추가) | 4건 (에러 처리, 카드 전환 초기화) |
| Changed (기능 동등) | 2건 (함수 서명 변경, 동등) |
| Critical Gap | **0건** |

분석 결과: `docs/03-analysis/ai-translate.analysis.md`

---

### 3. 미완료 항목 (인프라)

| 항목 | 이유 |
|------|------|
| `prisma db push` (Railway) | Railway DB 공개 URL 자격증명 갱신 필요 |
| Railway 배포 | prisma db push 후 git push → 자동 배포 |
| curl 테스트 | 배포 후 진행 |
| `ANTHROPIC_API_KEY` Railway 환경변수 | 사용자가 직접 추가 필요 |

---

## 커밋 목록

| 커밋 | 내용 |
|------|------|
| `ec1e8c4` | feat: ai-translate 기능 구현 (Claude API 번역+설명) |
| `df63565` | chore: T-0022 Do Phase 진행 상황 업데이트 |
| `9deb21c` | chore: ai-translate Gap 분석 결과 저장 (96% Match Rate) |

## Status: DONE ✓ (배포는 인프라 작업 후 별도 진행)
