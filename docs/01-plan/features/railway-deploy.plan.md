# Plan: railway-deploy

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | ai-translate 기능 구현은 완료됐지만 Railway DB에 AiUsage 테이블이 없고 ANTHROPIC_API_KEY 미설정으로 실제 서비스에서 동작하지 않음 |
| **Solution** | Railway DB 자격증명 갱신 → `prisma db push` → 환경변수 설정 → 배포 확인 → curl 테스트로 엔드포인트 검증 |
| **Function & UX Effect** | 사전·학습 페이지의 "AI 설명" 버튼이 실제 동작하고 Claude AI 설명을 사용자에게 제공 |
| **Core Value** | ai-translate 기능을 실제 사용자에게 오픈, 서비스 완성도 향상 및 유료 전환 유인 활성화 |

---

## 1. 배경 및 목표

### 현재 상태
- 코드: ✅ 완료 (TypeScript 0 errors, Match Rate 96%)
- Railway DB: ❌ `ai_usage` 테이블 없음 (prisma db push 미실행)
- Railway ENV: ❌ `ANTHROPIC_API_KEY` 미설정
- 실서비스: ❌ AI 설명 버튼 동작 안 함

### 목표
- Railway PostgreSQL에 `ai_usage` 테이블 생성
- `ANTHROPIC_API_KEY` 환경변수 설정
- 배포 후 `POST /ai/translate-explain` curl 테스트 통과

---

## 2. 기능 범위 (MVP)

### In Scope
- Railway DB 공개 URL 확인 및 `prisma db push` 실행
- Railway lingua-api 서비스 환경변수 `ANTHROPIC_API_KEY` 추가
- git push → Railway 자동 배포 확인
- curl로 엔드포인트 검증 (정상 응답 + 429 한도 초과 테스트)

### Out of Scope
- DB 마이그레이션 히스토리 관리 (prisma migrate)
- 스테이징 환경 구성

---

## 3. 기술 결정

| 항목 | 결정 | 이유 |
|------|------|------|
| DB 스키마 적용 | `prisma db push` | Railway 환경, 마이그레이션 파일 없이 스키마 동기화 |
| 배포 트리거 | git push → Railway 자동 | railway.toml 이미 설정됨 |
| 테스트 방식 | curl | 빠른 엔드포인트 검증 |

---

## 4. 실행 순서

1. Railway 대시보드 → lingua-api 서비스 → Variables 탭 → DB 공개 URL 확인
2. 로컬에서: `DATABASE_URL="<public_url>" npx prisma db push --accept-data-loss`
3. Railway lingua-api Variables 탭 → `ANTHROPIC_API_KEY=sk-ant-...` 추가
4. git push (이미 코드 완료) → Railway 자동 배포 대기
5. curl 테스트:
   ```bash
   # 로그인하여 JWT 토큰 획득
   TOKEN=$(curl -s -X POST https://<api-url>/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"password"}' | jq -r '.accessToken')

   # AI 번역 테스트
   curl -X POST https://<api-url>/ai/translate-explain \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"inputText":"안녕하세요","inputLang":"ko","output":["en","ja"]}'
   ```

---

## 5. 완료 기준

- [ ] Railway DB에 `ai_usage` 테이블 생성 확인
- [ ] `POST /ai/translate-explain` → 200 + JSON 응답
- [ ] 20회 초과 시 429 응답
- [ ] 웹 사전 페이지에서 "AI 설명" 버튼 실제 동작 확인
