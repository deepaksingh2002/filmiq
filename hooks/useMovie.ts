"use client";

import { useEffect, useState } from "react";
import { MovieData } from "@/types/movie";

interface UseMovieResult {
  movie: MovieData | null;
  loading: boolean;
  error: string | null;
}

export function useMovie(id: string): UseMovieResult {
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/movie?id=${encodeURIComponent(id)}`);
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to fetch movie details.");
        const raw = body?.movie || {};
        const normalized: MovieData = {
          id: raw.id || id,
          title: raw.title || "Unknown Title",
          poster: raw.poster || "N/A",
          castList: Array.isArray(raw.castList) ? raw.castList : [],
          releaseYear: raw.releaseYear || raw.year || "N/A",
          rating: raw.rating || raw.rated || "N/A",
          genre: Array.isArray(raw.genre) ? raw.genre : [],
          plotSummary: raw.plotSummary || raw.plot || "Plot summary is not available for this movie.",
          imdbRating: raw.imdbRating || "N/A",
        };
        if (active) setMovie(normalized);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to fetch movie details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) run();
    return () => {
      active = false;
    };
  }, [id]);

  return { movie, loading, error };
}
