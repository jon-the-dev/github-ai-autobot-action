import { readFileSync } from "fs";
import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
import parseDiff, { Chunk, File } from "parse-diff";
import minimatch from "minimatch";
import { ProviderFactory } from "./providers/factory";
import { LLMProvider, LLMProviderConfig, ReviewComment } from "./providers/types";

const GITHUB_TOKEN: string = core.getInput("GITHUB_TOKEN");

// Get API keys
const OPENAI_API_KEY: string = core.getInput("OPENAI_API_KEY");
const CLAUDE_API_KEY: string = core.getInput("CLAUDE_API_KEY");

// Get model configuration (support both old and new input names)
const AI_MODEL: string = core.getInput("AI_MODEL") || core.getInput("OPENAI_API_MODEL") || "gpt-4o";
const AI_PROVIDER: string = core.getInput("AI_PROVIDER") || "auto";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

interface PRDetails {
  owner: string;
  repo: string;
  pull_number: number;
  title: string;
  description: string;
}

// Determine which provider and API key to use
function getProviderConfig(): { provider: LLMProvider; config: LLMProviderConfig } {
  let provider: LLMProvider;
  let apiKey: string;

  // Determine provider
  if (AI_PROVIDER === "auto") {
    provider = ProviderFactory.getProviderFromModel(AI_MODEL);
  } else {
    provider = ProviderFactory.getProvider(AI_PROVIDER);
  }

  // Determine API key based on provider
  if (provider.name === "Claude" || provider.name === "Anthropic") {
    if (!CLAUDE_API_KEY) {
      throw new Error("CLAUDE_API_KEY is required for Claude/Anthropic models");
    }
    apiKey = CLAUDE_API_KEY;
  } else if (provider.name === "OpenAI") {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required for OpenAI models");
    }
    apiKey = OPENAI_API_KEY;
  } else {
    throw new Error(`Unknown provider: ${provider.name}`);
  }

  const config: LLMProviderConfig = {
    apiKey,
    model: AI_MODEL,
    temperature: 0.2,
    maxTokens: 700,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  return { provider, config };
}

async function getPRDetails(): Promise<PRDetails> {
  const { repository, number } = JSON.parse(
    readFileSync(process.env.GITHUB_EVENT_PATH || "", "utf8")
  );
  const prResponse = await octokit.pulls.get({
    owner: repository.owner.login,
    repo: repository.name,
    pull_number: number,
  });
  return {
    owner: repository.owner.login,
    repo: repository.name,
    pull_number: number,
    title: prResponse.data.title ?? "",
    description: prResponse.data.body ?? "",
  };
}

async function getDiff(
  owner: string,
  repo: string,
  pull_number: number
): Promise<string | null> {
  const response = await octokit.pulls.get({
    owner,
    repo,
    pull_number,
    mediaType: { format: "diff" },
  });
  // @ts-expect-error - response.data is a string
  return response.data;
}

async function analyzeCode(
  parsedDiff: File[],
  prDetails: PRDetails
): Promise<Array<{ body: string; path: string; line: number }>> {
  const comments: Array<{ body: string; path: string; line: number }> = [];
  const { provider, config } = getProviderConfig();

  console.log(`🤖 GitHub AI Autobot v2 - Using ${provider.name} provider with model ${config.model}`);

  for (const file of parsedDiff) {
    if (file.to === "/dev/null") continue; // Ignore deleted files
    for (const chunk of file.chunks) {
      const prompt = createPrompt(file, chunk, prDetails);
      const aiResponse = await getAIResponse(prompt, provider, config);
      if (aiResponse) {
        const newComments = createComment(file, chunk, aiResponse);
        if (newComments) {
          comments.push(...newComments);
        }
      }
    }
  }
  return comments;
}

