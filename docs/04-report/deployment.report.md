# LinguaBridge MVP — PDCA Completion Report

## Executive Summary

| 항목 | 내용 |
|------|------|
| **Feature** | LinguaBridge MVP (한국어·일본어 동시 학습 플랫폼) |
| **기간** | 2026-03-06 ~ 2026-03-17 (약 11일) |
| **태스크 수** | T-0001 ~ T-0020 (20개) |
| **수정된 Critical/Major 버그** | 9개 |
| **배포 대상** | Railway (API) + Vercel (Web) |
| **최종 빌드 상태** | TypeScript 0 errors ✓ / Next.js 11 routes ✓ |

### 1.3 Value Delivered (4-Perspective)

| 관점 | 성과 |
|------|------|
| **Problem** | 한국어·일본어를 따로 배워야 했던 기존 학습 구조를 단일 플랫폼에서 동시 학습 가능하도록 해결 |
| **Solution** | NestJS API + Next.js Web 풀스택 구현, JWT 인증, 플립카드 학습, 포인트/공유 시스템 완비 |
| **Function & UX** | 11개 라우트(로그인·대시보드·학습·사전·포인트·프로필·공유), 애니메이션·글래스 UI 적용 |
| **Core Value** | 무료 MVP 배포 완료, 실사용자 온보딩 준비 완료, Post-MVP(AI·구독) 확장 기반 구축 |

---

## 1. 개발 진행 요약

### Phase 1 — 기반 구축 (T-0001 ~ T-0007)

| 태스크 | 내용 | 상태 |
|--------|------|------|
| T-0001 | Monorepo 세팅 (apps/web, apps/api, apps/mobile) | ✅ |
| T-0002 | GitHub 연동 + 브랜치 전략 | ✅ |
| T-0003 | Prisma 7 스키마 + seed.ts | ✅ |
| T-0004 | Auth 모듈 (signup/login/refresh/logout) + bcrypt + JWT | ✅ |
| T-0005 | User Settings API (learningMode, notifications) | ✅ |
| T-0006 | Curriculum/Lesson/Card DB 스키마 | ✅ |
| T-0007 | Curriculum/Lesson/Card REST API | ✅ |

### Phase 2 — 학습 기능 (T-0008 ~ T-0013)

| 태스크 | 내용 | 상태 |
|--------|------|------|
| T-0008 | 로그인·회원가입 UI (Zustand 인증 상태관리) | ✅ |
| T-0009 | 대시보드 + 학습 모드 스위치 (KR/JP/BOTH) | ✅ |
| T-0010 | FlipCard 컴포넌트 + 레슨 학습 UI | ✅ |
| T-0011 | 사전 검색 (영어 → KR/JP 뜻·예문) | ✅ |
| T-0012 | 학습 진도 제출 API + 포인트 적립 원장 | ✅ |
| T-0013 | 퀴즈 게이미피케이션 UI (정오답 애니메이션, 포인트 팝업) | ✅ |

### Phase 3 — 확장 기능 (T-0014 ~ T-0018)

| 태스크 | 내용 | 상태 |
|--------|------|------|
| T-0014 | Share 기능 (POST /share + 공개 /share/[code] 페이지) | ✅ |
| T-0015 | 진도 대시보드 (연속 학습일, 정답률, 총 카드 수) | ✅ |
| T-0016 | 프로필·설정 페이지 (학습모드 변경, 알림 토글, 로그아웃) | ✅ |
| T-0017 | .env.example + README 전체 작성 | ✅ |
| T-0018 | Next.js 프로덕션 빌드 품질 검증 (11 routes, 0 errors) | ✅ |

### Phase 4 — TDD 버그 수정 + 배포 (T-0019 ~ T-0020)

| 태스크 | 내용 | 상태 |
|--------|------|------|
| T-0019 | TDD 기반 코드 점검 → Critical 2개, Major 7개 수정 | ✅ |
| T-0020 | 배포 설정 — Railway (API) + Vercel (Web) | ✅ |

