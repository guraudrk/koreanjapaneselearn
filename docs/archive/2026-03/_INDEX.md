# Archive Index — 2026-03

| Feature | Phase | Match Rate | 시작일 | 아카이브일 | 경로 |
|---------|-------|-----------|-------|-----------|------|
| deployment (LinguaBridge MVP) | completed | 100% | 2026-03-06 | 2026-03-17 | `2026-03/deployment/` |
| ai-translate (Claude API 번역+설명) | completed | 96% | 2026-03-19 | 2026-03-19 | `2026-03/ai-translate/` |

## deployment

**기간**: 2026-03-06 ~ 2026-03-17 (11일)
**내용**: LinguaBridge MVP 전체 개발 + TDD 버그 수정 + Railway/Vercel 배포 설정
**태스크**: T-0001 ~ T-0020 (20개)
**Critical 버그**: 2개 / **Major 버그**: 7개 수정
**최종 상태**: TypeScript 0 errors ✓, Next.js 11 routes ✓, 배포 준비 완료

**문서**:
- [deployment.report.md](deployment/deployment.report.md)
- [T-0020-deployment.md](deployment/T-0020-deployment.md)

## ai-translate

**기간**: 2026-03-19 (당일 완료)
**내용**: Claude Haiku API 기반 번역+설명 기능 — 일일 20회 무료 한도, AiUsage DB 추적
**태스크**: T-0022, T-0023
**Match Rate**: 96% / TypeScript 0 errors / Missing 0건
**최종 상태**: 코드 완료, 인프라 배포(prisma db push + Railway) 대기 중

**문서**:
- [ai-translate.plan.md](ai-translate/ai-translate.plan.md)
- [ai-translate.design.md](ai-translate/ai-translate.design.md)
- [ai-translate.analysis.md](ai-translate/ai-translate.analysis.md)
- [ai-translate.report.md](ai-translate/ai-translate.report.md)
