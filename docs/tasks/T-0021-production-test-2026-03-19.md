# [T-0021] 프로덕션 배포 후 전체 기능 테스트

## 날짜
2026-03-19

## Goal
Railway + Vercel 배포 완료 후 실제 프로덕션 환경에서 모든 API 엔드포인트 동작 검증 및 시드 데이터 투입

## 작업 내용

### 1. 시드 데이터 투입
- Railway DB (Public URL 경유)에 커리큘럼/레슨/카드/사전 데이터 삽입
- `package.json`에 `seed` 스크립트 추가
- Korean Basics (2 레슨, 5 카드) + Japanese Basics (2 레슨, 4 카드) 생성
- 사전 3개 항목 (love, food, preparation) 삽입

### 2. 전체 API 엔드포인트 테스트 결과

| 기능 | 엔드포인트 | 결과 |
|------|-----------|------|
| 회원가입 | `POST /auth/signup` | ✅ |
| 로그인 | `POST /auth/login` | ✅ |
| 토큰 갱신 | `POST /auth/refresh` | ✅ |
| 로그아웃 | `POST /auth/logout` | ✅ |
| 내 정보 | `GET /me` | ✅ |
| 설정 변경 | `PATCH /me/settings` | ✅ |
| 커리큘럼 목록 | `GET /curriculums` | ✅ |
| 레슨 목록 | `GET /curriculums/:id/lessons` | ✅ |
| 레슨 상세 | `GET /lessons/:id` | ✅ |
| 학습 제출 | `POST /learning/submit` | ✅ 포인트 적립 확인 |
| 학습 진도 | `GET /learning/progress` | ✅ 정답률·연속일 |
| 포인트 잔액 | `GET /points/balance` | ✅ |
| 사전 검색 | `GET /dictionary/search` | ✅ |
| 공유 링크 생성 | `POST /share` | ✅ |
| 공유 링크 조회 | `GET /share/:code` | ✅ |

### 3. 수정 사항
- `package.json`: `seed` 스크립트 추가

## 배포 URL
- **Web**: https://web-plum-kappa.vercel.app
- **API**: https://lingua-api-production-5130.up.railway.app

## Status: DONE ✓
