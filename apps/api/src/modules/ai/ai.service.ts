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
    const locale = dto.locale ?? 'en';
    const en = dto.inputText;
    const ko = entry?.ko ?? dto.cardKo;
    const ja = entry?.ja ?? dto.cardJa;
    const koReading = entry?.koReading ?? dto.cardKoReading;
    const jaReading = entry?.jaReading ?? dto.cardJaReading;
    const tags: string[] = entry?.tags ?? [];

    const isHanja    = tags.some(t => ['hanja', 'kanji', 'sino-korean', 'sino'].includes(t));
    const isLoanword = tags.some(t => ['loanword', 'foreign', 'dutch', 'portuguese', 'french'].includes(t));
    const isGreeting = tags.includes('greeting');
    const isFood     = tags.includes('food');
    const isEmotion  = tags.includes('emotion');

    if (locale === 'ko') return this.buildKo(en, ko, ja, koReading, jaReading, isHanja, isLoanword, isGreeting, isFood, isEmotion);
    if (locale === 'ja') return this.buildJa(en, ko, ja, koReading, jaReading, isHanja, isLoanword, isGreeting, isFood, isEmotion);
    return this.buildEn(en, ko, ja, koReading, jaReading, isHanja, isLoanword, isGreeting, isFood, isEmotion);
  }

  private formatHeader(en: string, ko: string | undefined, ja: string | undefined, koReading: string | undefined | null, jaReading: string | undefined | null, koLabel: string, jaLabel: string): string {
    const koStr = ko ? `${koLabel}: ${ko}${koReading ? ` (${koReading})` : ''}` : '';
    const jaStr = ja ? `${jaLabel}: ${ja}${jaReading ? ` (${jaReading})` : ''}` : '';
    const parts = [koStr, jaStr].filter(Boolean).join(', ');
    return parts ? `"${en}" → ${parts}.` : `"${en}"`;
  }

  private buildEn(en: string, ko: string | undefined, ja: string | undefined, koR: string | undefined | null, jaR: string | undefined | null, isHanja: boolean, isLoanword: boolean, isGreeting: boolean, isFood: boolean, isEmotion: boolean): string {
    if (!ko && !ja) return `"${en}" is a great word to compare across Korean and Japanese. Both languages often share vocabulary through Sino-Korean (한자어/漢字語) roots — learning one helps reinforce the other.`;
    const header = this.formatHeader(en, ko, ja, koR, jaR, 'Korean', 'Japanese');
    if (isHanja)    return `${header} This is a Sino-Korean/Kanji word — Korean ${ko} and Japanese ${ja} share the same Chinese character origin (한자어/漢字語), making it easier to learn both at once!`;
    if (isLoanword) return `${header} Both Korean and Japanese borrowed this word from the same foreign source, so the sounds are often strikingly similar across both languages.`;
    if (isGreeting) return `${header} Core greetings like this reflect the politeness systems (경어/敬語) both Korean and Japanese cultures deeply value.`;
    if (isFood)     return `${header} Food vocabulary reveals fascinating cultural overlap — many Korean and Japanese culinary terms share the same Chinese character roots.`;
    if (isEmotion)  return `${header} Emotion words are great for comparing how Korean and Japanese express feelings, often using the same Sino-Korean/Kanji base with different native nuances.`;
    return `${header} Comparing Korean ${ko} and Japanese ${ja} side-by-side reveals the deep linguistic ties between both languages — a powerful dual-learning shortcut!`;
  }

  private buildKo(en: string, ko: string | undefined, ja: string | undefined, koR: string | undefined | null, jaR: string | undefined | null, isHanja: boolean, isLoanword: boolean, isGreeting: boolean, isFood: boolean, isEmotion: boolean): string {
    if (!ko && !ja) return `"${en}"은(는) 한국어와 일본어를 비교해볼 수 있는 좋은 단어예요. 두 언어는 한자어(漢字語) 뿌리를 공유하는 경우가 많아, 하나를 배우면 다른 하나도 쉬워집니다.`;
    const header = this.formatHeader(en, ko, ja, koR, jaR, '한국어', '일본어');
    if (isHanja)    return `${header} 한국어 ${ko}와 일본어 ${ja}는 같은 한자어(漢字語) 뿌리를 공유합니다 — 두 언어를 한꺼번에 익힐 수 있는 좋은 기회예요!`;
    if (isLoanword) return `${header} 한국어와 일본어 모두 같은 외래어를 차용했기 때문에 발음이 서로 비슷한 경우가 많아요.`;
    if (isGreeting) return `${header} 이런 인사말은 한국어·일본어 모두에서 경어(경어/敬語) 문화의 핵심을 이룹니다.`;
    if (isFood)     return `${header} 음식 관련 어휘에는 한·일 두 나라의 문화적 공통점이 잘 녹아 있어요.`;
    if (isEmotion)  return `${header} 감정 표현 단어는 한자어 뿌리를 공유하는 경우가 많아, 한국어와 일본어의 깊은 연관성을 잘 보여줍니다.`;
    return `${header} 한국어 ${ko}와 일본어 ${ja}를 나란히 비교하면 두 언어의 깊은 연관성을 실감할 수 있어요!`;
  }

  private buildJa(en: string, ko: string | undefined, ja: string | undefined, koR: string | undefined | null, jaR: string | undefined | null, isHanja: boolean, isLoanword: boolean, isGreeting: boolean, isFood: boolean, isEmotion: boolean): string {
    if (!ko && !ja) return `「${en}」は韓国語と日本語を比較するのに最適な単語です。両言語は漢字語（漢字語）のルーツを共有することが多く、片方を学ぶともう片方も身につきやすくなります。`;
    const header = this.formatHeader(en, ko, ja, koR, jaR, '韓国語', '日本語');
    if (isHanja)    return `${header} 韓国語の${ko}と日本語の${ja}は同じ漢字語のルーツを持っています — 両言語を同時にマスターできる絶好のチャンスです！`;
    if (isLoanword) return `${header} 韓国語と日本語は同じ外来語を借用しているため、発音が似ていることがよくあります。`;
    if (isGreeting) return `${header} このような挨拶表現は、韓国語・日本語の敬語（경어/敬語）文化の核心を成しています。`;
    if (isFood)     return `${header} 食べ物に関する語彙には、韓日両国の文化的なつながりがよく表れています。`;
    if (isEmotion)  return `${header} 感情を表す言葉には漢字語のルーツを共有するものが多く、韓国語と日本語の深いつながりを示しています。`;
    return `${header} 韓国語の${ko}と日本語の${ja}を並べて比較すると、両言語の深いつながりが感じられます！`;
  }
}
