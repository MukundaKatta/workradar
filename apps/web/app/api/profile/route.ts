import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const profileSchema = z.object({
  desired_roles: z.array(z.string()).optional(),
  seniority: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  remote_preference: z.enum(["remote", "hybrid", "onsite", "any"]).optional(),
  locations: z.array(z.string()).optional(),
  willing_to_relocate: z.boolean().optional(),
  visa_status: z.string().optional(),
  needs_sponsorship: z.boolean().optional(),
  h1b_expiry: z.string().optional(),
  skills: z.array(z.string()).optional(),
  years_experience: z.number().optional(),
  industries: z.array(z.string()).optional(),
  company_sizes: z.array(z.string()).optional(),
  culture_values: z.array(z.string()).optional(),
  deal_breakers: z.array(z.string()).optional(),
  resume_url: z.string().optional(),
  full_name: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...parsed.data,
        onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
