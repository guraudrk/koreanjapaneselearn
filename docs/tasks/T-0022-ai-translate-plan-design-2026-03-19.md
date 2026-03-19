# [T-0022] AI 번역·설명 기능 — Plan, Design & Do

## 날짜
2026-03-19

## Goal
Claude API 기반 번역+설명 기능(ai-translate)의 PDCA Plan·Design·Do 완료

## 작업 내용

### 1. Plan 문서 작성
- 경로: `docs/01-plan/features/ai-translate.plan.md`
- 문제 정의: 단순 번역만 제공 → 맥락 있는 학습 불가
- 솔루션: `claude-haiku-4-5` 기반 번역+설명 API, 일일 20회 무료 한도
- 기술 결정: AiService Provider 추상화, DB 기반 사용량 추적

### 2. Design 문서 작성
- 경로: `docs/02-design/features/ai-translate.design.md`

#### API 설계
- `POST /ai/translate-explain` (JWT 필요)
- 요청: `{ inputText, inputLang, output[] }`
- 응답: `{ translations, explanation, usage: { usedToday, remainingToday } }`
- 한도 초과 시 429 반환

#### DB 스키마
```prisma
model AiUsage {
  id        String   @id @default(cuid())
  userId    String
  date      String   // "2026-03-19"
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(...)

  @@unique([userId, date])
  @@map("ai_usage")
}
```

#### 모듈 구조
```
apps/api/src/modules/ai/
├── dto/translate.dto.ts
├── ai.service.ts
├── ai.controller.ts
└── ai.module.ts
```

#### Web UI 변경 대상
- `dictionary/page.tsx` — 검색 결과 카드에 "AI 설명" 버튼
- `learn/[curriculumId]/[lessonId]/page.tsx` — 플립카드 뒷면에 "AI 설명 보기" 버튼

### 3. Do Phase 구현 (완료)

| 항목 | 상태 | 비고 |
|------|------|------|
| `@anthropic-ai/sdk` 설치 | ✓ | v0.80.0 |
| `schema.prisma` AiUsage 모델 추가 | ✓ | @@unique([userId, date]) |
| `prisma generate` | ✓ | Prisma Client 재생성 완료 |
| `prisma db push` | ⏳ | Railway DB 자격증명 필요 |
| `ai/dto/translate.dto.ts` | ✓ | class-validator 데코레이터 |
| `ai/ai.service.ts` | ✓ | Claude haiku-4-5, 20회 한도 |
| `ai/ai.controller.ts` | ✓ | JWT 인증, POST /ai/translate-explain |
| `ai/ai.module.ts` | ✓ | |
| `app.module.ts` AiModule 등록 | ✓ | |
| `dictionary/page.tsx` AI 버튼 | ✓ | 429 에러 처리 포함 |
| `learn/.../page.tsx` AI 버튼 | ✓ | 플립 후 표시 |
| TypeScript 빌드 검증 | ✓ | 0 errors |
| Railway 배포 | ⏳ | `prisma db push` 후 진행 |
| curl 테스트 | ⏳ | 배포 후 진행 |

### 남은 작업
1. Railway lingua-api 서비스에 `ANTHROPIC_API_KEY` 환경변수 추가
2. Railway DB 공개 URL 확인 후 `prisma db push` 실행
3. `git push` → Railway 자동 배포 → curl 테스트

## Status: IN PROGRESS (배포 대기)
