# LinguaBridge

한국어와 일본어를 동시에 배울 수 있는 풀스택 학습 플랫폼

**Live:**
- Web: https://web-plum-kappa.vercel.app
- API: https://lingua-api-production-5130.up.railway.app

## Tech Stack

| Layer | Tech |
|-------|------|
| Web | Next.js 16 (App Router) |
| API | NestJS 11 + Prisma 7 |
| DB | PostgreSQL (Railway) |
| Auth | JWT (Access 15m / Refresh 7d) + bcrypt |
| State | Zustand persist |
| AI | Claude Haiku (`@anthropic-ai/sdk`) |
| Deploy | Railway (API + DB) + Vercel (Web) |

## Features

- 플립카드 기반 단어 학습 (KR / JP / BOTH 모드)
- 퀴즈 게임화 — 정답/오답 피드백, 포인트 적립
- 글로벌 리더보드
- 공유 링크 (비로그인 공개 페이지 + OG meta)
- 사전 검색 (한/영/일 동시 검색)
- 연속 학습일(Streak) 트래킹
- **AI 번역·설명** — Claude Haiku 기반, 단어/문장 맥락 설명 (일일 20회 무료)

## Getting Started

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 2. API 설정

```bash
cd apps/api
cp .env.example .env
# .env에서 DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, ANTHROPIC_API_KEY 설정

npm install
npx prisma db push
npx prisma db seed   # 샘플 데이터 삽입
npm run start:dev    # http://localhost:3001
```

### 3. Web 설정

```bash
cd apps/web
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL 확인 (기본값: http://localhost:3001)

npm install
npm run dev          # http://localhost:3000
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/signup | - | 회원가입 |
| POST | /auth/login | - | 로그인 |
| POST | /auth/refresh | - | 토큰 갱신 |
| POST | /auth/logout | ✓ | 로그아웃 |
| GET | /me | ✓ | 내 정보 |
| PATCH | /me/settings | ✓ | 설정 변경 |
| GET | /curriculums | ✓ | 커리큘럼 목록 |
| GET | /curriculums/:id/lessons | ✓ | 레슨 목록 |
| GET | /lessons/:id | ✓ | 레슨 상세 |
| POST | /learning/submit | ✓ | 학습 제출 |
| GET | /learning/progress | ✓ | 학습 진도 |
| GET | /points/balance | ✓ | 포인트 잔액 |
| GET | /points/leaderboard | ✓ | 리더보드 |
| GET | /dictionary/search?q= | ✓ | 사전 검색 |
| POST | /share | ✓ | 공유 링크 생성 |
| GET | /share/:code | - | 공유 링크 조회 |
| POST | /ai/translate-explain | ✓ | AI 번역·설명 (일일 20회) |

## Environment Variables

```env
# apps/api/.env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
PORT=3001
WEB_ORIGIN="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-..."   # Claude AI
```

## Project Structure

```
.
├── apps/
│   ├── api/                  # NestJS API
│   │   ├── prisma/           # Schema + Seed
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── railway.toml      # Railway 배포 설정
│   │   ├── nixpacks.toml     # 빌드 설정
│   │   └── src/
│   │       └── modules/
│   │           ├── auth/
│   │           ├── users/
│   │           ├── curriculum/
│   │           ├── learning/
│   │           ├── points/
│   │           ├── dictionary/
│   │           ├── share/
│   │           └── ai/           # Claude API 번역·설명
│   └── web/                  # Next.js Web
│       ├── vercel.json
│       └── app/
│           ├── (app)/        # 인증 필요 페이지
│           │   ├── dashboard/
│           │   ├── learn/
│           │   ├── dictionary/
│           │   ├── points/
│           │   └── profile/
│           ├── (auth)/       # 공개 인증 페이지
│           │   ├── login/
│           │   └── signup/
│           └── share/[code]/ # 공개 공유 페이지
└── docs/
    ├── tasks/                # T-XXXX 작업 기록
    ├── 01-plan/features/     # PDCA Plan 문서
    ├── 02-design/features/   # PDCA Design 문서
    └── archive/              # 완료된 PDCA 문서
