import { NextRequest, NextResponse } from "next/server";
import { analyseSentiment } from "@/lib/ai";
import { isValidImdbId } from "@/lib/validators";

interface SentimentPayload {
  id: string;
  title: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<SentimentPayload>;
  const id = body.id || "";
  const title = body.title || "";

  if (!isValidImdbId(id)) {
    return NextResponse.json(
      { error: "Invalid IMDb ID. Use format like tt0133093." },
      { status: 400 }
    );
  }

  if (!title.trim()) {
    return NextResponse.json({ error: "Movie title is required for sentiment analysis." }, { status: 400 });
  }

  try {
    const sentiment = await analyseSentiment(title, id);
    return NextResponse.json({ sentiment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch sentiment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
