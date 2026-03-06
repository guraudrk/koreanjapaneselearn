# T-0001 Monorepo Setup & Basic Apps Initialization

## Goal (사용자 가치)
프로젝트의 기반이 되는 모노레포 구조를 설정하고 프론트엔드(Web), 모바일(App), 백엔드(API) 앱의 초기 환경을 구축한다.

## Scope (포함/제외)
- 포함: 
  - 모노레포 기본 구조 (apps/, packages/)
  - Next.js (Web) 초기화
  - NestJS (API) 초기화
  - Expo (Mobile) 초기화 (기본 템플릿)
  - 공통 패키지 (shared, ui, ai-core) 폴더 생성
- 제외:
  - 구체적인 UI 구성 및 비즈니스 로직 구현
  - CI/CD 파이프라인 구축 (추후 진행)

## Deliverables
- `apps/web/` 초기 Next.js 프로젝트
- `apps/api/` 초기 NestJS 프로젝트
- `apps/mobile/` 초기 Expo 프로젝트
- `packages/` 폴더 내 구조

## Acceptance Criteria
- [ ] `npm run dev` (또는 각 앱별 실행 명령)으로 각 앱이 정상적으로 기동됨
- [ ] 모노레포 내에서 각 앱간의 패키지 분리가 되어 있음

## Verification Plan
- 각 디렉토리에서 초기 구동 명령 실행 및 결과 확인
- `npm list` 또는 해당 패키지 매니저의 워크스페이스 확인 명령 수행
