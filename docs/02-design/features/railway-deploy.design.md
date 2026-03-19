# Design: railway-deploy

> Plan 참조: `docs/01-plan/features/railway-deploy.plan.md`

---

## 1. 핵심 발견 사항

`railway.toml`과 `nixpacks.toml` 모두 **시작 시 자동으로 `prisma db push`를 실행**합니다:

```toml
# apps/api/railway.toml
[deploy]
startCommand = "npx prisma db push --accept-data-loss && node dist/src/main"

# apps/api/nixpacks.toml
[start]
cmd = "npx prisma db push --accept-data-loss && node dist/src/main"
```

**결론**: `prisma db push`를 로컬에서 수동 실행할 필요가 없습니다.
재배포 시 Railway 서버가 시작하면서 `ai_usage` 테이블이 자동 생성됩니다.

---

## 2. 아키텍처 흐름

```
사용자 액션                     Railway                        결과
──────────────────              ────────────────────           ──────────────
Railway Dashboard               lingua-api 서비스
  └─ ANTHROPIC_API_KEY 추가 ──► ENV 저장
                                   ↓
GitHub (git push) ──────────►  빌드 시작
                                   ├─ npm install
                                   ├─ npx prisma generate
                                   └─ npm run build
                                   ↓
                                서비스 시작
                                   ├─ npx prisma db push  ──► ai_usage 테이블 생성
                                   └─ node dist/src/main  ──► API 서버 시작
                                   ↓
curl 테스트 ────────────────►  POST /ai/translate-explain ──► Claude API 호출 ──► 응답
```

---

## 3. 필요한 작업 (순서 중요)

### Step 1: ANTHROPIC_API_KEY 설정 (사용자 직접)

Railway 대시보드에서:
1. `lingua-api` 서비스 선택
2. **Variables** 탭 → **New Variable**
3. Key: `ANTHROPIC_API_KEY`, Value: `sk-ant-api03-...`
4. 저장 → Railway가 자동으로 재배포 시작

> **주의**: 저장 즉시 Railway가 자동 재배포를 트리거합니다.
> 이 재배포 시 `prisma db push`가 실행되어 `ai_usage` 테이블이 생성됩니다.

### Step 2: 배포 완료 확인

Railway 대시보드 → lingua-api → **Deployments** 탭에서:
- 최신 배포 상태: `SUCCESS` 확인
- 빌드 로그에서 `prisma db push` 실행 확인

### Step 3: curl 테스트

```bash
API_URL="https://<your-railway-api-url>"

# 1. 로그인하여 JWT 토큰 획득
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  | python3 -m json.tool | grep accessToken | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. AI 번역 테스트 (정상)
curl -s -X POST "$API_URL/ai/translate-explain" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputText":"안녕하세요","inputLang":"ko","output":["en","ja"]}' \
  | python3 -m json.tool

# 기대 응답:
# {
#   "inputText": "안녕하세요",
#   "translations": { "en": "Hello", "ja": "こんにちは" },
#   "explanation": "...",
#   "usage": { "usedToday": 1, "remainingToday": 19 }
# }
```

---

## 4. 환경변수 체크리스트

Railway lingua-api 서비스에 필요한 전체 환경변수:

| 변수명 | 상태 | 설명 |
|--------|------|------|
| `DATABASE_URL` | ✅ 기존 설정됨 | Railway PostgreSQL 내부 URL |
| `JWT_SECRET` | ✅ 기존 설정됨 | JWT 액세스 토큰 시크릿 |
| `JWT_REFRESH_SECRET` | ✅ 기존 설정됨 | JWT 리프레시 토큰 시크릿 |
| `PORT` | ✅ 기존 설정됨 | Railway 자동 설정 |
| `ANTHROPIC_API_KEY` | ❌ **추가 필요** | Claude API 키 |

---

## 5. 에러 시나리오 및 대응

| 에러 | 원인 | 대응 |
|------|------|------|
| 배포 실패: `prisma db push` 오류 | DB 연결 실패 | Railway DB 서비스 상태 확인, DATABASE_URL 재확인 |
| `500 Internal Server Error` | `ANTHROPIC_API_KEY` 없음 | Variables 탭에서 키 추가 후 재배포 |
| `401 Unauthorized` | JWT 토큰 만료/없음 | 로그인 재시도로 토큰 갱신 |
| `429 Too Many Requests` | 일일 20회 한도 초과 | 정상 동작 — 내일 자정(UTC) 리셋 |
| Claude API 오류 | 잘못된 API 키 | ANTHROPIC_API_KEY 값 확인 |

---

## 6. 검증 체크리스트 (Do Phase)

- [ ] Railway Variables 탭에 `ANTHROPIC_API_KEY` 추가
- [ ] Railway 재배포 `SUCCESS` 확인
- [ ] 배포 로그에서 `prisma db push` 실행 확인
- [ ] `POST /ai/translate-explain` → 200 + translations + explanation
- [ ] `usage.usedToday` 값이 증가하는지 확인 (2번 연속 호출)
- [ ] 웹 사전 페이지 → "AI 설명" 버튼 클릭 → 결과 표시
- [ ] 웹 학습 카드 → 플립 → "AI 설명 보기" 버튼 → 결과 표시
