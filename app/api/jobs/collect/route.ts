import { NextRequest, NextResponse } from "next/server";
import { collectTrends } from "@/server/jobs/collect-trends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.COLLECT_JOB_SECRET;

  if (!secret) {
    return true;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await collectTrends();

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
