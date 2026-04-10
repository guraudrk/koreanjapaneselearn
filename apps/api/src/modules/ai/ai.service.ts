import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TranslateDto } from './dto/translate.dto';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async translateExplain(userId: string, dto: TranslateDto) {
    // Look up dictionary entry for rich explanation
    const entry = await this.prisma.dictionaryEntry.findFirst({
      where: { en: { equals: dto.inputText, mode: 'insensitive' } },
    });

    const translations: Record<string, string> = {};
    for (const lang of dto.output) {
      if (lang === 'ko') translations['ko'] = entry?.ko ?? dto.cardKo ?? '';
      if (lang === 'ja') translations['ja'] = entry?.ja ?? dto.cardJa ?? '';
    }

    const explanation = this.buildExplanation(entry, dto);

    // Usage tracking (preserved for future AI reactivation)
    const today = new Date().toISOString().slice(0, 10);
    const updated = await this.prisma.aiUsage.upsert({
      where: { userId_date: { userId, date: today } },
      update: { count: { increment: 1 } },
      create: { userId, date: today, count: 1 },
    });

    return {
      inputText: dto.inputText,
      translations,
      explanation,
      usage: { usedToday: updated.count, remainingToday: 999 },
    };
  }

  async generateTip(locale: string) {
    // Dashboard tip replaced by static tips (T-0028). Kept for API compatibility.
    void locale;
    return { tip: null };
  }

  private buildExplanation(
    entry: { ko: string; ja: string; koReading: string | null; jaReading: string | null; tags: string[] } | null,
    dto: TranslateDto,
  ): string {
    const en = dto.inputText;
    const ko = entry?.ko ?? dto.cardKo;
    const ja = entry?.ja ?? dto.cardJa;
    const koReading = entry?.koReading ?? dto.cardKoReading;
    const jaReading = entry?.jaReading ?? dto.cardJaReading;
    const tags: string[] = entry?.tags ?? [];

    if (!ko && !ja) {
      return `"${en}" is a great word to compare across Korean and Japanese. Both languages often share vocabulary through Sino-Korean (한자어/漢字語) roots — learning one helps reinforce the other.`;
    }

    // Core translation line
    const parts: string[] = [];
    if (koReading && jaReading) {
      parts.push(`"${en}" → Korean: ${ko} (${koReading}), Japanese: ${ja} (${jaReading}).`);
    } else if (koReading) {
      parts.push(`"${en}" → Korean: ${ko} (${koReading}), Japanese: ${ja}.`);
    } else if (jaReading) {
      parts.push(`"${en}" → Korean: ${ko}, Japanese: ${ja} (${jaReading}).`);
    } else {
      parts.push(`"${en}" → Korean: ${ko}, Japanese: ${ja}.`);
    }

    // Cultural/linguistic note based on tags
    const isHanja = tags.some(t => ['hanja', 'kanji', 'sino-korean', 'sino'].includes(t));
    const isLoanword = tags.some(t => ['loanword', 'foreign', 'dutch', 'portuguese', 'french'].includes(t));
    const isGreeting = tags.includes('greeting');
    const isFood = tags.includes('food');
    const isEmotion = tags.includes('emotion');

    if (isHanja) {
      parts.push(`This is a Sino-Korean/Kanji word — Korean ${ko} and Japanese ${ja} share the same Chinese character origin (한자어/漢字語), making it easier to learn both at once!`);
    } else if (isLoanword) {
      parts.push(`Both Korean and Japanese borrowed this word from the same foreign source, so the sounds are often strikingly similar across both languages.`);
    } else if (isGreeting) {
      parts.push(`Core greetings like this reflect the politeness systems (경어/敬語) both Korean and Japanese cultures deeply value.`);
    } else if (isFood) {
      parts.push(`Food vocabulary reveals fascinating cultural overlap — many Korean and Japanese culinary terms share the same Chinese character roots.`);
    } else if (isEmotion) {
      parts.push(`Emotion words are great for comparing how Korean and Japanese express feelings, often using the same Sino-Korean/Kanji base with different native nuances.`);
    } else {
      parts.push(`Comparing Korean ${ko} and Japanese ${ja} side-by-side reveals the deep linguistic ties between both languages — a powerful dual-learning shortcut!`);
    }

    return parts.join(' ');
  }
}
