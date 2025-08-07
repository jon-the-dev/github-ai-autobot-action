import OpenAI from "openai";
import { LLMProvider, LLMProviderConfig, ReviewComment } from "./types";

export class OpenAIProvider implements LLMProvider {
  name = "OpenAI";
  private client: OpenAI | null = null;

  private initClient(apiKey: string): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  async generateReview(prompt: string, config: LLMProviderConfig): Promise<ReviewComment[] | null> {
    const client = this.initClient(config.apiKey);
    
    const queryConfig = {
      model: config.model,
      temperature: config.temperature ?? 0.2,
      max_tokens: config.maxTokens ?? 700,
      top_p: config.topP ?? 1,
      frequency_penalty: config.frequencyPenalty ?? 0,
      presence_penalty: config.presencePenalty ?? 0,
    };

    try {
      const response = await client.chat.completions.create({
        ...queryConfig,
        // return JSON if the model supports it:
        ...(config.model === "gpt-4-1106-preview" || 
            config.model.includes("gpt-4-turbo") ||
            config.model.includes("gpt-4o") ||
            config.model.includes("o1")
          ? { response_format: { type: "json_object" as const } }
          : {}),
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
      });

      const res = response.choices[0].message?.content?.trim() || "{}";
      const parsed = JSON.parse(res);
      return parsed.reviews || [];
    } catch (error) {
      console.error("OpenAI Provider Error:", error);
      return null;
    }
  }
}
