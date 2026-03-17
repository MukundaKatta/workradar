import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { message } = parsed.data;

    // In production, this would call an LLM API (e.g., OpenAI, Anthropic)
    // with the user's profile context for personalized career coaching.
    // For now, return a contextual placeholder response.

    const responses: Record<string, string> = {
      salary:
        "Based on your profile as a Senior Frontend Engineer with 5+ years of experience in React/TypeScript, the market range in your target areas is $170k-$260k. Companies like Stripe and Vercel tend to pay at the higher end. Would you like tips on negotiating?",
      interview:
        "For your target roles, I'd recommend focusing on: 1) System design for frontend architectures, 2) React performance optimization patterns, 3) State management trade-offs. Want me to do a mock interview question?",
      default:
        "That's a great question! As your AI Career Coach, I can help with interview prep, salary negotiation, career path planning, and skill development. Could you tell me more about what specific area you'd like guidance on?",
    };

    const lowerMessage = message.toLowerCase();
    let reply = responses.default;
    if (lowerMessage.includes("salary") || lowerMessage.includes("pay") || lowerMessage.includes("compensation")) {
      reply = responses.salary;
    } else if (lowerMessage.includes("interview") || lowerMessage.includes("prep")) {
      reply = responses.interview;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
