# Progress

## 지금 태스크: T-0010 완료 (진행률 ~50%)

## 완료된 태스크
- [x] T-0001 Monorepo Setup — DONE
- [x] T-0002 GitHub Integration — DONE
- [x] T-0003 Prisma + DB Schema (users, user_settings) — DONE
- [x] T-0004 Auth Module (signup/login/refresh/logout + JWT 15m/7d) — DONE
- [x] T-0005 User Settings API (GET /me, PATCH /me/settings) — DONE
- [x] T-0006 Extended DB Schema (Curriculum/Lesson/Card/UserProgress/PointsLedger/Dictionary) — DONE
- [x] T-0007 Curriculum & Lessons API (GET /curriculums, /lessons/:id) — DONE
- [x] T-0008 Next.js Auth UI (로그인/회원가입 페이지 + 2025 디자인) — DONE
- [x] T-0009 Dashboard + Learning Mode Switch (Bento Grid UI) — DONE
- [x] T-0010 Curriculum/Lesson/FlipCard UI (학습 카드 플립 + 진도) — DONE

## T-0004~T-0007 결과
- NestJS Auth: POST /auth/signup|login|refresh|logout
- bcrypt + refresh token rotation (DB hash 저장)
- GET /me, PATCH /me/settings (JwtAuthGuard)
- Prisma schema: 6개 신규 모델 추가
- GET /curriculums, /curriculums/:id/lessons, /lessons/:id
- prisma/seed.ts: KR/JP 커리큘럼 2개, 레슨 4개, 카드 10개, 사전 3개

## T-0008~T-0010 결과 (디자인 시스템 + UI)
- claude.md §11 디자인 시스템 추가 (2025 트렌드: Glassmorphism, Bento, Dark-first)
- 랜딩페이지 (LinguaBridge 브랜드, 히어로 + 기능 소개 + CTA)
- 로그인/회원가입 페이지 (Glassmorphism 카드, 그라데이션 버튼)
- 대시보드 (Bento Grid, ModeSwitch, 커리큘럼 목록)
- FlipCard 컴포넌트 (3D CSS flip, KR/JP/BOTH 모드 대응)
- 학습 페이지 (/learn/:curriculumId/:lessonId, 진도 프로그레스 바)

## 다음 액션 (Milestone 2 후반 + Milestone 3)
- T-0011: Dictionary Search API + UI (영어 → KR/JP 검색)
- T-0012: Points API (GET /points/balance, ledger)
- T-0013: Expo 모바일 앱 기본 구조 + Auth 화면

## 블로커
- Docker Desktop 설치 필요 (prisma migrate dev + seed 실행용)
- apps/api/.env: DATABASE_URL 설정 필요
