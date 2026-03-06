# API 명세 (초안)

> Base URL: `/api/v1`
> 인증: `Authorization: Bearer <accessToken>` (보호된 엔드포인트)
> 에러 포맷: `{ statusCode, message, error }`

---

## Auth

### POST /auth/signup
- **req**: `{ email, password, nativeLanguage, targetMode: "KR"|"JP"|"BOTH" }`
- **res**: `{ accessToken, refreshToken, user }`

### POST /auth/login
- **req**: `{ email, password }`
- **res**: `{ accessToken, refreshToken, user }`

### POST /auth/refresh
- **req**: `{ refreshToken }`
- **res**: `{ accessToken, refreshToken }`

### POST /auth/logout
- **req**: `{ refreshToken }`
- **res**: `204 No Content`

---

## User / Settings

### GET /me
- **res**: `{ id, email, nativeLanguage, settings: { learningMode, notifications } }`

### PATCH /me/settings
- **req**: `{ learningMode?: "KR"|"JP"|"BOTH", notifications?: { ... } }`
- **res**: `{ settings }`

---

## Curriculum / Learning

### GET /curriculums
- **res**: `[ { id, title, language, level, lessonCount } ]`

### GET /curriculums/:id/lessons
- **res**: `[ { id, title, order, type, cardCount } ]`

### GET /lessons/:id
- **res**: `{ id, title, cards: [ { id, en, ko, ja, audioUrlKo, audioUrlJa } ] }`

### POST /learning/submit
- **req**: `{ lessonId, cardId, answer, latencyMs }`
- **res**: `{ correct, pointsAwarded, progress: { lessonId, completionRate } }`

### GET /learning/progress
- **res**: `[ { lessonId, completionRate, lastAnsweredAt } ]`

---

## Dictionary (백과사전)

### GET /dictionary/search?q=...&from=en
- **res**: `[ { entryId, en, ko, ja, tags, examples: [ { sentence, translation } ] } ]`

### GET /dictionary/:entryId
- **res**: `{ entryId, en, ko, ja, tags, examples[] }`

---

## Points / Share

### GET /points/balance
- **res**: `{ balance, lastUpdatedAt }`

### GET /points/leaderboard?scope=friends|global
- **res**: `[ { userId, nickname, balance, rank } ]`

### POST /share
- **req**: `{ type: "CARD"|"PROGRESS", refId }`
- **res**: `{ shareUrl, code }`

### GET /share/:code
- **res**: OG 메타 포함 공유 페이지 데이터 `{ type, data, ogImage }`

---

## AI (일일 제한 / 구독 티어)

### POST /ai/translate-explain
- **req**: `{ inputText, inputLang, output: ["ko","ja"], detailLevel: "basic"|"deep" }`
- **res**: `{ ko, ja, explanation, usage: { remainingToday, limit } }`
- **제한**: 무료 20회/일, 유료 무제한

### POST /ai/stt-translate _(Post-MVP)_
- **req**: `multipart(audio)`
- **res**: `{ transcript, ko, ja, explanation, usage }`

### POST /ai/style-transfer _(Post-MVP)_
- **req**: `multipart(image) + { style: "anime"|"k-style" }`
- **res**: `{ imageUrl, usage }`

---

## Subscriptions _(Post-MVP)_

### GET /subscriptions/plans
- **res**: `[ { tier, price, features[] } ]`

### POST /subscriptions/checkout
- **req**: `{ planId, paymentMethod }`
- **res**: `{ checkoutUrl }`

### POST /subscriptions/webhook
- 결제사 webhook 수신 (Stripe 등)

---

## 공통 에러 코드

| 코드 | 의미 |
|------|------|
| 400 | 잘못된 요청 (validation 실패) |
| 401 | 인증 필요 |
| 403 | 권한 없음 (구독 티어 미달 포함) |
| 404 | 리소스 없음 |
| 429 | AI 일일 제한 초과 |
| 500 | 서버 오류 |
