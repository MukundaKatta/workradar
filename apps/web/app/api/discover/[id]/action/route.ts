import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["save", "dismiss", "apply", "not_for_me"]),
  reason: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = actionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { action, reason } = parsed.data;

    const { error } = await supabase.from("user_actions").insert({
      user_id: user.id,
      discovery_id: id,
      action,
      reason: reason || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If action is "apply", also create an application entry
    if (action === "apply") {
      await supabase.from("applications").insert({
        user_id: user.id,
        discovery_id: id,
        status: "interested",
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, action });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
