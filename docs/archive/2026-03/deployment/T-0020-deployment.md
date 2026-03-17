# [T-0020] 배포 — Railway (API) + Vercel (Web)

## 날짜
2026-03-17

## Goal
LinguaBridge를 실제 프로덕션 환경에 배포한다.
- API: Railway (NestJS + PostgreSQL)
- Web: Vercel (Next.js)

## 사전 점검 (TDD Red)

| 항목 | 상태 | 비고 |
|------|------|------|
| `start:prod` 경로 오류 | ✅ 수정 | `dist/main` → `dist/src/main` |
| Prisma 마이그레이션 없음 | ✅ db push 사용 | nixpacks.toml에 포함 |
| CORS 설정 | ✅ 기존 완료 | WEB_ORIGIN 환경변수 |
| TypeScript 빌드 | ✅ 0 errors | tsc --noEmit 확인 완료 |
| Next.js 빌드 | ✅ 11 routes | 기존 확인 완료 |

## 배포 절차

### 1. Railway — API

1. railway.app → New Project → Deploy from GitHub repo
2. Root directory: `apps/api`
3. Build command: nixpacks 자동 감지 (nixpacks.toml 참고)
4. 환경변수 설정:
   ```
   DATABASE_URL=<Railway PostgreSQL URL>
   JWT_SECRET=<random 64자>
   JWT_REFRESH_SECRET=<random 64자>
   WEB_ORIGIN=https://<vercel-domain>.vercel.app
   PORT=3001
   ```
5. PostgreSQL 플러그인 추가 → `DATABASE_URL` 자동 주입

### 2. Vercel — Web

1. vercel.com → New Project → GitHub repo import
2. Root directory: `apps/web`
3. 환경변수:
   ```
   NEXT_PUBLIC_API_URL=https://<railway-domain>.up.railway.app
   ```

## 수정된 파일

- `apps/api/package.json` — start:prod 경로 수정
- `apps/api/nixpacks.toml` — Railway 빌드 설정
- `apps/web/vercel.json` — Vercel 라우팅 설정

## Status: DONE ✓
