# Progress

## 지금 태스크: T-0007 완료 → T-0008 대기 (Next.js Auth UI)

## 완료된 태스크
- [x] T-0001 Monorepo Setup — DONE
- [x] T-0002 GitHub Integration — DONE
- [x] T-0003 Prisma + DB Schema (users, user_settings) — DONE
- [x] T-0004 Auth Module (signup/login/refresh/logout + JWT 15m/7d) — DONE
- [x] T-0005 User Settings API (GET /me, PATCH /me/settings) — DONE
- [x] T-0006 Extended DB Schema (Curriculum/Lesson/Card/UserProgress/PointsLedger/Dictionary) — DONE
- [x] T-0007 Curriculum & Lessons API (GET /curriculums, /lessons/:id) — DONE

## T-0004~T-0007 결과
- NestJS Auth: POST /auth/signup|login|refresh|logout
- bcrypt + refresh token rotation (DB hash 저장)
- GET /me, PATCH /me/settings (JwtAuthGuard)
- Prisma schema: 6개 신규 모델 추가
- GET /curriculums, /curriculums/:id/lessons, /lessons/:id
- prisma/seed.ts: KR/JP 커리큘럼 2개, 레슨 4개, 카드 10개, 사전 3개

## 다음 액션 (Milestone 1 UI)
- T-0008: Next.js 로그인/회원가입 UI 페이지
- T-0009: 학습 모드 선택 스위치 UI

## 블로커
- Docker Desktop 설치 필요 (prisma migrate dev + seed 실행용)
- apps/api/.env: DATABASE_URL 설정 필요
