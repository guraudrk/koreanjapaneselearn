import { OutputLanguage } from '@antigravity/shared';

export interface TranslateExplainInput {
  inputText: string;
  inputLang: string;
  output: OutputLanguage[];
  detailLevel: 'basic' | 'deep';
}

export interface TranslateExplainOutput {
  ko?: string;
  ja?: string;
  explanation: string;
}

/**
 * AI Provider 추상화 인터페이스
 * 모든 Provider (Gemini, Claude, Mock)는 이 인터페이스를 구현한다
 */
export interface AIProvider {
  translateExplain(input: TranslateExplainInput): Promise<TranslateExplainOutput>;
}