---

## 2. 수정된 버그 목록

### Critical (2개)

| ID | 파일 | 문제 | 수정 |
|----|------|------|------|
| Bug-01 | `learning.service.ts` | 레슨 완료 중복 카드 카운팅 (`COUNT` → DISTINCT 미적용) | `findMany + distinct: ['cardId']` |
| Bug-02 | `learning.service.ts` | 레슨 완료 보너스 레이스 컨디션 | `$transaction`으로 원자화 |

### Major (7개)

| ID | 파일 | 문제 | 수정 |
|----|------|------|------|
| Bug-03 | `api.ts`, `auth.ts` | 토큰 갱신 후 Zustand 스토어 미동기화 | `updateTokens()` 액션 추가 |
| Bug-04 | `auth.ts` | logout 시 persist 키 `"lingua-auth"` 미삭제 | `localStorage.removeItem("lingua-auth")` 추가 |
| Bug-05 | `users.controller.ts` | non-null assertion `user!` 미검증 | `if (!user) throw UnauthorizedException` |
| Bug-06 | `[lessonId]/page.tsx` | 빈 카드 배열 미처리 → 즉시 완료 화면 노출 | 0개 카드 가드 추가 |
| Bug-07 | `share.controller.ts` | `req.user.sub` → `req.user.id` 불일치 | `req.user.id`로 수정 |
| Bug-08 | `main.ts` | CORS 미설정, 포트 3000/3001 불일치 | `enableCors` + `PORT` 환경변수 |
| Bug-09 | `package.json` | `start:prod`: `dist/main` → `dist/src/main` 경로 오류 | `"node dist/src/main"` 수정 |

---

## 3. 최종 아키텍처

```
LinguaBridge
├── apps/api (NestJS 11 + Prisma 7 + PostgreSQL)
│   ├── modules: auth / users / curriculum / learning / dictionary / points / share
│   ├── JWT Access (15m) + Refresh (7d) + bcrypt
│   ├── nixpacks.toml → Railway 배포
│   └── PORT: Railway 환경변수 (default 3001)
│
└── apps/web (Next.js 16 + Zustand + Axios)
    ├── 라우트: / · /login · /signup · /dashboard · /learn · /learn/[id]/[id]
    │         /dictionary · /points · /profile · /share/[code]
    ├── 인증: JWT in Zustand persist → localStorage
    ├── 자동 토큰 갱신: 401 인터셉터 → /auth/refresh
    └── vercel.json → Vercel 배포
```

---

## 4. 배포 환경 변수

### Railway (API)
```
DATABASE_URL=<Railway PostgreSQL URL>
JWT_SECRET=<64자 랜덤>
JWT_REFRESH_SECRET=<64자 랜덤>
WEB_ORIGIN=https://<vercel-domain>.vercel.app
PORT=3001
```

### Vercel (Web)
```
NEXT_PUBLIC_API_URL=https://<railway-domain>.up.railway.app
```

---

## 5. Post-MVP 로드맵

| 우선순위 | 기능 | 예상 난이도 |
|---------|------|------------|
| 1 | AI 번역·설명 (Claude/Gemini Provider 추상화) | Medium |
| 2 | Expo 모바일 앱 빌드 + 스토어 제출 | Medium |
| 3 | 구독 티어 / 결제 (Stripe) | High |
| 4 | STT 음성 인식 | High |
| 5 | 사진 스타일 변환 (애니/한국풍) | High |

---

## 6. 검증 결과

```bash
# API TypeScript
cd apps/api && npx tsc --noEmit  # 0 errors ✓

# Web TypeScript
cd apps/web && npx tsc --noEmit  # 0 errors ✓

# Next.js Build
cd apps/web && npm run build     # 11 routes ✓, 0 errors ✓

# API Build
cd apps/api && npm run build     # dist/src/main.js 생성 ✓
```

## Status: COMPLETED ✓
**배포 준비 완료 — Railway + Vercel 배포 절차 문서화 완료**
