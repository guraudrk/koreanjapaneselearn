import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedDictionaryIfEmpty();
  }

  private async seedDictionaryIfEmpty() {
    const count = await this.dictionaryEntry.count();
    if (count > 0) return;

    await this.dictionaryEntry.createMany({
      skipDuplicates: true,
      data: [
        { en: 'hello', ko: '안녕하세요', ja: 'こんにちは', koReading: 'annyeonghaseyo', jaReading: 'konnichiwa', tags: ['greeting', 'basic'], examples: [{ en: 'Hello, how are you?', ko: '안녕하세요, 잘 지내세요?', ja: 'こんにちは、お元気ですか？' }] },
        { en: 'goodbye', ko: '안녕히 가세요', ja: 'さようなら', koReading: 'annyeonghi gaseyo', jaReading: 'sayounara', tags: ['greeting', 'basic'] },
        { en: 'thank you', ko: '감사합니다', ja: 'ありがとうございます', koReading: 'gamsahamnida', jaReading: 'arigatougozaimasu', tags: ['greeting', 'basic'] },
        { en: 'sorry', ko: '죄송합니다', ja: 'すみません', koReading: 'joesonghamnida', jaReading: 'sumimasen', tags: ['greeting', 'basic'] },
        { en: 'yes', ko: '네', ja: 'はい', koReading: 'ne', jaReading: 'hai', tags: ['basic'] },
        { en: 'no', ko: '아니요', ja: 'いいえ', koReading: 'aniyo', jaReading: 'iie', tags: ['basic'] },
        { en: 'please', ko: '부탁합니다', ja: 'お願いします', koReading: 'butakhamnida', jaReading: 'onegaishimasu', tags: ['basic', 'polite'] },
        { en: 'love', ko: '사랑', ja: '愛', koReading: 'sarang', jaReading: 'ai', tags: ['emotion'] },
        { en: 'happy', ko: '행복한', ja: '幸せな', koReading: 'haengbokhan', jaReading: 'shiawasena', tags: ['emotion', 'adjective'] },
        { en: 'sad', ko: '슬픈', ja: '悲しい', koReading: 'seulpeun', jaReading: 'kanashii', tags: ['emotion', 'adjective'] },
        { en: 'tired', ko: '피곤한', ja: '疲れた', koReading: 'pigonhan', jaReading: 'tsukareta', tags: ['emotion', 'adjective'] },
        { en: 'food', ko: '음식', ja: '食べ物', koReading: 'eumsik', jaReading: 'tabemono', tags: ['food', 'daily'] },
        { en: 'water', ko: '물', ja: '水', koReading: 'mul', jaReading: 'mizu', tags: ['food', 'daily'] },
        { en: 'rice', ko: '밥', ja: 'ご飯', koReading: 'bap', jaReading: 'gohan', tags: ['food', 'daily'] },
        { en: 'coffee', ko: '커피', ja: 'コーヒー', koReading: 'keopi', jaReading: 'koohii', tags: ['food', 'drink', 'loanword'] },
        { en: 'bread', ko: '빵', ja: 'パン', koReading: 'ppang', jaReading: 'pan', tags: ['food', 'loanword'] },
        { en: 'meat', ko: '고기', ja: '肉', koReading: 'gogi', jaReading: 'niku', tags: ['food'] },
        { en: 'fish', ko: '생선', ja: '魚', koReading: 'saengseon', jaReading: 'sakana', tags: ['food'] },
        { en: 'kimchi', ko: '김치', ja: 'キムチ', koReading: 'gimchi', jaReading: 'kimuchi', tags: ['food', 'korean'] },
        { en: 'sky', ko: '하늘', ja: '空', koReading: 'haneul', jaReading: 'sora', tags: ['nature'] },
        { en: 'mountain', ko: '산', ja: '山', koReading: 'san', jaReading: 'yama', tags: ['nature'] },
        { en: 'sea', ko: '바다', ja: '海', koReading: 'bada', jaReading: 'umi', tags: ['nature'] },
        { en: 'flower', ko: '꽃', ja: '花', koReading: 'kkot', jaReading: 'hana', tags: ['nature'] },
        { en: 'tree', ko: '나무', ja: '木', koReading: 'namu', jaReading: 'ki', tags: ['nature'] },
        { en: 'sun', ko: '태양', ja: '太陽', koReading: 'taeyang', jaReading: 'taiyou', tags: ['nature', 'hanja'] },
        { en: 'moon', ko: '달', ja: '月', koReading: 'dal', jaReading: 'tsuki', tags: ['nature'] },
        { en: 'school', ko: '학교', ja: '学校', koReading: 'hakgyo', jaReading: 'gakkou', tags: ['education', 'hanja'] },
        { en: 'hospital', ko: '병원', ja: '病院', koReading: 'byeongwon', jaReading: 'byouin', tags: ['hanja', 'place'] },
        { en: 'family', ko: '가족', ja: '家族', koReading: 'gajok', jaReading: 'kazoku', tags: ['hanja', 'people'] },
        { en: 'friend', ko: '친구', ja: '友達', koReading: 'chingu', jaReading: 'tomodachi', tags: ['people'] },
        { en: 'person', ko: '사람', ja: '人', koReading: 'saram', jaReading: 'hito', tags: ['people', 'basic'] },
        { en: 'time', ko: '시간', ja: '時間', koReading: 'sigan', jaReading: 'jikan', tags: ['hanja', 'time'] },
        { en: 'money', ko: '돈', ja: 'お金', koReading: 'don', jaReading: 'okane', tags: ['daily'] },
        { en: 'book', ko: '책', ja: '本', koReading: 'chaek', jaReading: 'hon', tags: ['education', 'daily'] },
        { en: 'music', ko: '음악', ja: '音楽', koReading: 'eumak', jaReading: 'ongaku', tags: ['hanja', 'culture'] },
        { en: 'movie', ko: '영화', ja: '映画', koReading: 'yeonghwa', jaReading: 'eiga', tags: ['hanja', 'culture'] },
        { en: 'eat', ko: '먹다', ja: '食べる', koReading: 'meokda', jaReading: 'taberu', tags: ['verb', 'basic'] },
        { en: 'drink', ko: '마시다', ja: '飲む', koReading: 'masida', jaReading: 'nomu', tags: ['verb', 'basic'] },
        { en: 'go', ko: '가다', ja: '行く', koReading: 'gada', jaReading: 'iku', tags: ['verb', 'basic'] },
        { en: 'come', ko: '오다', ja: '来る', koReading: 'oda', jaReading: 'kuru', tags: ['verb', 'basic'] },
        { en: 'see', ko: '보다', ja: '見る', koReading: 'boda', jaReading: 'miru', tags: ['verb', 'basic'] },
        { en: 'listen', ko: '듣다', ja: '聞く', koReading: 'deutda', jaReading: 'kiku', tags: ['verb', 'basic'] },
        { en: 'speak', ko: '말하다', ja: '話す', koReading: 'malhada', jaReading: 'hanasu', tags: ['verb', 'basic'] },
        { en: 'read', ko: '읽다', ja: '読む', koReading: 'ikda', jaReading: 'yomu', tags: ['verb', 'education'] },
        { en: 'write', ko: '쓰다', ja: '書く', koReading: 'sseuda', jaReading: 'kaku', tags: ['verb', 'education'] },
        { en: 'study', ko: '공부하다', ja: '勉強する', koReading: 'gongbuhada', jaReading: 'benkyousuru', tags: ['verb', 'education'] },
        { en: 'sleep', ko: '자다', ja: '寝る', koReading: 'jada', jaReading: 'neru', tags: ['verb', 'daily'] },
        { en: 'big', ko: '크다', ja: '大きい', koReading: 'keuda', jaReading: 'ookii', tags: ['adjective', 'basic'] },
        { en: 'small', ko: '작다', ja: '小さい', koReading: 'jakda', jaReading: 'chiisai', tags: ['adjective', 'basic'] },
        { en: 'beautiful', ko: '아름답다', ja: '美しい', koReading: 'areumdapda', jaReading: 'utsukushii', tags: ['adjective'] },
        { en: 'preparation', ko: '준비', ja: '準備', koReading: 'junbi', jaReading: 'junbi', tags: ['common', 'hanja'] },
      ],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
