# [T-0027] Railway 배포 검증 및 API 연동 완료

## 날짜
2026-03-22

## Goal
ANTHROPIC_API_KEY 추가 후 Railway API 전체 기능 검증 및 최신 코드 배포 완료

---

## 작업 내용

### 1. Railway 최신 코드 배포

Railway가 GitHub auto-deploy 없이 구버전 코드(AI 모듈 미포함)를 실행 중이었음을 발견.
Railway CLI로 최신 코드(`main` 브랜치, commit `fce67f3`) 직접 배포:

```bash
cd apps/api
railway link --project pleasant-motivation
railway service lingua-api
railway up --detach
```

### 2. 환경변수 확인

Railway `lingua-api` 서비스 환경변수 전체 확인:

| 변수명 | 상태 |
|--------|------|
| `DATABASE_URL` | ✅ 설정됨 |
| `JWT_SECRET` | ✅ 설정됨 |
| `JWT_REFRESH_SECRET` | ✅ 설정됨 |
| `PORT` | ✅ 3001 |
| `ANTHROPIC_API_KEY` | ✅ 설정됨 |

### 3. 엔드포인트 검증 결과

| 엔드포인트 | 결과 | 비고 |
|-----------|------|------|
| `GET /` | ✅ 200 | 서버 정상 동작 |
| `POST /auth/signup` | ✅ 201 | 회원가입 정상 |
| `POST /auth/login` | ✅ 200 | JWT 발급 정상 |
| `GET /me` | ✅ 200 | JWT 인증 정상 |
| `GET /curriculums` | ✅ 200 | 커리큘럼 목록 반환 |
| `GET /ai/tip?locale=en` | ⚠️ `{"tip":null}` | API key 크레딧 부족 |
| `POST /ai/translate-explain` | ⚠️ 500 | API key 크레딧 부족 |

### 4. AI 기능 미동작 원인

Anthropic API 에러 로그:
```
BadRequestError: 400 {"type":"error","error":{"type":"invalid_request_error",
"message":"Your credit balance is too low to access the Anthropic API.
Please go to Plans & Billing to upgrade or purchase credits."}}
```

- ANTHROPIC_API_KEY는 정상 등록되어 Anthropic API 인증 성공
- 해당 계정의 크레딧 잔액 부족으로 API 호출 거부
- AI 기능 (`/ai/tip`, `/ai/translate-explain`)은 크레딧 충전 후 즉시 동작

### 5. 추가 발견: 라우트 경로 확인

- 커리큘럼 엔드포인트: `/curriculum` (X) → `/curriculums` (O)
- `CurriculumController` `@Controller()`에 `@Get('curriculums')` 패턴 사용

---

## 현재 배포 상태

- **Railway API URL**: `https://lingua-api-production-5130.up.railway.app`
- **배포 커밋**: `fce67f3` (T-0026 보안 수정 포함)
- **Vercel Web URL**: `https://web-plum-kappa.vercel.app`

## 남은 작업

- [ ] Anthropic 크레딧 충전 (`console.anthropic.com` → Plans & Billing)
- [ ] 충전 후 `/ai/tip`, `/ai/translate-explain` 동작 확인

---

## 관련 작업

- T-0025: AI 대시보드 Tip 기능 구현
- T-0026: 보안 취약점 수정 (JWT, rate limiting 등)
- T-0023: AI translate 기능 구현

## 관련 파일

- `apps/api/railway.toml` — startCommand: prisma db push + node main
- `apps/api/nixpacks.toml` — 빌드 설정