```

---

## 기술 역량 상세 (포트폴리오)

### 1. 웹 프로그래밍 개발

#### 1-1. 풀스택 아키텍처 설계

프론트엔드와 백엔드를 완전히 분리한 **Monorepo 구조**로 구성했습니다. `apps/api`(NestJS)와 `apps/web`(Next.js)이 독립적으로 빌드·배포되며, 공통 타입은 각 레이어에서 TypeScript 인터페이스로 정의해 타입 안전성을 확보했습니다.

```
Client (Next.js) ──HTTP/JSON──► API Server (NestJS) ──Prisma ORM──► PostgreSQL
     │                                  │
  Zustand                         JWT Guard
  (클라이언트 상태)                 (인증 미들웨어)
```

#### 1-2. 백엔드 — NestJS 모듈 아키텍처

NestJS의 **의존성 주입(DI) 컨테이너**를 활용해 각 도메인(auth, users, curriculum, learning, points, dictionary, share, ai)을 독립 모듈로 분리했습니다. 모듈 간 의존성은 `imports` 배열로만 선언하므로 순환 참조 없이 확장 가능합니다.

- **Guards**: `JwtAuthGuard`를 클래스 데코레이터로 등록해 컨트롤러 전체에 인증을 일괄 적용
- **ValidationPipe**: `class-validator` 데코레이터(`@IsEmail`, `@IsString` 등)로 DTO 레벨에서 입력 검증, `whitelist: true`로 불필요한 필드 자동 제거
- **전역 파이프**: `main.ts`에서 `useGlobalPipes`로 등록해 모든 라우트에 일관 적용

```typescript
// 예: JWT Guard + ValidationPipe 적용 패턴
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  @Post('translate-explain')
  translate(@Req() req: AuthRequest, @Body() dto: TranslateDto) { ... }
}
```

#### 1-3. 프론트엔드 — Next.js App Router

Next.js 16의 **Route Groups** `(app)` / `(auth)`로 인증 필요 페이지와 공개 페이지를 분리해 레이아웃 중첩을 활용했습니다.

- **클라이언트 상태**: Zustand + `persist` 미들웨어로 새로고침 후에도 JWT 토큰과 사용자 정보 유지
- **Optimistic UI**: 학습 카드 정답 제출 시 API 응답 전에 UI가 먼저 반응 → 체감 속도 향상
- **CSS 변수 기반 디자인 시스템**: `--brand-kr`, `--brand-jp`, `--glass-bg` 등 CSS 커스텀 프로퍼티로 다크테마 일관성 유지
- **Glass Morphism**: `backdrop-filter: blur`와 반투명 배경으로 모던 UI 구성

#### 1-4. 인증 시스템 — Dual JWT

보안과 사용성을 동시에 확보하기 위해 Access Token(15분)과 Refresh Token(7일)을 분리 운용합니다.

| 토큰 | 유효기간 | 저장 위치 | 역할 |
|------|---------|---------|------|
| Access Token | 15분 | Zustand (메모리) | API 요청 인증 |
| Refresh Token | 7일 | DB (bcrypt 해시) | Access Token 재발급 |

Refresh Token은 평문이 아닌 `bcrypt`로 해시화한 값을 DB에 저장해 DB 유출 시에도 토큰 재사용 불가합니다.

#### 1-5. 배포 파이프라인

- **Railway**: `nixpacks.toml`으로 빌드 단계 정의(Node.js 20 설치 → npm install → prisma generate → nest build), `railway.toml`의 startCommand로 서버 시작 전 `prisma db push` 자동 실행
- **Vercel**: `vercel.json`으로 Next.js 프레임워크 명시, `apps/web` 디렉토리에서 배포
- **CI 없이 자동 배포**: `git push origin main` 한 번으로 Railway + Vercel 동시 배포

---

### 2. DBMS 설계 및 운영

#### 2-1. 테이블 설계 원칙

PostgreSQL 15를 사용하며, **3정규형(3NF)** 기준으로 테이블을 설계했습니다. 모든 테이블은 `cuid()` 기반 문자열 PK를 사용해 UUID보다 짧고 정렬 가능한 ID를 생성합니다.

| 테이블 | 역할 |
|--------|------|
| `users` | 회원 정보, refreshTokenHash 저장 |
| `user_settings` | 학습 언어·알림 설정 (1:1 관계) |
| `curriculums` | 커리큘럼 (KR/JP/BOTH, 난이도) |
| `lessons` | 레슨 (커리큘럼 하위) |
| `cards` | 학습 카드 (영/한/일 + 읽기) |
| `user_progress` | 학습 이력 (카드별 정답 여부, 응답시간) |
| `points_ledger` | 포인트 원장 (이벤트 소싱 패턴) |
| `share_links` | 공유 링크 (UUID 코드) |
| `dictionary_entries` | 사전 (태그 배열, 예문 JSON) |
| `ai_usage` | AI 사용량 추적 (userId+date 복합 유니크) |

#### 2-2. 관계 모델링

```
User ─── 1:1 ──► UserSettings
     ─── 1:N ──► UserProgress
     ─── 1:N ──► PointsLedger
     ─── 1:N ──► ShareLink
     ─── 1:N ──► AiUsage

