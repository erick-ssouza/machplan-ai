import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Models route funcionando!" });
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ ok: true, received: data });
}
