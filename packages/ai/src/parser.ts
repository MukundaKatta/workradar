import Anthropic from "@anthropic-ai/sdk";
import { PARSE_JOB_POSTING_SYSTEM, PARSE_JOB_POSTING_USER } from "./prompts.js";

let anthropicClient: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Missing ANTHROPIC_API_KEY environment variable");
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export interface ParsedJobPosting {
  title: string;
  description: string;
  seniority: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  skills_required: string[];
  skills_preferred: string[];
  location: string;
  is_remote: boolean;
  is_hybrid: boolean;
  visa_sponsorship_mentioned: boolean;
  visa_sponsorship_signals: string[];
  company_name: string;
  company_domain: string | null;
}

export interface JobAnalysis {
  summary: string;
  red_flags: string[];
  green_flags: string[];
  culture_score: number;
  culture_signals: string[];
}

/**
 * Parse a raw job posting (HTML or plaintext) into structured data
 * using Claude for intelligent extraction.
 */
export async function parseJobPosting(
  rawContent: string
): Promise<ParsedJobPosting> {
  if (!rawContent.trim()) {
    throw new Error("Cannot parse empty job posting content");
  }

  const anthropic = getAnthropic();

  // Truncate very long postings to stay within token limits
  const truncated =
    rawContent.length > 30_000
      ? rawContent.slice(0, 30_000) + "\n[...truncated]"
      : rawContent;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: PARSE_JOB_POSTING_SYSTEM,
    messages: [
      {
        role: "user",
        content: PARSE_JOB_POSTING_USER(truncated),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  try {
    const parsed = JSON.parse(textBlock.text) as ParsedJobPosting;
    return {
      title: parsed.title || "Unknown Title",
      description: parsed.description || "",
      seniority: parsed.seniority || "mid",
      salary_min: parsed.salary_min ?? null,
      salary_max: parsed.salary_max ?? null,
      salary_currency: parsed.salary_currency || "USD",
      skills_required: parsed.skills_required || [],
      skills_preferred: parsed.skills_preferred || [],
      location: parsed.location || "Unknown",
      is_remote: parsed.is_remote ?? false,
      is_hybrid: parsed.is_hybrid ?? false,
      visa_sponsorship_mentioned: parsed.visa_sponsorship_mentioned ?? false,
      visa_sponsorship_signals: parsed.visa_sponsorship_signals || [],
      company_name: parsed.company_name || "Unknown Company",
      company_domain: parsed.company_domain ?? null,
    };
  } catch {
    throw new Error(
      `Failed to parse Claude response as JSON: ${textBlock.text.slice(0, 200)}`
    );
  }
}

/**
 * Analyze a job posting for red/green flags and culture signals.
 */
export async function analyzeJobPosting(
  title: string,
  description: string,
  companyName: string
): Promise<JobAnalysis> {
  const anthropic = getAnthropic();

  const { ANALYZE_JOB_SYSTEM, ANALYZE_JOB_USER } = await import(
    "./prompts.js"
  );

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: ANALYZE_JOB_SYSTEM,
    messages: [
      {
        role: "user",
        content: ANALYZE_JOB_USER(title, description, companyName),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  try {
    const parsed = JSON.parse(textBlock.text) as JobAnalysis;
    return {
      summary: parsed.summary || "",
      red_flags: parsed.red_flags || [],
      green_flags: parsed.green_flags || [],
      culture_score: Math.max(0, Math.min(100, parsed.culture_score || 50)),
      culture_signals: parsed.culture_signals || [],
    };
  } catch {
    throw new Error(
      `Failed to parse analysis response as JSON: ${textBlock.text.slice(0, 200)}`
    );
  }
}
