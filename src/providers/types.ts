export interface ReviewComment {
  lineNumber: string;
  reviewComment: string;
}

export interface ReviewResponse {
  reviews: ReviewComment[];
}

export interface LLMProviderConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface LLMProvider {
  name: string;
  generateReview(prompt: string, config: LLMProviderConfig): Promise<ReviewComment[] | null>;
}
