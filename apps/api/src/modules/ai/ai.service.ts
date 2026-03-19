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
    const today = new Date().toISOString().slice(0, 10);

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

    const prompt = this.buildPrompt(dto);
    const message = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text;
    const result = JSON.parse(raw) as {
      translations: Record<string, string>;
      explanation: string;
    };

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
  "translations": { ${dto.output.map((l) => `"${l}": "..."`).join(', ')} },
  "explanation": "Brief explanation in English: meaning, nuance, usage context, and any cultural notes. Max 2 sentences."
}`;
  }
}
