# [T-0025] AI 대시보드 오늘의 Tip — 동적 생성

## 날짜
2026-03-21

## Goal
대시보드 "DID YOU KNOW?" 섹션을 하드코딩된 텍스트에서 Claude Haiku가 매번 다른 한/일 언어학 지식을 생성하는 AI 동적 컨텐츠로 교체

---

## 작업 내용

### 1. Backend — GET /ai/tip 엔드포인트 추가

#### ai.service.ts
- `TIP_TOPICS` 배열 (7가지 토픽) 정의:
  - 한/일 공통 한자어 (발음·의미 포함)
  - 한/일 false friend (비슷해 보이지만 다른 의미)
  - 공통 문법 패턴
  - 한자 어원
  - 경어/조수사 등 문화적 뉘앙스
  - 동일 한자 기원 단어쌍
  - 음운 유사성
- `generateTip(locale: string)` 메서드 추가:
  - `Math.random()`으로 토픽 랜덤 선택
  - `temperature: 1` → 매번 다른 결과
  - 응답 언어를 locale 파라미터로 제어 (en/ko/ja)
  - 에러 시 `{ tip: null }` 반환 (graceful fallback)
  - `max_tokens: 256` (짧은 팁이므로 비용 최소화)

#### ai.controller.ts
- `GET /ai/tip?locale=en` 엔드포인트 추가
- JWT 인증 적용 (기존 `@UseGuards(JwtAuthGuard)` 상속)
- `@Query('locale')` 파라미터 수신, 기본값 `'en'`

### 2. Frontend — Dashboard Tip Card 업데이트

#### dashboard/page.tsx
- `useLocaleStore` import 추가
- `tip: string | null`, `tipLoading: boolean` 상태 추가
- `useEffect([locale])`: locale 변경 시마다 `/ai/tip?locale={locale}` 호출
  - locale이 바뀌면 자동으로 해당 언어로 새 팁 요청
- Tip Card UI:
  - 로딩 중: `"✨ AI generating..."` 표시
  - 성공: AI 생성 팁 텍스트 표시
  - 실패/null: 기존 정적 텍스트 폴백
  - **↺ 새로고침 버튼**: 클릭 시 즉시 새 팁 요청

---

## 동작 방식

```
대시보드 진입
  │
  ▼
GET /ai/tip?locale=en ──► Claude Haiku (temperature=1, random topic)
  │
  ▼
{ tip: "Korean 준비(準備) and Japanese じゅんび share the same..." }
  │
  ▼
DID YOU KNOW? 카드에 표시

[↺] 클릭 → 새 tip 요청 (다른 토픽으로 다른 내용)
언어 전환(EN→KO) → 한국어로 새 tip 자동 요청
```

---

## 결과

- 대시보드 진입 시마다 새로운 한/일 언어학 지식 표시
- 언어 전환 시 해당 언어로 팁이 자동 재생성
- ↺ 버튼으로 즉시 새 팁 요청 가능
- API 미연결 시 기존 정적 텍스트로 graceful fallback
- TypeScript 에러 0개

---

## 관련 파일

| 파일 | 변경 유형 |
|------|-----------|
| `apps/api/src/modules/ai/ai.service.ts` | `generateTip()` 메서드 추가 |
| `apps/api/src/modules/ai/ai.controller.ts` | `GET /ai/tip` 엔드포인트 추가 |
| `apps/web/app/(app)/dashboard/page.tsx` | AI tip 상태·UI 업데이트 |
