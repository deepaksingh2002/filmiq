import { NextRequest, NextResponse } from "next/server";
import { fetchMovieDetails } from "@/lib/omdb";
import { isValidImdbId } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";

  if (!isValidImdbId(id)) {
    return NextResponse.json(
      { error: "Invalid IMDb ID. Use format like tt0133093." },
      { status: 400 }
    );
  }

  try {
    const movie = await fetchMovieDetails(id);
    return NextResponse.json({ movie });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch movie details.";
    const status = /not found/i.test(message)
      ? 404
      : /authentication failed|missing/i.test(message)
        ? 401
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
