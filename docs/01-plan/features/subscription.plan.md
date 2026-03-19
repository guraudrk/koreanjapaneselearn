# Plan: subscription

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 현재 AI 설명 기능이 일일 20회 무료 한도로 제한되어 있고, 유료 전환 경로가 없어 수익화가 불가능한 상태 |
| **Solution** | 월정액 구독 티어(Pro) 도입 — 무제한 AI 설명, 고급 학습 통계, 우선 지원 제공; Stripe 결제 연동 |
| **Function & UX Effect** | 프리미엄 유저는 AI 설명 제한 없이 사용 가능, 구독 페이지에서 플랜 비교 및 결제 가능 |
| **Core Value** | 서비스 수익화 실현; 무료 한도 노출로 유료 전환 유인, 지속 가능한 SaaS 비즈니스 모델 구축 |

---

## 1. 배경 및 목표

### 문제 정의
- AI 설명 일일 20회 한도 → 헤비 유저 불만
- 수익 모델 없음 → 서버/AI 비용 부담 지속
- 유료 전환 유인 존재(한도 초과 메시지)하지만 업그레이드 경로 없음

### 목표
- **Free 티어**: 일일 AI 설명 20회 (현재 유지)
- **Pro 티어**: 월 $9.99, AI 설명 무제한, 학습 분석 리포트
- Stripe Checkout 결제 연동
- 구독 상태를 DB에 저장 + API에서 티어별 한도 적용

---

## 2. 기능 범위 (MVP)

### In Scope
- `Subscription` DB 모델 (userId, plan, status, stripeCustomerId, currentPeriodEnd)
- Stripe Checkout 세션 생성 API (`POST /subscription/checkout`)
- Stripe Webhook 처리 (`POST /subscription/webhook`) — 결제 성공/실패/갱신
- 구독 상태 조회 API (`GET /subscription/status`)
- `AiService` — Pro 유저 한도 무제한 적용
- 웹: 구독 페이지 (`/subscription`) — 플랜 비교 + Checkout 버튼
- 웹: 프로필 페이지 — 현재 플랜 표시

### Out of Scope (Post-MVP)
- 연간 구독 할인
- 팀/그룹 플랜
- Stripe Customer Portal (직접 관리 페이지)
- 환불 자동화

---

## 3. 기술 결정

| 항목 | 결정 | 이유 |
|------|------|------|
| 결제 | Stripe Checkout | 빠른 통합, PCI 준수, 웹훅 지원 |
| 구독 상태 | DB `subscriptions` 테이블 | 재시작 후에도 유지, Webhook 이벤트 기록 |
| 한도 적용 | `AiService` 내 tier 체크 | Pro이면 DAILY_LIMIT 우회 |
| 웹훅 보안 | Stripe 서명 검증 | `stripe.webhooks.constructEvent()` |
| 구독 페이지 | 신규 `/subscription` 라우트 | 기존 페이지 영향 없음 |

---

## 4. DB 스키마

```prisma
model Subscription {
  id                String   @id @default(cuid())
  userId            String   @unique
  plan              String   @default("free") // "free" | "pro"
  status            String   @default("inactive") // "active" | "inactive" | "canceled"
  stripeCustomerId  String?
  stripePriceId     String?
  currentPeriodEnd  DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}
```

---

## 5. API 명세

### `POST /subscription/checkout`
```json
// Request (JWT 필요)
{ "priceId": "price_stripe_pro_monthly" }
// Response 200
{ "url": "https://checkout.stripe.com/..." }
```

### `GET /subscription/status`
```json
// Response 200
{ "plan": "pro", "status": "active", "currentPeriodEnd": "2026-04-19T00:00:00Z" }
```

### `POST /subscription/webhook` (Stripe → API, 공개)
- `checkout.session.completed` → status = "active"
- `invoice.payment_failed` → status = "inactive"
- `customer.subscription.deleted` → status = "canceled"

---

## 6. 구현 순서

1. `stripe` 패키지 설치 (`npm install stripe`)
2. `schema.prisma` — Subscription 모델 추가 + User 관계
3. `apps/api/src/modules/subscription/` 모듈 4개 파일
4. `AiService` — Pro 유저 한도 무제한 처리
5. `app.module.ts` — SubscriptionModule 등록
6. Railway 환경변수: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`
7. 웹: `apps/web/app/(app)/subscription/page.tsx` 생성
8. 웹: 프로필 페이지에 현재 플랜 표시

---

## 7. 플랜 비교 (웹 UI)

| 기능 | Free | Pro ($9.99/월) |
|------|------|----------------|
| AI 설명 | 20회/일 | 무제한 |
| 사전 검색 | ✅ | ✅ |
| 학습 카드 | ✅ | ✅ |
| 포인트 시스템 | ✅ | ✅ |
| 학습 분석 | 기본 | 상세 |
| 우선 지원 | ❌ | ✅ |

---

## 8. 완료 기준

- [ ] Stripe Checkout 세션 생성 → 결제 페이지 이동
- [ ] Webhook 처리 → DB subscription 상태 업데이트
- [ ] Pro 유저 AI 설명 무제한 사용 가능
- [ ] Free 유저 20회 한도 유지
- [ ] 구독 페이지 UI — 플랜 비교 카드 표시
- [ ] TypeScript 0 errors
