// Learning mode options
export type LearningMode = 'KR' | 'JP' | 'BOTH';

// Supported output languages
export type OutputLanguage = 'ko' | 'ja';

// AI feature types for usage tracking
export type AIFeatureType = 'TRANSLATE' | 'STT' | 'IMAGE';

// Subscription tiers
export type SubscriptionTier = 'FREE' | 'PRO';

// Share content types
export type ShareType = 'CARD' | 'PROGRESS';

// Standard API error response
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
