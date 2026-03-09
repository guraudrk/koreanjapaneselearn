# [T-0008] Next.js 로그인 / 회원가입 UI 페이지

## Goal (Why)
사용자가 브라우저에서 실제로 회원가입하고 로그인할 수 있는 화면을 만든다.
백엔드 Auth API(T-0004)와 연결해 토큰을 발급받고 대시보드로 진입할 수 있게 한다.

## Scope (What)
- 포함:
  - `/login` 페이지 (이메일 + 비밀번호 입력 → POST /auth/login)
  - `/signup` 페이지 (이메일 + 비밀번호 + 모국어 선택 → POST /auth/signup)
  - Zustand 기반 Auth 상태 관리 (`store/auth.ts`)
  - Axios 인스턴스 + JWT 자동 갱신 인터셉터 (`lib/api.ts`)
  - 로그인 성공 시 `/dashboard` 리다이렉트
  - 오류 메시지 표시 (중복 이메일, 잘못된 비밀번호 등)
- 제외:
  - 소셜 로그인 (Post-MVP)
  - 비밀번호 찾기 (Post-MVP)
  - 이메일 인증 (Post-MVP)

## Inputs
- 참고: `docs/implementation_plan.md` §4 Auth API, §5 Milestone 1
- 참고: `claude.md` §11 디자인 시스템
- 의존 태스크: T-0004 (Auth API 완료)

## Deliverables (Artifacts)
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/app/(auth)/signup/page.tsx`
- `apps/web/lib/api.ts` (axios + JWT refresh interceptor)
- `apps/web/store/auth.ts` (zustand persist)
- 검증: 브라우저에서 회원가입 → 로그인 → 대시보드 진입 확인

## Acceptance Criteria (Definition of Done)
- [ ] `/signup` 에서 가입 후 자동 로그인 → `/dashboard` 이동
- [ ] `/login` 에서 정상 로그인 → `/dashboard` 이동
- [ ] 잘못된 비밀번호 → 오류 메시지 표시
- [ ] Zustand persist로 새로고침 후에도 로그인 유지
- [ ] tsc --noEmit 에러 없음

## API / DB Changes
- API: POST /auth/signup, POST /auth/login 호출 (기존 API 사용)
- DB: 없음

## Affected Areas
- Modules: web/(auth)
- Routes: /login, /signup
- UI Screens: 로그인 페이지, 회원가입 페이지

## Verification Plan
- 수동:
  - Given: NestJS API 실행 중
  - When: /signup 에서 신규 계정 생성
  - Then: /dashboard 로 이동, localStorage에 accessToken 저장 확인
- tsc --noEmit 통과

## Dependencies / Risks
- 의존 태스크: T-0004 (완료)
- 리스크: NEXT_PUBLIC_API_URL 환경변수 미설정 시 API 연결 불가

## Status: DONE ✓

## Suggested Model
- Claude: 폼 유효성 검사, 보안 리뷰
