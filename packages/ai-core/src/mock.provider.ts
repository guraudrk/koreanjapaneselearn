import { AIProvider, TranslateExplainInput, TranslateExplainOutput } from './provider.interface';

/**
 * Mock AI Provider — 테스트 및 로컬 개발용
 * 실제 AI API를 호출하지 않고 더미 응답을 반환한다
 */
export class MockAIProvider implements AIProvider {
  async translateExplain(input: TranslateExplainInput): Promise<TranslateExplainOutput> {
    return {
      ko: input.output.includes('ko') ? `[KR] ${input.inputText}` : undefined,
      ja: input.output.includes('ja') ? `[JP] ${input.inputText}` : undefined,
      explanation: `Mock explanation for: "${input.inputText}" (detailLevel: ${input.detailLevel})`,
    };
  }
}
