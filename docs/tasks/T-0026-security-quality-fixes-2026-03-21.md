# [T-0026] 보안 및 코드 품질 개선

## 날짜
2026-03-21

## Goal
Code Analyzer + Gap Detector 에이전트의 전체 기능 검증 결과를 바탕으로 발견된 보안 취약점과 코드 품질 이슈를 수정

---

## 작업 내용

### 1. [Critical] JWT Secret Fallback 제거

#### apps/api/src/modules/auth/auth.service.ts
- `generateTokens()` 메서드에서 `?? 'changeme-secret'`, `?? 'changeme-refresh-secret'` 하드코딩 폴백 제거
- 생성자에 환경변수 유무 검증 추가 — 미설정 시 서버 시작 단계에서 에러로 즉시 크래시
  ```typescript
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');
  if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET environment variable is required');
  ```

#### apps/api/src/modules/auth/strategies/jwt.strategy.ts
- `secretOrKey`에서 `?? 'changeme-secret'` 폴백 제거
- 환경변수 미설정 시 전략 인스턴스화 시점에 즉시 에러 throw

**위험도**: 누구든 소스코드를 읽으면 알려진 시크릿으로 JWT를 위조할 수 있었던 Critical 취약점

### 2. [Critical] AI 서비스 JSON.parse try/catch 추가

#### apps/api/src/modules/ai/ai.service.ts
- `translateExplain()`의 `JSON.parse(raw)` 호출을 try/catch로 감쌈
- Claude가 비정상 응답 반환 시 500 Internal Error 대신 503 Service Unavailable + 명확한 메시지 반환

### 3. [Medium] AuthRequest 인터페이스 중복 제거

#### apps/api/src/interfaces/auth-request.interface.ts (신규)
- 5개 컨트롤러에 중복 정의되어 있던 `AuthRequest` 인터페이스를 공유 파일로 통합
- `import type`으로 임포트 (isolatedModules + emitDecoratorMetadata 환경 대응)

#### 수정된 컨트롤러 (5개)
- `ai.controller.ts`
- `auth.controller.ts`
- `learning.controller.ts`
- `users.controller.ts`
- `points.controller.ts`

### 4. [Medium] DTO 검증 추가

#### apps/api/src/modules/auth/dto/refresh.dto.ts (신규)
- `POST /auth/refresh` 엔드포인트에 class-validator DTO 추가
- `userId`, `refreshToken` 필드 `@IsString() @IsNotEmpty()` 검증

#### apps/api/src/modules/share/dto/create-share.dto.ts (신규)
- `POST /share` 엔드포인트에 class-validator DTO 추가
- `lessonId` 필드 `@IsString() @IsNotEmpty()` 검증

### 5. [High] Rate Limiting 추가

#### apps/api (npm install)
- `@nestjs/throttler@6.5.0` 설치

#### apps/api/src/app.module.ts
- `ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }])` 전역 설정
  - 분당 20회 요청 제한 (모든 엔드포인트)
- `APP_GUARD`에 `ThrottlerGuard` 등록 → 전역 적용

### 6. [Low] ModeSwitch i18n 적용

#### apps/web/components/ui/ModeSwitch.tsx
- 하드코딩된 `"한국어"`, `"동시학습"`, `"日本語"` 레이블을 `useT()` 훅으로 교체
- 현재 UI 언어에 따라 학습 모드 버튼 레이블이 자동 변환됨
  - EN: Korean / KR+JP / Japanese
  - KO: 한국어 / KR + JP / 日本語
  - JA: 韓国語 / KR + JP / 日本語

---

## 동작 방식

```
서버 시작
  │
  ▼
AuthService 생성자 → JWT_SECRET 없으면 즉시 에러 (서버 시작 실패)
JwtStrategy 생성자 → JWT_SECRET 없으면 즉시 에러

AI 번역 요청
  │
  ▼
Claude 응답 → JSON.parse 실패 → 503 + "AI response parsing failed" 메시지

모든 API 요청
  │
  ▼
ThrottlerGuard → 분당 20회 초과 시 429 Too Many Requests
```

---

## 결과

- TypeScript 에러 0개 (API + Web)
- JWT Secret 폴백 완전 제거 → 환경변수 미설정 시 서버 즉시 크래시 (silent failure 방지)
- AI JSON.parse 안전하게 처리
- AuthRequest 인터페이스 단일 소스 관리
- Rate Limiting 전역 적용
- ModeSwitch 완전 i18n화

---

## 관련 파일

| 파일 | 변경 유형 |
|------|-----------|
| `apps/api/src/modules/auth/auth.service.ts` | JWT 환경변수 검증 추가, fallback 제거 |
| `apps/api/src/modules/auth/strategies/jwt.strategy.ts` | JWT 환경변수 검증 추가, fallback 제거 |
| `apps/api/src/modules/ai/ai.service.ts` | JSON.parse try/catch 추가 |
| `apps/api/src/interfaces/auth-request.interface.ts` | 신규 — 공유 인터페이스 |
| `apps/api/src/modules/auth/auth.controller.ts` | AuthRequest import 변경, RefreshDto 적용 |
| `apps/api/src/modules/ai/ai.controller.ts` | AuthRequest import 변경 |
| `apps/api/src/modules/learning/learning.controller.ts` | AuthRequest import 변경 |
| `apps/api/src/modules/users/users.controller.ts` | AuthRequest import 변경 |
| `apps/api/src/modules/points/points.controller.ts` | AuthRequest import 변경 |
| `apps/api/src/modules/auth/dto/refresh.dto.ts` | 신규 — RefreshDto |
| `apps/api/src/modules/share/dto/create-share.dto.ts` | 신규 — CreateShareDto |
| `apps/api/src/modules/share/share.controller.ts` | CreateShareDto 적용 |
| `apps/api/src/app.module.ts` | ThrottlerModule + ThrottlerGuard 전역 등록 |
| `apps/web/components/ui/ModeSwitch.tsx` | useT() 훅으로 i18n 적용 |
