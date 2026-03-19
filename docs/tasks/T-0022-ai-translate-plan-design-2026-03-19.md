# [T-0022] AI 번역·설명 기능 — Plan & Design

## 날짜
2026-03-19

## Goal
Claude API 기반 번역+설명 기능(ai-translate)의 PDCA Plan·Design 문서 작성

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

## 다음 할 일 (Do Phase)

1. `ANTHROPIC_API_KEY` Railway 환경변수 추가
2. `npm install @anthropic-ai/sdk`
3. `schema.prisma` AiUsage 모델 추가 + `prisma db push`
4. ai/ 모듈 4개 파일 구현
5. `app.module.ts` AiModule 등록
6. 웹 UI 버튼 추가
7. Railway 배포 + 테스트

## Status: DONE ✓