Curriculum ─── 1:N ──► Lesson ─── 1:N ──► Card
                            └── 1:N ──► UserProgress
                            └── 1:N ──► ShareLink
```

모든 자식 테이블에 `onDelete: Cascade`를 적용해 회원 탈퇴 시 관련 데이터를 DB 레벨에서 일관성 있게 삭제합니다.

#### 2-3. 인덱스 전략

- `dictionary_entries.en` — 사전 검색 풀텍스트 인덱스 (`@@index([en])`)
- `ai_usage(userId, date)` — 복합 유니크 인덱스로 당일 사용량 upsert 시 중복 방지 및 빠른 조회
- `share_links.code` — `@unique` 제약으로 단일 컬럼 인덱스 자동 생성

#### 2-4. 스키마 운영

개발 환경에서는 `prisma db push`(스키마 직접 동기화), 프로덕션(Railway)에서도 동일 방식으로 운영합니다. 이는 Railway 재시작 시 `startCommand`에 `prisma db push --accept-data-loss`를 포함시켜 배포와 스키마 적용을 원자적으로 처리합니다.

> **Prisma 7 적응 사례**: Prisma 7에서 `datasource`의 `url` 필드 제거, `@prisma/adapter-pg` 드라이버 어댑터 필수화, `PrismaPg` 어댑터 초기화 등 Breaking Change를 직접 해결했습니다.

---

### 3. 데이터 모델링 및 데이터 표준화

#### 3-1. 다국어 데이터 모델

언어 학습 도메인 특성상 영어(en), 한국어(ko), 일본어(ja) 세 언어를 **동일 테이블 내 별도 컬럼**으로 저장하는 방식을 선택했습니다. 별도 번역 테이블을 두는 EAV 패턴 대신 이 방식을 택한 이유는:

- 세 언어가 항상 동시에 필요하므로 JOIN 없이 단일 쿼리로 조회 가능
- 언어 수가 고정(3개)이므로 컬럼 수가 예측 가능
- 애플리케이션 레이어에서 언어 선택 로직이 단순(`card.ko`, `card.ja`)

```prisma
model Card {
  en        String        // 영어 원문
  ko        String        // 한국어 번역
  ja        String        // 일본어 번역
  koReading String?       // 한국어 독음 (선택)
  jaReading String?       // 일본어 후리가나 (선택)
}
```

#### 3-2. 이벤트 소싱 — PointsLedger

포인트 잔액을 단일 숫자로 저장하지 않고 **원장(Ledger) 패턴**으로 모든 변화를 이벤트로 기록합니다.

```prisma
model PointsLedger {
  delta  Int     // +10 (카드 정답), +50 (레슨 완료), -20 (아이템 구매)
  reason String  // "CARD_CORRECT" | "LESSON_COMPLETE" | ...
  refId  String? // lessonId 또는 cardId (추적용)
}
```

이 방식의 장점:
- 현재 잔액 = `SUM(delta)` — 집계 쿼리 한 줄
- 모든 포인트 변화 이력 보존 → 부정 사용 탐지 가능
- 잔액 수정 없이 이벤트 추가만으로 기능 확장

#### 3-3. 유연한 데이터 타입 활용

| 컬럼 | 타입 | 이유 |
|------|------|------|
| `dictionary_entries.tags` | `String[]` | PostgreSQL 네이티브 배열, 별도 태그 테이블 불필요 |
| `dictionary_entries.examples` | `Json` | 예문 구조가 `[{en, ko, ja}]`로 고정되어 있지 않아 유연성 필요 |
| `ai_usage.date` | `String` | `"2026-03-19"` 형식으로 저장, 타임존 이슈 없이 날짜 비교 가능 |

#### 3-4. 코드 표준화

도메인 코드(열거형 값)를 DB에 저장할 때 문자열 상수로 표준화했습니다:

| 도메인 | 코드값 | 의미 |
|--------|--------|------|
| 학습 언어 | `"KR"` / `"JP"` / `"BOTH"` | 한국어 / 일본어 / 전체 |
| 카드 타입 | `"WORD"` / `"SENTENCE"` / `"GRAMMAR"` | 단어 / 문장 / 문법 |
| 난이도 | `"beginner"` / `"intermediate"` / `"advanced"` | 초급 / 중급 / 고급 |
| 포인트 사유 | `"CARD_CORRECT"` / `"LESSON_COMPLETE"` | 카드 정답 / 레슨 완료 |
| 구독 플랜 | `"free"` / `"pro"` | 무료 / 유료 |

Prisma 스키마 주석(`// "KR" | "JP" | "BOTH"`)으로 허용 값을 명시해 개발자 간 데이터 표준을 공유합니다.

