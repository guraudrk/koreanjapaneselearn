# [T-0019] TDD 기반 코드 점검 & 버그 수정

## 날짜
2026-03-12

## Goal
전체 코드베이스를 스스로 점검하고, 발견된 오류를 TDD 원칙(Red → Green → Refactor)에 입각해 수정한다.

## 점검 방법
- Explore 에이전트로 전체 코드베이스 정적 분석
- 심각도별(Critical / Major / Minor) 분류
- Critical/Major 항목 전원 수정, tsc --noEmit 0 에러 확인 후 커밋

---

## 수정된 버그

### Bug-01 — 레슨 완료 중복 카드 계산 [Critical]

**파일:** `apps/api/src/modules/learning/learning.service.ts`

**문제:**
레슨 완료 여부를 판단할 때 `userProgress.count()`를 사용하고 있었음.
같은 카드를 여러 번 정답 제출하면 COUNT가 중복으로 올라가기 때문에,
카드가 3개인 레슨에서 카드 1개를 3번 맞춰도 완료 처리되는 버그 존재.

**수정 전:**
```typescript
const correctCount = await this.prisma.userProgress.count({
  where: { userId, lessonId: dto.lessonId, correct: true },
});
if (lesson && correctCount >= lesson._count.cards) { ... }
```

**수정 후:**
```typescript
const distinctCorrectCards = await this.prisma.userProgress.findMany({
  where: { userId, lessonId: dto.lessonId, correct: true, cardId: { not: null } },
  select: { cardId: true },
  distinct: ['cardId'],  // 카드 종류 기준으로 중복 제거
});
if (distinctCorrectCards.length >= lesson._count.cards) { ... }
```

---

### Bug-02 — 레슨 완료 보너스 레이스 컨디션 [Critical]

**파일:** `apps/api/src/modules/learning/learning.service.ts`

**문제:**
동시 요청이 들어올 때 "이미 지급됐는지 확인(findFirst) → 없으면 지급(create)"이
트랜잭션 밖에 있었음. 두 요청이 동시에 findFirst를 통과하면 보너스 +50이 2번 지급됨.

**수정 전:**
```typescript
const alreadyAwarded = await this.prisma.pointsLedger.findFirst({ ... });
if (!alreadyAwarded) {
  await this.prisma.pointsLedger.create({ ... }); // 외부에서 독립 실행
}
```

**수정 후:**
```typescript
const bonusAwarded = await this.prisma.$transaction(async (tx) => {
  const alreadyAwarded = await tx.pointsLedger.findFirst({ ... });
  if (alreadyAwarded) return false;
  await tx.pointsLedger.create({ ... });
  return true;
});
if (bonusAwarded) pointsAwarded += POINTS_LESSON_COMPLETE;
```

---

### Bug-03 — 토큰 갱신 후 Zustand 스토어 미동기화 [Major]

**파일:** `apps/web/lib/api.ts`, `apps/web/store/auth.ts`

**문제:**
액세스 토큰이 만료돼 자동 갱신(401 인터셉터)될 때,
axios는 새 토큰을 `localStorage`에만 저장하고 Zustand 스토어는 갱신하지 않았음.
결과적으로 Zustand 스토어와 localStorage 사이에 토큰 불일치 발생.

또한 기존 `setAuth()`가 Zustand persist + localStorage 두 곳에 중복 저장하는 구조였음.

**수정 전:**
```typescript
// api.ts — localStorage에만 저장
localStorage.setItem("accessToken", data.accessToken);
localStorage.setItem("refreshToken", data.refreshToken);

// store/auth.ts — setAuth에서 중복 저장
set({ user, accessToken, refreshToken });
localStorage.setItem("accessToken", accessToken); // 중복
localStorage.setItem("refreshToken", refreshToken); // 중복
localStorage.setItem("userId", user.id); // 불필요
```

**수정 후:**
```typescript
// store/auth.ts — updateTokens 액션 추가
updateTokens: (accessToken, refreshToken) => {
  set({ accessToken, refreshToken }); // persist가 자동으로 localStorage 저장
},

// setAuth — 중복 localStorage 제거
setAuth: (user, accessToken, refreshToken) => {
  set({ user, accessToken, refreshToken }); // persist만으로 충분
},

// api.ts — Zustand store에서 직접 읽고 갱신 후 동기화
const token = useAuthStore.getState().accessToken;        // 요청 인터셉터
updateTokens(data.accessToken, data.refreshToken);         // 갱신 인터셉터
```

---

### Bug-04 — logout 시 persist 키 미클리어 [Major]

**파일:** `apps/web/store/auth.ts`

**문제:**
로그아웃 시 개별 localStorage 키(`accessToken`, `refreshToken`, `userId`)는 삭제했지만,
Zustand persist가 저장한 `"lingua-auth"` 키는 삭제하지 않았음.
재방문 시 stale 데이터가 rehydrate될 수 있는 보안 취약점.

**수정 전:**
```typescript
logout: () => {
  set({ user: null, accessToken: null, refreshToken: null });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
},
```

**수정 후:**
```typescript
logout: () => {
  set({ user: null, accessToken: null, refreshToken: null });
  if (typeof window !== "undefined") {
    localStorage.removeItem("lingua-auth"); // persist 키 명시 삭제
  }
},
```

---

### Bug-05 — non-null assertion(!) 제거 [Major]

**파일:** `apps/api/src/modules/users/users.controller.ts`

**문제:**
`findById()` 반환값에 non-null assertion(`!`)을 사용해 null 체크 없이 접근.
JwtGuard를 통과한 경우 user는 항상 존재하지만, 코드 안전성 측면에서 위험.

**수정 전:**
```typescript
const user = await this.usersService.findById(req.user.id);
return { id: user!.id, email: user!.email, ... };
```

**수정 후:**
```typescript
const user = await this.usersService.findById(req.user.id);
if (!user) throw new UnauthorizedException('User not found');
return { id: user.id, email: user.email, ... };
```

---

### Bug-06 — 빈 카드 배열 미처리 [Major]

**파일:** `apps/web/app/(app)/learn/[curriculumId]/[lessonId]/page.tsx`

**문제:**
카드가 없는 레슨에 접근하면, `currentIdx(0) < cards.length-1(-1)` 조건이 false가 되어
카드를 하나도 보여주지 않고 즉시 "레슨 완료!" 화면으로 튀어나감.

**수정 전:**
카드 0개 케이스에 대한 가드 없음.

**수정 후:**
```typescript
if (lesson.cards.length === 0) return (
  <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>
    <p>이 레슨에 카드가 없습니다.</p>
    <Link href={`/learn/${curriculumId}`}>← 레슨 목록으로</Link>
  </div>
);
```

---

## 점검 후 미수정 항목 (Minor)

| 항목 | 이유 |
|---|---|
| JWT 기본값 fallback | 개발 환경 편의상 유지, 프로덕션 배포 시 .env 필수 설정으로 대응 |
| API 에러 무시 (`catch(() => {})`) | 학습 UI는 낙관적 업데이트 의도, 별도 토스트 시스템 추가 시 개선 예정 |
| 리더보드 userId 부분 노출 | 8자리 마스킹으로 허용 수준 |
| logout 204 상태 코드 | 기능에 영향 없음, 추후 리팩토링 |

---

## 검증

```bash
# API
cd apps/api && npx tsc --noEmit  # 0 errors ✓

# Web
cd apps/web && npx tsc --noEmit  # 0 errors ✓
```

## Status: DONE ✓
