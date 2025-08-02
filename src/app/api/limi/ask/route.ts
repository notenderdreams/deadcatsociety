import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    const baseUrl = process.env.LIMI_BASE_URL;

    if (!baseUrl) {
      console.error("LIMI_BASE_URL is not set.");
      return NextResponse.json({ error: "AI backend not configured" }, { status: 500 });
    }

    const endpoint = `${baseUrl}/ask`;

    const externalResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error("External API error:", errorText);
      return new NextResponse(errorText, { status: externalResponse.status });
    }

    const data = await externalResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