---

### 4. AI 및 DX 기술

#### 4-1. LLM API 통합 — Claude Haiku

Anthropic의 `claude-haiku-4-5-20251001` 모델을 `@anthropic-ai/sdk`로 직접 통합했습니다. 단순 번역이 아닌 **맥락 있는 설명**을 생성하도록 프롬프트를 구조화했습니다.

**프롬프트 엔지니어링 전략:**
- 출력 형식을 JSON으로 강제(`Respond ONLY with valid JSON`)해 파싱 안정성 확보
- 번역 대상 언어를 동적으로 주입(`${dto.output.map(l => '"${l}": "..."').join(', ')}`)해 재사용성 향상
- 설명 길이를 "Max 2 sentences"로 제한해 토큰 비용 절감 및 UI 표시 최적화

```typescript
// 프롬프트 템플릿 패턴
private buildPrompt(dto: TranslateDto): string {
  return `Translate and explain the following text.
Input (${dto.inputLang}): "${dto.inputText}"
Output languages needed: ${dto.output.join(', ')}

Respond ONLY with valid JSON in this exact format:
{
  "translations": { ... },
  "explanation": "Brief explanation. Max 2 sentences."
}`;
}
```

#### 4-2. AI 비용 통제 설계

무제한 AI 호출은 운영 비용 폭발 위험이 있으므로, **DB 기반 일일 사용량 추적** 시스템을 구현했습니다.

