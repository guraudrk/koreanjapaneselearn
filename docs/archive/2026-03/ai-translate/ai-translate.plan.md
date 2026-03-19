# Plan: ai-translate

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 사용자가 한국어·일본어 단어/문장을 접했을 때 맥락 있는 설명 없이 단순 번역만 제공되어 학습 효율이 낮음 |
| **Solution** | Claude API를 활용한 "번역 + 간단 설명" 엔드포인트를 NestJS에 추가, 하루 무료 사용 한도(20회) 적용 |
| **Function & UX Effect** | 웹 사전 페이지 및 학습 카드에서 "AI 설명 보기" 버튼 → 번역 + 어원/뉘앙스/예문 카드 슬라이드 표시 |
| **Core Value** | 단순 암기를 넘어 "왜 이렇게 말하는지"를 이해하는 학습 경험 제공, 유료 구독 전환 유인 |

---

## 1. 배경 및 목표

### 문제 정의
- 현재 플립카드/사전은 번역(en↔ko/ja)만 제공
- 학습자가 단어의 뉘앙스, 어원, 사용 맥락을 알 수 없음
- 유료 전환 유인 기능 부재

### 목표
- Claude API(`claude-haiku-4-5`) 기반 번역+설명 API 구현
- 일일 무료 20회 제한 → 초과 시 안내 메시지
- 웹 UI에 "AI 설명" 버튼 추가 (사전 페이지, 학습 카드)

---

## 2. 기능 범위 (MVP)

### In Scope
- `POST /ai/translate-explain` 엔드포인트
  - 입력: `{ inputText, inputLang, output: ["ko","ja"] }`
  - 출력: `{ ko, ja, explanation, usage: { usedToday, remainingToday } }`
- 일일 사용량 추적 (DB 또는 메모리 캐시)
- 20회 초과 시 `429` 응답
- 웹: 사전 페이지 + 학습 카드에 "AI 설명" 버튼 및 결과 UI

### Out of Scope (Post-MVP)
- STT (음성 → 번역)
- 심층 설명 (문법/존댓말 레벨)
- 구독 티어별 한도 차등

---

## 3. 기술 결정

| 항목 | 결정 | 이유 |
|------|------|------|
| AI 모델 | `claude-haiku-4-5` | 빠른 응답 속도, 낮은 비용 |
| 사용량 추적 | DB `ai_usage` 테이블 | 재시작 후에도 유지, 정확성 |
| 프롬프트 전략 | JSON 응답 강제 | 파싱 안정성 |
| Provider 추상화 | `AiService` 클래스 | 추후 모델 교체 대응 |

---

## 4. API 명세

### `POST /ai/translate-explain`
**Auth**: JWT 필요

**Request**
```json
{
  "inputText": "안녕하세요",
  "inputLang": "ko",
  "output": ["en", "ja"]
}
```

**Response 200**
```json
{
  "inputText": "안녕하세요",
  "translations": {
    "en": "Hello / How are you",
    "ja": "こんにちは"
  },
  "explanation": "안녕하세요 is the formal greeting in Korean. Literally means 'Are you at peace?'. Used in formal situations and with strangers.",
  "usage": {
    "usedToday": 3,
    "remainingToday": 17
  }
}
```

**Response 429** (한도 초과)
```json
{
  "statusCode": 429,
  "message": "Daily AI usage limit reached (20/20). Try again tomorrow."
}
```

---

## 5. DB 스키마 추가

```prisma
model AiUsage {
  id        String   @id @default(cuid())
  userId    String
  date      String   // "2026-03-19" 형식
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@map("ai_usage")
}
```

---

## 6. 구현 순서

1. `ANTHROPIC_API_KEY` 환경변수 추가 (Railway)
2. `@anthropic-ai/sdk` 패키지 설치
3. Prisma 스키마 `AiUsage` 모델 추가 + `db push`
4. `apps/api/src/modules/ai/` 모듈 생성
   - `ai.service.ts` — Claude 호출 + 사용량 체크
   - `ai.controller.ts` — `POST /ai/translate-explain`
   - `ai.module.ts`
5. `app.module.ts`에 `AiModule` 등록
6. 웹: `apps/web/app/(app)/dictionary/page.tsx` — "AI 설명" 버튼 추가
7. 웹: `apps/web/app/(app)/learn/[curriculumId]/[lessonId]/page.tsx` — 카드에 "AI 설명" 버튼

---

## 7. 완료 기준

- [ ] `POST /ai/translate-explain` 정상 응답
- [ ] 20회 초과 시 429 반환
- [ ] 웹 사전 페이지에서 AI 설명 표시
- [ ] 학습 카드에서 AI 설명 표시
- [ ] 빌드 에러 없음

---

## 8. 마일스톤

| 단계 | 내용 | 예상 |
|------|------|------|
| API 구현 | ai 모듈 + DB | 1세션 |
| Web UI | 버튼 + 결과 카드 | 1세션 |
| 테스트 | 엔드포인트 검증 | 0.5세션 |
