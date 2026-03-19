# Design: ai-translate

> Plan 참조: `docs/01-plan/features/ai-translate.plan.md`

---

## 1. 아키텍처 개요

```
Web (Next.js)                    API (NestJS)                  External
─────────────────                ────────────────────          ────────
DictionaryPage                   POST /ai/translate-explain
  └─ "AI 설명" 버튼  ──────────►  AiController
                                   └─ AiService
LearnPage (FlipCard)                  ├─ AiUsageCheck (DB)
  └─ "AI 설명" 버튼  ──────────►       ├─ Claude API 호출  ──► claude-haiku-4-5
                                       └─ 결과 반환
```

---

## 2. DB 스키마 변경

### 추가 모델: `AiUsage`

```prisma
// apps/api/prisma/schema.prisma 에 추가

model AiUsage {
  id        String   @id @default(cuid())
  userId    String
  date      String   // "2026-03-19" (UTC 기준)
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@map("ai_usage")
}
```

### User 모델 수정

```prisma
model User {
  // ... 기존 필드 ...
  aiUsages  AiUsage[]   // 추가
}
```

---

## 3. API 모듈 구조

```
apps/api/src/modules/ai/
├── dto/
│   └── translate.dto.ts
├── ai.service.ts
├── ai.controller.ts
└── ai.module.ts
```

### 3-1. `translate.dto.ts`

```typescript
import { IsArray, IsIn, IsString, MinLength } from 'class-validator';

export class TranslateDto {
  @IsString()
  @MinLength(1)
  inputText: string;

  @IsIn(['en', 'ko', 'ja'])
  inputLang: 'en' | 'ko' | 'ja';

  @IsArray()
  @IsIn(['en', 'ko', 'ja'], { each: true })
  output: ('en' | 'ko' | 'ja')[];
}
```

### 3-2. `ai.service.ts`

```typescript
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';
import { TranslateDto } from './dto/translate.dto';

const DAILY_LIMIT = 20;

@Injectable()
export class AiService {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  constructor(private readonly prisma: PrismaService) {}

  async translateExplain(userId: string, dto: TranslateDto) {
    // 1. 사용량 확인
    const today = new Date().toISOString().slice(0, 10); // "2026-03-19"
    const usage = await this.prisma.aiUsage.upsert({
      where: { userId_date: { userId, date: today } },
      update: {},
      create: { userId, date: today, count: 0 },
    });

    if (usage.count >= DAILY_LIMIT) {
      throw new HttpException(
        `Daily AI usage limit reached (${DAILY_LIMIT}/${DAILY_LIMIT}). Try again tomorrow.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Claude 호출
    const prompt = this.buildPrompt(dto);
    const message = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text;
    const result = JSON.parse(raw);

    // 3. 사용량 증가
    const updated = await this.prisma.aiUsage.update({
      where: { userId_date: { userId, date: today } },
      data: { count: { increment: 1 } },
    });

    return {
      inputText: dto.inputText,
      translations: result.translations,
      explanation: result.explanation,
      usage: {
        usedToday: updated.count,
        remainingToday: DAILY_LIMIT - updated.count,
      },
    };
  }

  private buildPrompt(dto: TranslateDto): string {
    return `Translate and explain the following text.
Input (${dto.inputLang}): "${dto.inputText}"
Output languages needed: ${dto.output.join(', ')}

Respond ONLY with valid JSON in this exact format:
{
  "translations": { ${dto.output.map(l => `"${l}": "..."`).join(', ')} },
  "explanation": "Brief explanation in English: meaning, nuance, usage context, and any cultural notes. Max 2 sentences."
}`;
  }
}
```

### 3-3. `ai.controller.ts`

```typescript
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { TranslateDto } from './dto/translate.dto';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('translate-explain')
  translate(@Req() req: AuthRequest, @Body() dto: TranslateDto) {
    return this.aiService.translateExplain(req.user.id, dto);
  }
}
```

### 3-4. `ai.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
```

---

## 4. app.module.ts 변경

```typescript
// 추가
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // ... 기존 ...
    AiModule,   // 추가
  ],
})
export class AppModule {}
```

---

## 5. Web UI 변경

### 5-1. 사전 페이지 (`dictionary/page.tsx`)

각 검색 결과 카드 하단에 "AI 설명" 버튼 추가:

```tsx
// 상태 추가
const [aiResult, setAiResult] = useState<Record<string, AiResult | null>>({});
const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

// AiResult 타입
interface AiResult {
  translations: Record<string, string>;
  explanation: string;
  usage: { usedToday: number; remainingToday: number };
}

// 각 entry 카드 하단에 추가
<button onClick={() => handleAiExplain(entry.en, 'en', ['ko', 'ja'])}>
  AI 설명
</button>
{aiResult[entry.id] && (
  <div className="glass" style={{ marginTop: 12, padding: 14 }}>
    <p>{aiResult[entry.id]?.explanation}</p>
    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
      오늘 남은 횟수: {aiResult[entry.id]?.usage.remainingToday}회
    </p>
  </div>
)}
```

### 5-2. 학습 카드 페이지 (`learn/[curriculumId]/[lessonId]/page.tsx`)

플립카드 뒷면 하단에 "AI 설명" 버튼 추가:

```tsx
// 카드 뒷면 하단
{flipped && (
  <button onClick={() => handleAiExplain(cards[idx].en, 'en', ['ko', 'ja'])}>
    AI 설명 보기
  </button>
)}
```

---

## 6. 환경변수

### Railway (lingua-api 서비스)
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 7. 구현 순서 (Do Phase 체크리스트)

- [ ] `ANTHROPIC_API_KEY` Railway 환경변수 추가
- [ ] `npm install @anthropic-ai/sdk` (apps/api)
- [ ] `schema.prisma` — AiUsage 모델 추가 + User 관계 추가
- [ ] `prisma db push` (Railway DB)
- [ ] `ai/dto/translate.dto.ts` 생성
- [ ] `ai/ai.service.ts` 생성
- [ ] `ai/ai.controller.ts` 생성
- [ ] `ai/ai.module.ts` 생성
- [ ] `app.module.ts` — AiModule 등록
- [ ] `apps/web` — dictionary/page.tsx AI 버튼 추가
- [ ] `apps/web` — learn 페이지 AI 버튼 추가
- [ ] 빌드 검증 + Railway 배포
- [ ] 엔드포인트 curl 테스트

---

## 8. 완료 기준

| 항목 | 기준 |
|------|------|
| API 응답 | `POST /ai/translate-explain` → 200 + JSON |
| 한도 초과 | 20회 초과 → 429 응답 |
| 웹 사전 | "AI 설명" 버튼 클릭 → 설명 카드 표시 |
| 웹 학습 | 플립카드 뒷면에서 "AI 설명 보기" 동작 |
| 빌드 | TypeScript 0 errors |
