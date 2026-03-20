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
