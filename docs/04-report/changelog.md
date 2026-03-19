# Project Changelog

## [2026-03-19] - AI Translate Feature Completion

### Added
- Claude Haiku API integration for translation + contextual explanations
- Daily usage limit tracking (20 requests/day/user) via `AiUsage` Prisma model
- `POST /ai/translate-explain` REST endpoint with JWT authentication
- "AI 설명" button in dictionary search results with result card display
- "AI 설명 보기" button in learning flip cards with explanation display
- Daily quota counter showing remaining requests
- 429 (rate limit) error handling with user-friendly messaging
- General error fallback for API failures

### Changed
- `apps/api/prisma/schema.prisma`: Added `AiUsage` model and `User.aiUsages` relation
- `apps/api/src/app.module.ts`: Registered `AiModule`
- `apps/web/app/(app)/dictionary/page.tsx`: Integrated AI explanation feature
- `apps/web/app/(app)/learn/[curriculumId]/[lessonId]/page.tsx`: Integrated AI explanation feature

### Fixed
- Error handling for API failures (429 and general exceptions)
- State management to prevent AI results carrying over between card transitions

### Metrics
- Design Match Rate: 96%
- TypeScript Errors: 0
- Implementation Time: 1 session (vs 2.5 estimated)
- Ready for deployment (pending `prisma db push` + Railway environment setup)

