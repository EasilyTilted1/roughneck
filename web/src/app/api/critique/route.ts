import { NextResponse } from "next/server";
import { DegreeBlueprintSchema } from "@/lib/schemas";

const AGENTS_URL = process.env.AGENTS_URL ?? "http://localhost:8000";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = DegreeBlueprintSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid DegreeBlueprint", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const res = await fetch(`${AGENTS_URL}/critique`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { error: "Agents service unreachable", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
