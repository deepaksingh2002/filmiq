"use client";

import { useEffect, useState } from "react";
import { SentimentData } from "@/types/movie";
import { normalizeSentimentLabel } from "@/lib/utils";

interface UseSentimentResult {
  sentiment: SentimentData | null;
  loading: boolean;
  error: string | null;
}

export function useSentiment(id: string, title: string): UseSentimentResult {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, title }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to fetch sentiment.");
        const raw = body?.sentiment || {};
        const normalized: SentimentData = {
          aiSummary:
            raw.aiSummary ||
            raw.summary ||
            raw.key_insights ||
            "AI summary is unavailable for this movie right now.",
          classification: normalizeSentimentLabel(raw.classification || raw.overall_sentiment || "mixed"),
        };
        if (active) setSentiment(normalized);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to fetch sentiment.");
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id && title) run();
    return () => {
      active = false;
    };
  }, [id, title]);

  return { sentiment, loading, error };
}
