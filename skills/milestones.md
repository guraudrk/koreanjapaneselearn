# Milestones & Roadmap

## MVP 목표 (우선순위 고정)

| # | 기능 | 설명 |
|---|------|------|
| 1 | 회원가입/로그인 | JWT 기반 인증 |
| 2 | 학습 모드 선택 | 한국어만 / 일본어만 / 동시 학습 |
| 3 | 단계별 커리큘럼 | 기초~중급 + 학습 카드/퀴즈 |
| 4 | 백과사전 검색 | 영어 입력 → KR/JP 뜻 + 예문 |
| 5 | 포인트 적립 + 공유 | 포인트 원장 + 링크/이미지 공유 |
| 6 | AI 텍스트 번역/설명 | 내 언어 → KR/JP + 간단 설명 (일일 20회 제한) |

---

## Milestone 0 — 개발 환경/기반

**목표**: 로컬 개발 환경 완전 세팅

**작업 내용**:
- 모노레포 세팅 (apps/, packages/)
- lint/format (ESLint, Prettier)
- CI 기초 (GitHub Actions)
- DB (PostgreSQL) + Prisma 마이그레이션
- 기본 도메인 모듈 골격 (auth/users)

**완료 기준**:
- [ ] 로컬에서 web/api/mobile 모두 기동
- [ ] DB 마이그레이션/seed 동작

**관련 태스크**: T-0001 (Monorepo Setup), T-0002 (GitHub Integration)

---

## Milestone 1 — 인증/설정/학습 모드

**작업 내용**:
- signup / login / refresh / logout API
- 학습 모드 스위치 (KR/JP/BOTH) UI + API
- 기본 대시보드 (오늘 학습 / 진도 요약)

**완료 기준**:
- [ ] 로그인 후 학습 모드 변경이 DB에 저장되고 UI에 반영

---

## Milestone 2 — 커리큘럼/카드/진도

**작업 내용**:
- 커리큘럼/레슨/카드 API
- 퀴즈 제출/채점/진도 저장
- 포인트 적립 (원장 기반)

**완료 기준**:
- [ ] 레슨 1개를 끝까지 완료하면 진도/포인트가 누적됨

---

## Milestone 3 — 백과사전

**작업 내용**:
- 영어 검색 → KR/JP 뜻 + 예문 반환 API
- 검색 UX (자동완성은 옵션)
- 관리자용 seed (초기 데이터 주입)

**완료 기준**:
- [ ] `dictionary/search`로 최소 N개 엔트리 검색 가능

---

## Milestone 4 — AI (텍스트) + 일일 제한

**작업 내용**:
- `ai-core` Provider 추상화 (Gemini/Claude/Mock)
- 번역 + 간단 설명 (기본 레벨)
- 무료 티어 일일 제한 (20회/일), 초과 시 안내

**완료 기준**:
- [ ] AI 호출 로그/카운트가 `ai_usage`로 집계
- [ ] 제한이 정확히 동작

**AI Provider 구현 순서**:
1. `packages/ai-core/`에 Provider 인터페이스 정의
2. Mock Provider 먼저 구현 (테스트 가능)
3. Gemini Provider 구현
4. Claude Provider 구현
5. `ai_usage` 집계/일일 제한 적용 (서버 사이드)
6. 캐싱 적용 (동일 입력/옵션)
7. 비용/한도/실패 대응 문서화

---

## Milestone 5 — 공유/성장 루프

**작업 내용**:
- 학습 성과/카드 공유 링크 생성
- OG 이미지/메타 (웹)
- 포인트 공유 화면

**완료 기준**:
- [ ] 공유 링크 열면 카드/성과를 누구나 볼 수 있음
- [ ] 앱 설치 유도 가능

---

## Post-MVP 로드맵 (추천 순서)

1. **심층 설명 AI** — "왜 이렇게 번역되는지", 존댓말/문화 맥락 강화
2. **STT (다국어 음성 인식)** — 음성 업로드 → transcript → KR/JP 변환
3. **구독 티어/결제** — 무료(일일 제한) vs 유료(상향/고성능/한도 완화)
4. **사진 스타일 변환** — 이미지 업로드/변환/갤러리/공유

---

## Definition of Done (DoD) — "완료"의 정의

태스크는 아래를 **모두** 만족해야 DONE:

- [ ] PRD/구현계획의 해당 요구를 충족
- [ ] 검증(테스트 또는 구체적 수동 시나리오) 수행
- [ ] 회귀 위험이 있으면 최소한의 회귀 체크 추가
- [ ] `progress/PROGRESS.md`에 "무엇이 끝났고 다음은 무엇인지" 기록
- [ ] 관련 문서 업데이트 (API/DECISIONS 등)
- [ ] 변경이 의사결정 수준이면 `progress/CHANGELOG.md`에 이유 기록
- [ ] **GitHub Push**: 모든 변경사항을 원격 저장소에 푸쉬 (`git push`)

---

## Output Contract (산출물 위치)

| 산출물 | 저장 위치 |
|--------|-----------|
| 태스크 문서 (Status/변경요약/검증결과) | `docs/tasks/T-XXXX-*.md` |
| 의사결정 변경 | `docs/DECISIONS.md` 또는 `progress/CHANGELOG.md` |
| API 변경 | `docs/API.md` |
| 진행/다음 액션 | `progress/PROGRESS.md` |
| 막힌 기록/해결 | `progress/FAILURES.md` |
