import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider, LLMProviderConfig, ReviewComment } from "./types";

export class ClaudeProvider implements LLMProvider {
  name = "Claude";
  private client: Anthropic | null = null;

  private initClient(apiKey: string): Anthropic {
    if (!this.client) {
      this.client = new Anthropic({ apiKey });
    }
    return this.client;
  }

  async generateReview(prompt: string, config: LLMProviderConfig): Promise<ReviewComment[] | null> {
    const client = this.initClient(config.apiKey);
    
    // Map common model names to Claude models
    const modelMapping: Record<string, string> = {
      "claude-3-opus": "claude-3-opus-20240229",
      "claude-3-sonnet": "claude-3-5-sonnet-20241022",
      "claude-3-haiku": "claude-3-haiku-20240307",
      "claude-3.5-sonnet": "claude-3-5-sonnet-20241022",
      "claude-3.5-haiku": "claude-3-5-haiku-20241022",
    };

    const model = modelMapping[config.model] || config.model;

    // Add JSON instruction to the prompt for Claude
    const enhancedPrompt = `${prompt}

IMPORTANT: You must respond with valid JSON only. No additional text before or after the JSON object.`;

    try {
      const response = await client.messages.create({
        model: model,
        max_tokens: config.maxTokens ?? 700,
        temperature: config.temperature ?? 0.2,
        top_p: config.topP ?? 1,
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          }
        ],
      });

      // Extract text from Claude's response
      const content = response.content[0];
      if (content.type !== 'text') {
        console.error("Unexpected response type from Claude");
        return null;
      }

      const res = content.text.trim();
      
      // Try to extract JSON from the response
      let jsonStr = res;
      
      // If the response contains markdown code blocks, extract the JSON
      const jsonMatch = res.match(/```json\s*([\s\S]*?)\s*```/) || res.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      
      const parsed = JSON.parse(jsonStr);
      return parsed.reviews || [];
    } catch (error) {
      console.error("Claude Provider Error:", error);
      return null;
    }
  }
}
