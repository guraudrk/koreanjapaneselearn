# Data Model (초안)

## 핵심 테이블

### users
- 계정 정보, 언어권(nativeLanguage), 타임존
- 필드: id, email, passwordHash, nativeLanguage, createdAt, updatedAt

### user_settings
- 학습 모드: `KR` / `JP` / `BOTH`
- 알림 설정
- 필드: userId, learningMode, notifications(JSON), updatedAt

### curriculums
- 레벨/코스 구조 (예: 기초, 초급, 중급, 고급)
- 필드: id, title, language(`KR`|`JP`|`BOTH`), level, order

### lessons
- 커리큘럼 하위 레슨
- 필드: id, curriculumId, title, order, type(`CARD`|`QUIZ`)

### cards
- 단어/문장 카드 (한/일/영)
- 필드: id, lessonId, en, ko, ja, audioUrlKo, audioUrlJa, tags[]

### progress
- 유저별 학습 진도/정답률
- 필드: id, userId, lessonId, cardId, correct(bool), latencyMs, answeredAt

### dictionary_entries
- 백과사전 (표제어/뜻/예문/태그)
- 필드: id, en, ko, ja, tags[], examples(JSON), createdAt

### points_ledger
- 포인트 적립/차감 원장 (이벤트 소싱 방식)
- 필드: id, userId, delta(int), reason, refId, createdAt

### shares
- 공유 링크/공유된 카드/성과
- 필드: id, userId, type(`CARD`|`PROGRESS`), refId, code(unique), ogImageUrl, createdAt

### ai_usage
- 일일 사용량 카운팅 (무료 티어 제한)
- 필드: id, userId, date(date), featureType(`TRANSLATE`|`STT`|`IMAGE`), count, updatedAt

### subscriptions
- 구독 티어/상태/기간 (Post-MVP)
- 필드: id, userId, tier(`FREE`|`PRO`), status(`ACTIVE`|`CANCELLED`|`EXPIRED`), startAt, endAt

---

## 관계 다이어그램 요약

```
users
  ├── user_settings (1:1)
  ├── progress (1:N)
  ├── points_ledger (1:N)
  ├── shares (1:N)
  ├── ai_usage (1:N, per day)
  └── subscriptions (1:1 active)

curriculums
  └── lessons (1:N)
        └── cards (1:N)
              └── progress (1:N, via userId)
```

---

## Prisma Schema 작성 시 주의사항

- `points_ledger`는 INSERT only (UPDATE/DELETE 금지) — 원장 무결성 유지
- `ai_usage`는 `(userId, date, featureType)` unique 인덱스 필요 — upsert 패턴으로 카운팅
- `shares.code`는 랜덤 short code (예: nanoid 8자)
- `cards`의 audioUrl은 S3 호환 스토리지 경로로 저장
- 모든 테이블에 `createdAt`, `updatedAt` 기본 포함