```
요청 수신
  │
  ▼
ai_usage 레코드 upsert (당일 없으면 생성)
  │
  ▼
count >= 20? ──Yes──► 429 Too Many Requests 반환
  │
  No
  ▼
Claude API 호출
  │
  ▼
count + 1 (DB 업데이트)
  │
  ▼
응답 반환 (usage 정보 포함)
```

`@@unique([userId, date])` 복합 인덱스 + `upsert`로 동시 요청 시에도 race condition 없이 정확한 카운팅을 보장합니다.

#### 4-3. DX(디지털 전환) — 학습 경험의 디지털화

전통적인 단어장/교재 학습을 디지털 경험으로 전환한 설계 포인트:

| 기존 학습 방식 | LinguaBridge의 DX |
|-------------|-----------------|
| 종이 단어장 암기 | 플립카드 인터랙션 + 즉각 피드백 |
| 정답 여부 자기 채점 | 응답 시간(latencyMs) 기록 → 숙련도 데이터화 |
| 단순 번역 사전 | AI가 뉘앙스·문화적 맥락 설명 |
| 학습 이력 없음 | Streak, 포인트, 진도율 실시간 추적 |
| 혼자 공부 | 공유 링크로 레슨 공유, 리더보드 경쟁 |

#### 4-4. 데이터 기반 학습 분석

`UserProgress` 테이블에 `latencyMs`(응답 시간)를 저장해 단순 정답률이 아닌 **응답 속도 기반 숙련도 측정**이 가능합니다. 이는 향후 간격 반복 학습(Spaced Repetition) 알고리즘 적용의 기반 데이터가 됩니다.

```
latencyMs 활용 가능성:
- < 1000ms: 완전히 습득한 단어 (복습 주기 늘림)
- 1000~3000ms: 인지는 하지만 느림 (표준 복습)
- > 3000ms: 아직 어려운 단어 (집중 복습)
```

#### 4-5. AI 네이티브 개발 방법론 (PDCA)

이 프로젝트는 **AI 협업 기반 PDCA 개발 방법론**으로 진행됐습니다:

- **Plan**: 기능 목표·범위·기술 결정 문서화
- **Design**: API 명세·DB 스키마·코드 템플릿 선설계
- **Do**: 설계 기반 구현 (TypeScript 0 errors 목표)
- **Check**: AI Gap Detector로 설계-구현 일치율 자동 측정 (ai-translate: **96%**)
- **Act**: 90% 미만 시 AI Iterator가 자동 개선

이 방식으로 23개 태스크(T-0001~T-0023)를 체계적으로 관리하고, 각 기능의 완성도를 정량적으로 측정했습니다.

---

## Progress

현재 진행률: **~95%**

| Task | 내용 | 상태 |
|------|------|------|
| T-0001 ~ T-0007 | 백엔드 기반 (Auth, DB, Curriculum API) | ✅ |
| T-0008 ~ T-0010 | Next.js UI + 디자인 시스템 + FlipCard | ✅ |
| T-0011 | 사전 기능 | ✅ |
| T-0012 | 학습 제출 API + 포인트 API | ✅ |
| T-0013 | 퀴즈 게임화 UI + /points 페이지 | ✅ |
| T-0014 | 공유 기능 | ✅ |
| T-0015 | 학습 진도 대시보드 (Streak) | ✅ |
| T-0016 | 프로필 & 설정 페이지 | ✅ |
| T-0020 | Railway + Vercel 배포 | ✅ |
| T-0021 | 프로덕션 API 테스트 (15개 엔드포인트) | ✅ |
| T-0022 ~ T-0023 | AI 번역·설명 기능 (Claude Haiku, Match Rate 96%) | ✅ |
| — | railway-deploy: ANTHROPIC_API_KEY 추가 → AI 기능 활성화 | ⏳ |
| — | user-profile 확장 (AI 사용량, 통계, 비밀번호 변경) | 📋 |
| — | subscription 유료 티어 (Stripe) | 📋 |
