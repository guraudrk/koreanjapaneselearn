# Implementation Plan

## 0) 목표/범위 정의

### MVP 목표
- 회원가입/로그인
- 학습 모드 선택: **한국어만 / 일본어만 / 동시 학습**
- 단계별 커리큘럼(기초~중급) + 학습 카드/퀴즈
- 백과사전 검색(영어 입력 → KR/JP 뜻 + 예문)
- 포인트 적립 + 기본 공유(링크/이미지 공유)
- AI 기능 1종(텍스트 기반): “내 언어 → KR/JP 번역 + 간단 설명” (일일 제한)

### Post-MVP
- STT(모국어 음성 인식) → KR/JP 변환
- 심층 설명 AI(문법/뉘앙스/존댓말)
- 구독 티어(무료/유료) + 결제
- 사진 스타일 변환(애니/한국풍) + 갤러리/공유

---

## 1) 기술 스택 제안

### Frontend (Web)
- **Next.js (React) + TypeScript**
- UI: **TailwindCSS + shadcn/ui**
- 상태/서버통신: **TanStack Query**
- 폼/검증: **react-hook-form + zod**
- i18n: **next-intl** (앱 자체 다국어 UI 대비)

### Mobile (App)
- **React Native (Expo) + TypeScript**
- 네비게이션: **React Navigation**
- API/캐시: **TanStack Query**

### Backend
- **NestJS (Node.js, TypeScript)** 또는 **FastAPI(Python)** 중 택1  
  - 추천: NestJS (프론트/모바일 TS 단일화, 인증/모듈 구조 깔끔)
- DB: **PostgreSQL**
- ORM: **Prisma**
- Auth: **JWT + Refresh Token** (또는 Supabase Auth로 단축)
- 캐시/레이트리밋: **Redis**
- 스토리지: **S3 호환(Cloudflare R2/AWS S3)** (이미지/음성/썸네일)
- 관측/로그: **Sentry + OpenTelemetry(선택)**

### AI/외부 모델 연동(추상화)
- 번역/설명: Gemini / Claude 등 **Provider 추상화 레이어**
- STT: Whisper(호스팅) 또는 Cloud STT(추후)
- 이미지 변환: Stable Diffusion 계열(호스팅) 또는 외부 API(추후)

---

## 2) 리포지토리/파일 구조

### 모노레포(추천)
```
repo/
  apps/
    web/                 # Next.js
    mobile/              # Expo RN
    api/                 # NestJS/FastAPI
  packages/
    ui/                  # 공통 UI 컴포넌트(웹 중심)
    shared/              # zod schema, types, utils
    ai-core/             # AI Provider 추상화(Claude/Gemini/Mock)
  infra/
    docker/              # docker-compose, local dev
    terraform/           # (선택) IaC
  docs/
    PRD.md
    API.md
    ARCHITECTURE.md
```

### API (NestJS) 내부 구조 예시
```
apps/api/src/
  modules/
    auth/
    users/
    curriculum/
    learning/            # 카드, 퀴즈, 진도
    dictionary/          # 백과사전 검색
    points/              # 포인트/리더보드
    share/               # 공유 링크/OG 태그
    ai/                  # 번역/설명/STT/이미지 변환
    subscriptions/       # 구독/결제
  common/
    guards/
    interceptors/
    pipes/
    rate-limit/
  prisma/
    schema.prisma
```

---

## 3) 데이터 모델(초안)

### 핵심 테이블
- `users` : 계정, 언어권, 타임존
- `user_settings` : 학습 모드(kr/jp/both), 알림 설정
- `curriculums` / `lessons` : 레벨/코스/레슨 구조
- `cards` : 단어/문장 카드(한/일/영)
- `progress` : 유저별 학습 진도/정답률
- `dictionary_entries` : 백과사전(표제어/뜻/예문/태그)
- `points_ledger` : 포인트 적립/차감 원장
- `shares` : 공유 링크/공유된 카드/성과
- `ai_usage` : 일일 사용량 카운팅(무료 티어 제한)
- `subscriptions` : 티어/상태/기간

---

## 4) API 명세(초안)

### Auth
- `POST /auth/signup`
  - req: `{ email, password, nativeLanguage, targetMode }`
  - res: `{ accessToken, refreshToken, user }`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### User/Settings
- `GET /me`
- `PATCH /me/settings`
  - req: `{ learningMode: "KR"|"JP"|"BOTH", notifications: {...} }`

