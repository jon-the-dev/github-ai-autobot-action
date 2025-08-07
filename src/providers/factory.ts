import { LLMProvider } from "./types";
import { OpenAIProvider } from "./openai";
import { ClaudeProvider } from "./claude";

export type ProviderType = "openai" | "claude" | "anthropic";

export class ProviderFactory {
  private static providers: Map<string, LLMProvider> = new Map();

  static {
    // Register default providers
    this.registerProvider("openai", new OpenAIProvider());
    this.registerProvider("claude", new ClaudeProvider());
    this.registerProvider("anthropic", new ClaudeProvider()); // Alias for Claude
  }

  static registerProvider(name: string, provider: LLMProvider): void {
    this.providers.set(name.toLowerCase(), provider);
  }

  static getProvider(name: string): LLMProvider {
    const provider = this.providers.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Unknown LLM provider: ${name}. Available providers: ${Array.from(this.providers.keys()).join(", ")}`);
    }
    return provider;
  }

  static getProviderFromModel(model: string): LLMProvider {
    // Auto-detect provider based on model name
    if (model.startsWith("gpt") || model.includes("o1")) {
      return this.getProvider("openai");
    } else if (model.startsWith("claude")) {
      return this.getProvider("claude");
    }
    
    // Default to OpenAI for backward compatibility
    return this.getProvider("openai");
  }

  static listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
