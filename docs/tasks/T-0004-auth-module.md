# [T-0004] NestJS Auth Module (Signup / Login / JWT Refresh / Logout)

## Goal (Why)
사용자가 이메일+비밀번호로 가입하고 로그인할 수 있어야 한다.
JWT Access Token(15분) + Refresh Token(7일) 기반 인증을 구현해 이후 모든 보호 API의 기반을 만든다.

## Scope (What)
- 포함:
  - `UsersModule`: DB 유저 조회/생성 서비스
  - `AuthModule`: signup / login / refresh / logout 엔드포인트
  - JWT strategy + JwtAuthGuard
  - bcrypt 비밀번호 해싱
  - Refresh Token hash를 User 테이블에 저장 (schema 확장 포함)
  - `@nestjs/config` 기반 환경변수 로딩
- 제외:
  - 소셜 로그인 (Post-MVP)
  - 이메일 인증 (Post-MVP)
  - 학습 모드 설정 (T-0005)

## Inputs
- 참고: `docs/implementation_plan.md` §4 Auth API, §5 Milestone 1
- 관련 파일: `apps/api/prisma/schema.prisma`, `apps/api/src/app.module.ts`

## Deliverables (Artifacts)
- `apps/api/src/modules/users/users.module.ts`
- `apps/api/src/modules/users/users.service.ts`
- `apps/api/src/modules/auth/auth.module.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/strategies/jwt.strategy.ts`
- `apps/api/src/modules/auth/guards/jwt-auth.guard.ts`
- `apps/api/src/modules/auth/dto/signup.dto.ts`
- `apps/api/src/modules/auth/dto/login.dto.ts`
- Prisma schema 확장: `refreshTokenHash` 필드
- 검증: `curl POST /auth/signup` → 200 + tokens

## Acceptance Criteria (Definition of Done)
- [ ] POST /auth/signup → 201 + { accessToken, refreshToken, user }
- [ ] POST /auth/login → 200 + { accessToken, refreshToken, user }
- [ ] POST /auth/refresh → 200 + { accessToken, refreshToken }
- [ ] POST /auth/logout → 200 (refreshTokenHash DB에서 제거)
- [ ] 잘못된 비밀번호 → 401 Unauthorized
- [ ] 중복 이메일 가입 → 409 Conflict
- [ ] NestJS 앱 기동 시 에러 없음

## API / DB Changes
- API: POST /auth/signup, /auth/login, /auth/refresh, /auth/logout
- DB migration: users 테이블에 `refresh_token_hash` 컬럼 추가

## Affected Areas
- Modules: auth (new), users (new)
- Routes: /auth/*
- UI Screens: 없음 (API만)

## Verification Plan
- 수동:
  - Given: NestJS 앱 기동 + DB 연결
  - When: POST /auth/signup { email, password, nativeLanguage }
  - Then: 201 + accessToken + refreshToken 반환
- 실패 시 롤백: schema migration rollback

## Dependencies / Risks
- 의존 태스크: T-0003 (완료)
- 리스크: Docker 없으면 로컬 DB 연결 불가 → .env DATABASE_URL 직접 설정 필요

## Status: DOING

## Suggested Model
- Claude: JWT 구현 검증, 보안 리뷰
