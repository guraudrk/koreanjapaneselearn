import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Curriculum 1: Korean Basics
  const krCurriculum = await prisma.curriculum.upsert({
    where: { id: 'curr-kr-basics' },
    update: {},
    create: {
      id: 'curr-kr-basics',
      title: 'Korean Basics',
      description: 'Learn Hangul and essential Korean words from scratch',
      language: 'KR',
      level: 'beginner',
      order: 1,
      lessons: {
        create: [
          {
            id: 'lesson-kr-01',
            title: 'Hangul: Vowels',
            description: 'Learn the basic Korean vowels',
            order: 1,
            cards: {
              create: [
                { id: 'card-kr-01', type: 'WORD', en: 'hello', ko: '안녕하세요', ja: 'こんにちは', koReading: 'annyeonghaseyo', jaReading: 'konnichiwa', order: 1 },
                { id: 'card-kr-02', type: 'WORD', en: 'thank you', ko: '감사합니다', ja: 'ありがとうございます', koReading: 'gamsahamnida', jaReading: 'arigatougozaimasu', order: 2 },
                { id: 'card-kr-03', type: 'WORD', en: 'yes', ko: '네', ja: 'はい', koReading: 'ne', jaReading: 'hai', order: 3 },
              ],
            },
          },
          {
            id: 'lesson-kr-02',
            title: 'Greetings',
            description: 'Everyday Korean greetings and farewells',
            order: 2,
            cards: {
              create: [
                { id: 'card-kr-04', type: 'SENTENCE', en: 'Nice to meet you', ko: '반갑습니다', ja: 'はじめまして', koReading: 'bangapseumnida', jaReading: 'hajimemashite', order: 1 },
                { id: 'card-kr-05', type: 'SENTENCE', en: 'Goodbye', ko: '안녕히 가세요', ja: 'さようなら', koReading: 'annyeonghi gaseyo', jaReading: 'sayounara', order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  // Curriculum 2: Japanese Basics
  const jpCurriculum = await prisma.curriculum.upsert({
    where: { id: 'curr-jp-basics' },
    update: {},
    create: {
      id: 'curr-jp-basics',
      title: 'Japanese Basics',
      description: 'Learn Hiragana and essential Japanese words from scratch',
      language: 'JP',
      level: 'beginner',
      order: 2,
      lessons: {
        create: [
          {
            id: 'lesson-jp-01',
            title: 'Hiragana: あいうえお',
            description: 'Learn the first five Hiragana characters',
            order: 1,
            cards: {
              create: [
                { id: 'card-jp-01', type: 'WORD', en: 'water', ko: '물', ja: '水', koReading: 'mul', jaReading: 'mizu', order: 1 },
                { id: 'card-jp-02', type: 'WORD', en: 'sky', ko: '하늘', ja: '空', koReading: 'haneul', jaReading: 'sora', order: 2 },
                { id: 'card-jp-03', type: 'WORD', en: 'mountain', ko: '산', ja: '山', koReading: 'san', jaReading: 'yama', order: 3 },
              ],
            },
          },
          {
            id: 'lesson-jp-02',
            title: 'Numbers 1-10',
            description: 'Count from 1 to 10 in Korean and Japanese',
            order: 2,
            cards: {
              create: [
                { id: 'card-jp-04', type: 'WORD', en: 'one', ko: '일 / 하나', ja: '一 / いち', koReading: 'il / hana', jaReading: 'ichi', order: 1 },
                { id: 'card-jp-05', type: 'WORD', en: 'two', ko: '이 / 둘', ja: '二 / に', koReading: 'i / dul', jaReading: 'ni', order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  // Dictionary entries
  await prisma.dictionaryEntry.createMany({
    skipDuplicates: true,
    data: [
      { en: 'preparation', ko: '준비', ja: '準備', koReading: 'junbi', jaReading: 'junbi', tags: ['common', 'hanja'] },
      { en: 'love', ko: '사랑', ja: '愛', koReading: 'sarang', jaReading: 'ai', tags: ['emotion'] },
      { en: 'food', ko: '음식', ja: '食べ物', koReading: 'eumsik', jaReading: 'tabemono', tags: ['food', 'daily'] },
    ],
  });

  console.log('Seed complete:', { krCurriculum: krCurriculum.id, jpCurriculum: jpCurriculum.id });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
