# [T-0031] AI Explain 사전 DB 기반 정적 설명으로 교체

## 날짜
2026-04-10

## Goal
Anthropic API 크레딧 소진으로 AI Explain 기능이 전면 503 에러 상태. Anthropic 의존성 제거 후 사전 DB + 태그 기반 설명 생성으로 교체하여 무중단 동작.

---

## 원인

- `ANTHROPIC_API_KEY`는 설정됐으나 계정 크레딧 잔액 0
- Anthropic API: `invalid_request_error: "Your credit balance is too low to access the Anthropic API"`
- 진단: debug 응답 노출 커밋 배포 후 실제 에러 메시지 확인

---

## 수정 내용

### 1. `apps/api/src/modules/ai/ai.service.ts`

Anthropic SDK 완전 제거 → `DictionaryEntry` 조회 + 태그 기반 설명 빌더로 교체:

- `translateExplain()`: DB에서 `en` 필드로 단어 조회, 태그(`hanja/loanword/greeting/food/emotion`)에 따라 문화적 설명 생성
- 일일 한도(DAILY_LIMIT 20) 제거 → `remainingToday: 999`
- `generateTip()`: 대시보드 이미 정적 팁(T-0028)이므로 빈 응답으로 정리

### 2. `apps/api/src/modules/ai/dto/translate.dto.ts`

카드 컨텍스트 옵셔널 필드 추가:

```typescript
@IsOptional() @IsString() cardKo?: string;
@IsOptional() @IsString() cardJa?: string;
@IsOptional() @IsString() cardKoReading?: string;
@IsOptional() @IsString() cardJaReading?: string;
```

사전에 없는 단어도 카드 데이터로 설명 생성 가능.

### 3. `apps/web/app/(app)/learn/[curriculumId]/[lessonId]/page.tsx`

```typescript
// Before
handleAiExplain(card.en)

// After
handleAiExplain(card)  // 카드 전체 데이터 전송
```

---

## 설명 생성 로직

| 태그 | 설명 |
|------|------|
| `hanja / kanji` | 한자어 공유 → 한국어·일본어 동시 학습 포인트 강조 |
| `loanword` | 동일 외래어 차용 → 발음 유사성 설명 |
| `greeting` | 경어/敬語 문화적 맥락 |
| `food` | 한·일 음식 문화 어휘 중복 설명 |
| `emotion` | 감정 표현 한자어 뿌리 설명 |
| 기타 | 한국어·일본어 병렬 학습 권장 |

---

## 배포

| 커밋 | 내용 |
|------|------|
| `3d64e3e` | debug: AI 에러 원인 임시 노출 |
| `fcae0ea` | feat: AI Explain 사전 DB 기반 정적 설명으로 교체 |
| `7ae4f4c` | docs: T-0030 문서 갱신 (이후 T-0031로 분리) |

---

## QA 검증

| 케이스 | 결과 |
|--------|------|
| 사전에 있는 단어 (`hello`) | `200` + 인사말 문화 설명 ✓ |
| 사전에 없는 단어 (`water`) | `200` + cardKo/cardJa 기반 설명 ✓ |
| HTTP 상태 | 200 (이전: 503) ✓ |
| 일일 한도 | 제거 (`remainingToday: 999`) ✓ |
| Anthropic 크레딧 의존 | 없음 ✓ |

---

## 추가 수정: 다국어 설명 출력 (2026-04-10)

UI 언어 설정이 한국어·일본어일 때도 설명이 영어로만 나오는 문제 수정.

- `TranslateDto`에 `locale?: 'en' | 'ko' | 'ja'` 추가
- `buildExplanation` → `buildEn / buildKo / buildJa` 3개 메서드로 분기
- 프론트엔드: `useLocaleStore().locale`을 API 요청에 포함
- **커밋**: `8e0a881`

### 검증 결과

| locale | 설명 언어 |
|--------|----------|
| `en` | `"hello" → Korean: 안녕하세요, Japanese: こんにちは. Core greetings...` ✓ |
| `ko` | `"hello" → 한국어: 안녕하세요, 일본어: こんにちは. 이런 인사말은...` ✓ |
| `ja` | `"hello" → 韓国語: 안녕하세요, 日本語: こんにちは. このような挨拶表現は...` ✓ |

---

## 추가 수정: 사전 페이지 다국어 설명 (2026-04-10)

레슨 페이지와 동일한 문제가 사전 검색 페이지(`/dictionary`)에도 존재.
AI 설명이 항상 영어로만 출력되는 문제 수정.

### `apps/web/app/(app)/dictionary/page.tsx`

- `import { useLocaleStore } from "@/store/locale"` 추가
- `const { locale } = useLocaleStore()` 추가
- `handleAiExplain(entryId, inputText, inputLang, output)` → `handleAiExplain(entry: DictionaryEntry)` 로 시그니처 변경
- API 요청에 `locale`, `cardKo`, `cardJa`, `cardKoReading`, `cardJaReading` 포함
- 버튼 `onClick`: `handleAiExplain(entry.id, ...)` → `handleAiExplain(entry)`
- **커밋**: `(다음 커밋)`

## Status: DONE ✓