### Curriculum / Learning
- `GET /curriculums`
- `GET /curriculums/:id/lessons`
- `GET /lessons/:id`
- `POST /learning/submit`
  - req: `{ lessonId, cardId, answer, latencyMs }`
  - res: `{ correct, pointsAwarded, progress }`
- `GET /learning/progress`

### Dictionary (백과사전)
- `GET /dictionary/search?q=...&from=en`
  - res: `[{ entryId, en, ko, ja, tags, examples[] }]`
- `GET /dictionary/:entryId`

### Points / Share
- `GET /points/balance`
- `GET /points/leaderboard?scope=friends|global`
- `POST /share`
  - req: `{ type: "CARD"|"PROGRESS", refId }`
  - res: `{ shareUrl }`
- `GET /share/:code` (OG 메타 포함)

### AI (일일 제한/구독 티어)
- `POST /ai/translate-explain`
  - req: `{ inputText, inputLang, output: ["ko","ja"], detailLevel: "basic"|"deep" }`
  - res: `{ ko, ja, explanation, usage: { remainingToday } }`
- `POST /ai/stt-translate` (Post-MVP)
  - req: `multipart(audio)`
  - res: `{ transcript, ko, ja, explanation, usage }`
- `POST /ai/style-transfer` (Post-MVP)
  - req: `multipart(image) + { style: "anime"|"k-style" }`
  - res: `{ imageUrl, usage }`

### Subscriptions (Post-MVP)
- `GET /subscriptions/plans`
- `POST /subscriptions/checkout`
- `POST /subscriptions/webhook` (결제사 webhook)

---

## 5) 단계별 마일스톤

### Milestone 0 — 개발 환경/기반
- 모노레포 세팅, lint/format, CI
- DB(Postgres) + Prisma 마이그레이션
- 기본 도메인 모듈 골격(auth/users)

**완료 기준**
- 로컬에서 web/api/mobile 모두 기동
- DB 마이그레이션/seed 동작

### Milestone 1 — 인증/설정/학습 모드
- signup/login/refresh
- 학습 모드 스위치(KR/JP/BOTH)
- 기본 대시보드(오늘 학습/진도)

**완료 기준**
- 로그인 후 학습 모드 변경이 DB에 저장되고 UI 반영

### Milestone 2 — 커리큘럼/카드/진도
- 커리큘럼/레슨/카드 API
- 퀴즈 제출/채점/진도 저장
- 포인트 적립(원장 기반)

**완료 기준**
- 레슨 1개를 끝까지 완료하면 진도/포인트가 누적됨

### Milestone 3 — 백과사전
- 영어 검색 → KR/JP 뜻 + 예문 반환
- 검색 UX(자동완성은 옵션)
- 관리자용 seed(초기 데이터 주입)

**완료 기준**
- `dictionary/search`로 최소 N개 엔트리 검색 가능

### Milestone 4 — AI(텍스트) + 일일 제한
- `ai-core` Provider 추상화(Gemini/Claude/Mock)
- 번역+간단 설명(기본 레벨)
- 무료 티어 일일 제한(예: 20회/일), 초과 시 안내

**완료 기준**
- AI 호출 로그/카운트가 `ai_usage`로 집계되고, 제한이 정확히 동작

### Milestone 5 — 공유/성장 루프
- 학습 성과/카드 공유 링크 생성
- OG 이미지/메타(웹)
- 포인트 공유 화면

**완료 기준**
- 공유 링크 열면 카드/성과를 누구나 볼 수 있고, 앱 설치 유도 가능

---

## 6) Post-MVP 로드맵(추천 순서)
- **심층 설명 AI(문법/뉘앙스)**: “왜 이렇게 번역되는지”, 존댓말/문화 맥락 설명 강화
- **STT(다국어 음성 인식)**: 음성 업로드 → transcript → KR/JP 변환 (사용량 제한 포함)
- **구독 티어/결제**: 무료(일일 제한) vs 유료(상향/고성능/한도 완화)
- **사진 스타일 변환(놀이 기능)**: 이미지 업로드/변환/갤러리/공유

---

## 7) 개발 운영 규칙(한도/비용 절감용)
- AI 요청은 **항상 서버에서**(클라이언트 직접 호출 금지) → 키 보호/사용량 통제
- AI 응답은 캐싱(동일 입력/동일 옵션) + 재사용
- 프롬프트는 템플릿화(`packages/ai-core/prompts/`)해서 모델 교체 비용 최소화
- 로그/트레이싱으로 “어디서 토큰이 새는지” 추적
