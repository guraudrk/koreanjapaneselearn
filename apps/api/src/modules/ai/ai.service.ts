import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';
import { TranslateDto } from './dto/translate.dto';

const TIP_TOPICS = [
  'a shared Hanja/Kanji vocabulary word (show both Korean Hangul + Japanese Kana pronunciations and meaning)',
  'a false friend between Korean and Japanese — a word that looks or sounds similar but has different meanings',
  'a shared grammatical pattern or sentence structure that learners of both languages can exploit',
  'an interesting etymology connecting Korean and Japanese through Classical Chinese characters',
  'a cultural nuance encoded in language that both Korean and Japanese share (e.g. honorifics, counting words)',
  'a surprisingly similar Korean and Japanese word pair that comes from the same Chinese root',
  'a phonological similarity or sound-change pattern that links Korean and Japanese',
];

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
    let message: Awaited<ReturnType<typeof this.client.messages.create>>;
    try {
      message = await this.client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      });
    } catch {
      throw new HttpException(
        'AI translation service is temporarily unavailable. Please try again later.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const raw = (message.content[0] as { type: string; text: string }).text;
    let result: { translations: Record<string, string>; explanation: string };
    try {
      result = JSON.parse(raw) as { translations: Record<string, string>; explanation: string };
    } catch {
      throw new HttpException('AI response parsing failed. Please try again.', HttpStatus.SERVICE_UNAVAILABLE);
    }

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

  async generateTip(locale: string) {
    const langName =
      locale === 'ko' ? 'Korean (한국어)' :
      locale === 'ja' ? 'Japanese (日本語)' :
      'English';

    const topic = TIP_TOPICS[Math.floor(Math.random() * TIP_TOPICS.length)];

    const prompt = `You are a linguistics expert specializing in Korean and Japanese.
Generate ONE interesting, surprising linguistic fact about: ${topic}.

Rules:
- 2-3 sentences max
- Include actual Korean characters (한글) and Japanese characters (かな/漢字) with romanizations
- Make it genuinely educational and memorable
- Respond entirely in ${langName}
- Plain text only — no JSON, no markdown, no bullet points`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        temperature: 1,
        messages: [{ role: 'user', content: prompt }],
      });
      const tip = (message.content[0] as { type: string; text: string }).text.trim();
      return { tip };
    } catch {
      return { tip: null };
    }
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
