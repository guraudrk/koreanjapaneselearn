# Tech Stack & Repository Structure

## 1. 기술 스택

### Frontend (Web)
- **프레임워크**: Next.js (React) + TypeScript
- **UI**: TailwindCSS + shadcn/ui
- **상태/서버통신**: TanStack Query
- **폼/검증**: react-hook-form + zod
- **i18n**: next-intl (앱 자체 다국어 UI 대비)

### Mobile (App)
- **프레임워크**: React Native (Expo) + TypeScript
- **네비게이션**: React Navigation
- **API/캐시**: TanStack Query

### Backend
- **프레임워크**: NestJS (Node.js, TypeScript)
  - 선택 이유: 프론트/모바일 TS 단일화, 인증/모듈 구조 깔끔
- **DB**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + Refresh Token (또는 Supabase Auth)
- **캐시/레이트리밋**: Redis
- **스토리지**: S3 호환 (Cloudflare R2 / AWS S3) — 이미지/음성/썸네일
- **관측/로그**: Sentry + OpenTelemetry (선택)

### AI/외부 모델 연동
- **번역/설명**: Gemini / Claude — Provider 추상화 레이어
- **STT**: Whisper(호스팅) 또는 Cloud STT (Post-MVP)
- **이미지 변환**: Stable Diffusion 계열 또는 외부 API (Post-MVP)

---

## 2. 모노레포 구조 (권장 표준)

```
repo/
  claude.md                  # Engineering Playbook (harness)
  apps/
    web/                     # Next.js
    mobile/                  # Expo RN
    api/                     # NestJS
  packages/
    shared/                  # zod schema, types, utils
    ai-core/                 # AI Provider 추상화 (Claude/Gemini/Mock)
  infra/
    docker/                  # docker-compose, local dev
    terraform/               # (선택) IaC
  docs/
    prd.md
    implementation_plan.md
    task_creation_rules.md
    task_execution_rules.md
    API.md
    DECISIONS.md
    tasks/
      T-0001-...
      T-0002-...
  progress/
    PROGRESS.md              # 현재 태스크/다음 액션/블로커
    CHANGELOG.md             # 결정이 바뀐 이유 기록
    FAILURES.md              # 막힌 원인/해결 기록
  skills/                    # 이 폴더 — 에이전트 참고 문서
```

---

## 3. 반드시 존재해야 하는 파일/폴더 (File Bootstrap)

작업 시작 시 아래 경로가 없으면 즉시 생성:

| 경로 | 역할 |
|------|------|
| `progress/PROGRESS.md` | 현재 태스크 / 다음 액션 / 블로커 |
| `progress/CHANGELOG.md` | 의사결정 변경 이유 기록 |
| `progress/FAILURES.md` | 막힌 원인 / 해결 기록 (같은 함정 2번 방지) |
| `docs/` | 설계 문서 폴더 |
| `docs/tasks/` | 태스크 파일 폴더 |

`PROGRESS.md` 생성 직후 최소 3줄 기록 필수:
```
- 지금 태스크:
- 다음 액션:
- 블로커:
```

---

## 4. API (NestJS) 내부 구조

```
apps/api/src/
  modules/
    auth/
    users/
    curriculum/
    learning/            # 카드, 퀴즈, 진도
    dictionary/          # 백과사전 검색
    points/              # 포인트/리더보드
    share/               # 공유 링크/OG 태그
    ai/                  # 번역/설명/STT/이미지 변환
    subscriptions/       # 구독/결제
  common/
    guards/
    interceptors/
    pipes/
    rate-limit/
  prisma/
    schema.prisma
```

---

## 5. AI Provider 운영 규칙

- **Gemini**: 초안/대량 생성/문서/리서치/옵션 비교
- **Claude**: 설계 검증/경계조건/디버깅/리팩터링/코드 품질
- 한 태스크의 "메인 실행 모델"은 하나로 정하고, 다른 모델은 리뷰/보완 역할
- AI 요청은 **항상 서버에서** (클라이언트 직접 호출 금지) — 키 보호/사용량 통제
- AI 응답은 캐싱 (동일 입력/동일 옵션) + 재사용
- 프롬프트는 `packages/ai-core/prompts/`에 템플릿화 — 모델 교체 비용 최소화
- 로그/트레이싱으로 토큰 사용량 추적

---

## 6. 패키지 관리

- 모노레포 패키지 매니저: **npm workspaces** (또는 pnpm)
- 각 앱별 실행 명령:
  - Web: `npm run dev` (apps/web)
  - API: `npm run start:dev` (apps/api)
  - Mobile: `npx expo start` (apps/mobile)