function createPrompt(file: File, chunk: Chunk, prDetails: PRDetails): string {
  return `Your task is to review pull requests. Instructions:
- Provide the response in following JSON format:  {"reviews": [{"lineNumber":  <line_number>, "reviewComment": "<review comment>"}]}
- Do not give positive comments or compliments.
- Provide comments and suggestions ONLY if there is something to improve, otherwise "reviews" should be an empty array.
- Write the comment in GitHub Markdown format.
- Use the given description only for the overall context and only comment the code.
- IMPORTANT: NEVER suggest adding comments to the code.
- Focus on: security vulnerabilities, performance issues, code quality, best practices, and potential bugs.

Review the following code diff in the file "${
    file.to
  }" and take the pull request title and description into account when writing the response.
  
Pull request title: ${prDetails.title}
Pull request description:

---
${prDetails.description}
---

Git diff to review:

\`\`\`diff
${chunk.content}
${chunk.changes
  // @ts-expect-error - ln and ln2 exists where needed
  .map((c) => `${c.ln ? c.ln : c.ln2} ${c.content}`)
  .join("\n")}
\`\`\`
`;
}

async function getAIResponse(
  prompt: string,
  provider: LLMProvider,
  config: LLMProviderConfig
): Promise<ReviewComment[] | null> {
  try {
    return await provider.generateReview(prompt, config);
  } catch (error) {
    console.error(`❌ Error getting AI response from ${provider.name}:`, error);
    return null;
  }
}

function createComment(
  file: File,
  chunk: Chunk,
  aiResponses: ReviewComment[]
): Array<{ body: string; path: string; line: number }> {
  return aiResponses.flatMap((aiResponse) => {
    if (!file.to) {
      return [];
    }
    return {
      body: `🤖 **GitHub AI Autobot v2**\n\n${aiResponse.reviewComment}`,
      path: file.to,
      line: Number(aiResponse.lineNumber),
    };
  });
}

async function createReviewComment(
  owner: string,
  repo: string,
  pull_number: number,
  comments: Array<{ body: string; path: string; line: number }>
): Promise<void> {
  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number,
    comments,
    event: "COMMENT",
  });
}

async function main() {
  console.log("🚀 Starting GitHub AI Autobot Action v2...");
  
  // Validate configuration early
  try {
    const { provider, config } = getProviderConfig();
    console.log(`✅ AI Code Reviewer initialized with ${provider.name} provider using model ${config.model}`);
  } catch (error) {
    core.setFailed(`❌ Configuration error: ${error}`);
    return;
  }

  const prDetails = await getPRDetails();
  let diff: string | null;
  const eventData = JSON.parse(
    readFileSync(process.env.GITHUB_EVENT_PATH ?? "", "utf8")
  );

  if (eventData.action === "opened") {
    diff = await getDiff(
      prDetails.owner,
      prDetails.repo,
      prDetails.pull_number
    );
  } else if (eventData.action === "synchronize") {
    const newBaseSha = eventData.before;
    const newHeadSha = eventData.after;

    const response = await octokit.repos.compareCommits({
      headers: {
        accept: "application/vnd.github.v3.diff",
      },
      owner: prDetails.owner,
      repo: prDetails.repo,
      base: newBaseSha,
      head: newHeadSha,
    });

    diff = String(response.data);
  } else {
    console.log("ℹ️ Unsupported event:", process.env.GITHUB_EVENT_NAME);
    return;
  }

  if (!diff) {
    console.log("ℹ️ No diff found");
    return;
  }

  const parsedDiff = parseDiff(diff);

  const excludePatterns = core
    .getInput("exclude")
    .split(",")
    .map((s) => s.trim());

  const filteredDiff = parsedDiff.filter((file) => {
    return !excludePatterns.some((pattern) =>
      minimatch(file.to ?? "", pattern)
    );
  });

  console.log(`📊 Analyzing ${filteredDiff.length} files...`);

  const comments = await analyzeCode(filteredDiff, prDetails);
  if (comments.length > 0) {
    console.log(`💬 Posting ${comments.length} review comments...`);
    await createReviewComment(
      prDetails.owner,
      prDetails.repo,
      prDetails.pull_number,
      comments
    );
    console.log("✅ Review completed successfully!");
  } else {
    console.log("✅ No issues found - great code!");
  }
}

main().catch((error) => {
  console.error("❌ Critical Error:", error);
  core.setFailed(error.message);
  process.exit(1);
});
