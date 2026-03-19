# Plan: user-profile

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 현재 프로필 페이지는 학습 언어 설정·알림 토글·로그아웃만 제공하며, AI 사용량·학습 통계·비밀번호 변경·계정 삭제 등 사용자가 필요로 하는 정보와 기능이 없음 |
| **Solution** | 프로필 페이지를 확장하여 AI 사용량 현황, 학습 통계(누적 포인트·완료 레슨), 비밀번호 변경, 계정 탈퇴 기능 추가 |
| **Function & UX Effect** | 사용자가 자신의 학습 현황과 AI 잔여 횟수를 한눈에 파악하고, 계정 관리(비밀번호 변경·탈퇴)를 직접 처리 가능 |
| **Core Value** | 사용자 자율성 강화 및 서비스 신뢰도 향상; AI 잔여 횟수 노출로 유료 전환 유인 강화 |

---

## 1. 배경 및 목표

### 현재 상태 (`apps/web/app/(app)/profile/page.tsx`)
- 아바타 + 이메일 표시 ✅
- 학습 언어 설정 (KR/JP/BOTH) ✅
- 알림 토글 ✅
- 로그아웃 ✅

### 추가할 기능
- **AI 사용량 카드**: 오늘 사용 횟수 / 남은 횟수 (20회 한도)
- **학습 통계 카드**: 누적 포인트, 완료한 레슨 수
- **비밀번호 변경**: 현재 비밀번호 확인 → 새 비밀번호 설정
- **계정 탈퇴**: 확인 모달 → 계정 삭제

---

## 2. 기능 범위 (MVP)

### In Scope
- AI 사용량 조회 (`GET /me/ai-usage`) — 오늘 사용량
- 학습 통계 조회 (`GET /me/stats`) — 포인트 합계, 완료 레슨 수
- 비밀번호 변경 (`PATCH /me/password`)
- 계정 탈퇴 (`DELETE /me`)
- 프로필 페이지 UI 확장

### Out of Scope (Post-MVP)
- 닉네임/표시 이름 설정
- 아바타 이미지 업로드
- 소셜 로그인 연동

---

## 3. 기술 결정

| 항목 | 결정 | 이유 |
|------|------|------|
| AI 사용량 API | 신규 `GET /me/ai-usage` | `ai_usage` 테이블 당일 레코드 조회 |
| 통계 API | 신규 `GET /me/stats` | points_ledger SUM + user_progress COUNT |
| 비밀번호 변경 | 신규 `PATCH /me/password` | 현재 비밀번호 bcrypt 검증 필수 |
| 계정 탈퇴 | 신규 `DELETE /me` | Cascade 삭제 (Prisma onDelete: Cascade) |
| UI | 기존 profile/page.tsx 확장 | 새 파일 불필요 |

---

## 4. API 명세

### `GET /me/ai-usage`
```json
// Response 200
{ "usedToday": 3, "remainingToday": 17, "dailyLimit": 20 }
```

### `GET /me/stats`
```json
// Response 200
{ "totalPoints": 1240, "completedLessons": 8, "totalCards": 47 }
```

### `PATCH /me/password`
```json
// Request
{ "currentPassword": "oldpass", "newPassword": "newpass123" }
// Response 200
{ "message": "Password updated" }
// Response 401
{ "message": "Current password is incorrect" }
```

### `DELETE /me`
```json
// Response 200
{ "message": "Account deleted" }
```

---

## 5. 구현 순서

1. `apps/api/src/modules/users/users.controller.ts` — 3개 엔드포인트 추가
2. `apps/api/src/modules/users/users.service.ts` — 비즈니스 로직 추가
3. `apps/web/app/(app)/profile/page.tsx` — AI 사용량 카드, 통계 카드, 비밀번호 변경 폼, 탈퇴 버튼 추가

---

## 6. 완료 기준

- [ ] `GET /me/ai-usage` → 오늘 사용량 반환
- [ ] `GET /me/stats` → 포인트 합계, 레슨 수 반환
- [ ] `PATCH /me/password` → 비밀번호 변경, 오류 시 401
- [ ] `DELETE /me` → 계정 삭제 후 로그아웃
- [ ] 프로필 페이지에 4개 카드 표시
- [ ] TypeScript 0 errors
