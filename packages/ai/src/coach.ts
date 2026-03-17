import Anthropic from "@anthropic-ai/sdk";
import { CAREER_COACH_WITH_CONTEXT } from "./prompts.js";

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

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ProfileContext {
  name?: string;
  desired_roles: string[];
  seniority: string;
  skills: string[];
  years_of_experience: number;
  industries: string[];
  visa_status: string;
  needs_sponsorship: boolean;
  recent_applications?: number;
  saved_jobs?: number;
}

/**
 * AI Career Coach that provides personalized career advice.
 * Maintains conversation history for multi-turn chat.
 */
export class CareerCoach {
  private history: CoachMessage[] = [];
  private profileContext: string;

  constructor(profile: ProfileContext) {
    this.profileContext = this.buildContextString(profile);
  }

  private buildContextString(profile: ProfileContext): string {
    const lines: string[] = [];
    if (profile.name) lines.push(`Name: ${profile.name}`);
    lines.push(`Target roles: ${profile.desired_roles.join(", ")}`);
    lines.push(`Seniority: ${profile.seniority}`);
    lines.push(`Experience: ${profile.years_of_experience} years`);
    lines.push(`Skills: ${profile.skills.join(", ")}`);
    lines.push(`Industries: ${profile.industries.join(", ")}`);
    lines.push(`Visa: ${profile.visa_status}`);
    if (profile.needs_sponsorship) lines.push("Needs visa sponsorship: yes");
    if (profile.recent_applications != null) {
      lines.push(`Recent applications: ${profile.recent_applications}`);
    }
    if (profile.saved_jobs != null) {
      lines.push(`Saved jobs: ${profile.saved_jobs}`);
    }
    return lines.join("\n");
  }

  /**
   * Send a message to the career coach and get a response.
   * Conversation history is maintained automatically.
   */
  async chat(userMessage: string): Promise<string> {
    this.history.push({ role: "user", content: userMessage });

    const anthropic = getAnthropic();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: CAREER_COACH_WITH_CONTEXT(this.profileContext),
      messages: this.history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textBlock = response.content.find(
      (block) => block.type === "text"
    );
    const assistantMessage =
      textBlock && textBlock.type === "text"
        ? textBlock.text
        : "I apologize, I was unable to generate a response. Please try again.";

    this.history.push({ role: "assistant", content: assistantMessage });

    return assistantMessage;
  }

  /**
   * Stream a response from the career coach.
   * Yields text chunks as they arrive.
   */
  async *chatStream(
    userMessage: string
  ): AsyncGenerator<string, void, unknown> {
    this.history.push({ role: "user", content: userMessage });

    const anthropic = getAnthropic();

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: CAREER_COACH_WITH_CONTEXT(this.profileContext),
      messages: this.history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    let fullResponse = "";

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullResponse += event.delta.text;
        yield event.delta.text;
      }
    }

    this.history.push({ role: "assistant", content: fullResponse });
  }

  /** Get the current conversation history */
  getHistory(): readonly CoachMessage[] {
    return this.history;
  }

  /** Clear conversation history to start fresh */
  clearHistory(): void {
    this.history = [];
  }
}
