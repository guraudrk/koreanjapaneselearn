# Progress

## 지금 태스크: T-0004 (Auth 모듈 — NestJS JWT 인증)

## 완료된 태스크
- [x] T-0001 Monorepo Setup — DONE
- [x] T-0002 GitHub Integration — DONE
- [x] T-0003 Prisma + DB Schema — DONE

## T-0003 결과
- infra/docker/docker-compose.yml (Postgres 16 + Redis 7)
- apps/api/prisma/schema.prisma: User, UserSettings 모델
- apps/api/src/prisma/: PrismaService + PrismaModule (@Global)
- prisma generate 완료, tsc 에러 없음

## 다음 액션 (Milestone 1)
- T-0004: NestJS Auth 모듈 (signup/login/JWT refresh)
- T-0005: Next.js Auth UI (로그인/회원가입 페이지)

## 블로커
- Docker Desktop 설치 필요 (로컬 DB 기동용, prisma migrate dev 실행 시)
