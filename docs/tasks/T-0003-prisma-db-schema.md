# [T-0003] Prisma Setup + MVP DB Schema

## Goal (Why)
로컬 개발 환경에서 PostgreSQL + Prisma를 연동해 MVP에 필요한 핵심 테이블(users, user_settings)을 정의하고 마이그레이션을 실행한다. 이후 Auth 모듈(T-0004)이 이 스키마를 기반으로 동작할 수 있게 한다.

## Scope (What)
- 포함:
  - `apps/api`에 Prisma 설치 및 초기 설정
  - `docker-compose.yml` (로컬 Postgres + Redis)
  - Prisma schema: `users`, `user_settings` 테이블
  - `prisma migrate dev` 실행 및 검증
  - `PrismaModule` (NestJS) 등록
- 제외:
  - Auth 로직, JWT, 비밀번호 해싱 (T-0004)
  - 커리큘럼/사전/AI 관련 테이블 (추후 태스크)
  - 프로덕션 DB 설정, CI/CD

## Inputs
- 참고 문서: `docs/implementation_plan.md` (§3 데이터 모델, §5 Milestone 0)
- 관련 파일: `apps/api/src/app.module.ts`, `apps/api/package.json`

## Deliverables (Artifacts)
- `infra/docker/docker-compose.yml`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/prisma/prisma.module.ts`
- `apps/api/src/prisma/prisma.service.ts`
- `apps/api/src/app.module.ts` (PrismaModule 등록)
- 검증: `prisma migrate dev` 성공 로그

## Acceptance Criteria (Definition of Done)
- [ ] `docker compose up -d` 로 Postgres, Redis 컨테이너 기동 가능
- [ ] `npx prisma migrate dev` 실행 시 에러 없이 마이그레이션 완료
- [ ] `npx prisma studio` 또는 DB 클라이언트로 `users`, `user_settings` 테이블 확인
- [ ] NestJS 앱 기동 시 DB 연결 성공 로그 출력

## API / DB Changes
- API: 없음 (이번 태스크는 인프라/스키마 전용)
- DB migration: Initial migration — `users`, `user_settings`
- 데이터 seed: 없음 (추후)

## DB Schema (users / user_settings)

```prisma
model User {
  id             String       @id @default(cuid())
  email          String       @unique
  passwordHash   String
  nativeLanguage String       @default("en")
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  settings       UserSettings?
}

model UserSettings {
  id           String   @id @default(cuid())
  userId       String   @unique
  learningMode String   @default("BOTH") // "KR" | "JP" | "BOTH"
  notifications Boolean  @default(true)
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Affected Areas
- Modules: `prisma` (new), `app.module`
- Routes: 없음
- UI Screens: 없음

## Verification Plan
- 자동 테스트: Prisma migrate dry-run
- 수동 테스트:
  - Given: docker-compose up 완료
  - When: `npx prisma migrate dev --name init` 실행
  - Then: migration 파일 생성 + DB에 테이블 존재
  - DB 변화: users, user_settings 테이블 생성
- 실패 시 롤백: `docker compose down -v` 후 재시도

## Dependencies / Risks
- 의존 태스크: T-0001 (완료), T-0002 (완료)
- 리스크: Docker Desktop 미설치 시 로컬 Postgres 수동 설치 필요

## Status: DONE ✓

## Suggested Model
- Claude: 스키마 설계 검증 / NestJS 모듈 구조
