# [T-0024] i18n 다국어 지원 & 로고 홈 링크

## 날짜
2026-03-20

## Goal
전 세계 사용자를 위한 UI 다국어화 (기본값 EN), EN/KO/JA 실시간 언어 전환, 모든 페이지에서 로고 클릭 시 메인 페이지 이동

---

## 작업 내용

### 1. 새 파일 (3개)

| 파일 | 역할 |
|------|------|
| `apps/web/store/locale.ts` | Zustand persist 로케일 스토어 — 기본값 `"en"`, localStorage 저장 키 `lingua-locale` |
| `apps/web/lib/i18n.ts` | EN/KO/JA 전체 번역 딕셔너리 + `useT()` 훅 (`{var}` 보간 지원) |
| `apps/web/components/ui/LanguageSwitcher.tsx` | `EN \| 한 \| 日` 버튼 그룹 컴포넌트 (`compact` prop) |

### 2. i18n 아키텍처

- Zustand persist (Next.js i18n 라우팅 방식 사용 안 함 — App Router 구조 유지)
- `useT()` 훅이 현재 로케일의 딕셔너리에서 키 조회 → EN 폴백
- 보간: `t("key", { n: 5 })` → `"카드 {n}개"` → `"카드 5개"`
- 번역 키 접두어: `nav.`, `common.`, `landing.`, `auth.login.`, `auth.signup.`, `dash.`, `learn.`, `curriculum.`, `lesson.`, `dict.`, `points.`, `profile.`, `share.`
- 서버 컴포넌트 (`share/[code]`)는 정적 영어 사용 (훅 불가)

### 3. 수정 파일 (12개)

| 파일 | 변경 내용 |
|------|-----------|
| `app/(app)/layout.tsx` | 로고 `<Link href="/">` 래핑, `LanguageSwitcher compact` 사이드바 추가, 네비 레이블 `t()` 적용 |
| `app/page.tsx` (랜딩) | 모든 한국어 텍스트 `t()` 적용, 네비에 `LanguageSwitcher` 추가, 로고 홈 링크 |
| `app/(auth)/login/page.tsx` | 로고 `<Link href="/">`, 상단 `LanguageSwitcher`, 전체 텍스트 `t()` 적용 |
| `app/(auth)/signup/page.tsx` | 동일 |
| `app/(app)/dashboard/page.tsx` | `useT()` 전면 적용, 모드 레이블 번역 |
| `app/(app)/learn/page.tsx` | `useT()` 적용, 언어 배지 레이블 번역 |
| `app/(app)/learn/[curriculumId]/page.tsx` | `useT()` 적용 |
| `app/(app)/learn/[curriculumId]/[lessonId]/page.tsx` | `useT()` 적용, AI 에러 메시지 번역 |
| `app/(app)/dictionary/page.tsx` | `useT()` 적용, AI 에러 메시지 번역 |
| `app/(app)/points/page.tsx` | `useT()` 적용 |
| `app/(app)/profile/page.tsx` | `useT()` 적용 |
| `app/share/[code]/page.tsx` | 정적 한국어 텍스트 → 영어로 직접 변경 |

---

## 결과

- 기본 UI 언어: **English**
- 상단/사이드바 언어 스위처로 EN / 한국어 / 日本語 실시간 전환
- 선택한 언어 브라우저 세션 간 유지 (localStorage)
- 모든 페이지 좌측 상단 로고 클릭 → `/` 이동
- TypeScript 에러 0개
- 커밋: `9c23ca9` — GitHub 푸시 완료

---

### 4. 언어 스위처 우측 상단 고정 (추가 작업)

| 페이지 | 위치 |
|--------|------|
| 랜딩 페이지 | 네비 맨 우측 끝 |
| 로그인 / 회원가입 | `position: fixed` top-right (16px / 20px) |
| 앱 페이지 전체 | 상단 헤더 바(height 48px) 우측 고정, 사이드바에서 제거 |

앱 레이아웃 구조 변경:
- 기존: 사이드바 내부에 LanguageSwitcher
- 변경: `position: fixed` 상단 헤더 바 추가 → LanguageSwitcher 우측 상단 고정
- 사이드바는 `position: fixed` left=0, 헤더는 left=220(sidebar width)

---

## 관련 커밋

- `9c23ca9` feat: i18n 다국어 지원 — EN/KO/JA 언어 전환 + 로고 홈 링크
- `318fa66` feat: 언어 스위처 우측 상단 고정
- `a84b4a7` fix: Zustand locale hydration 이슈 수정 — skipHydration + LocaleProvider

### 5. Hydration 이슈 수정 (최종)

**문제**: Zustand persist가 SSR/클라이언트 간 locale 불일치를 일으켜 텍스트가 제대로 바뀌지 않음

**해결**:
- `locale.ts`: `skipHydration: true` 추가 → 서버 렌더 시 자동 hydration 차단
- `LocaleProvider.tsx` 신규 생성 → `useEffect`에서 `rehydrate()` 호출 (클라이언트 마운트 후)
- `layout.tsx` (루트): `<LocaleProvider>`로 전체 앱 래핑

**동작 방식**:
- 첫 렌더: 항상 **영어(EN)** (기본값)
- 마운트 후: localStorage에 저장된 언어가 있으면 자동 전환 (재방문 사용자 편의)

**배포**: Vercel production → https://web-plum-kappa.vercel.app
