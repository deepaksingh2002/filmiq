import axios from "axios";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { normalizeSentimentLabel } from "@/lib/utils";
import { SentimentData, SentimentLabel } from "@/types/movie";

const IMDB_REVIEWS_URL = "https://www.imdb.com/title";

function classifyFromReviews(reviews: string[]): SentimentLabel {
  if (!reviews.length) return "mixed";

  const positiveWords = [
    "great",
    "excellent",
    "amazing",
    "masterpiece",
    "love",
    "brilliant",
    "best",
    "fantastic",
    "enjoyed",
    "outstanding",
  ];
  const negativeWords = [
    "bad",
    "boring",
    "worst",
    "awful",
    "terrible",
    "waste",
    "poor",
    "disappointing",
    "weak",
    "hate",
  ];

  let score = 0;
  for (const review of reviews) {
    const text = review.toLowerCase();
    for (const word of positiveWords) {
      if (text.includes(word)) score += 1;
    }
    for (const word of negativeWords) {
      if (text.includes(word)) score -= 1;
    }
  }

  if (score >= 3) return "positive";
  if (score <= -3) return "negative";
  return "mixed";
}

function fallbackSummary(movieTitle: string, reviews: string[], classification: SentimentLabel): string {
  if (!reviews.length) {
    return `Audience reviews for "${movieTitle}" could not be retrieved right now, so the sentiment estimate is limited.`;
  }

  const sample = reviews.slice(0, 2).map((r) => r.slice(0, 140)).join(" ");
  if (classification === "positive") {
    return `Audience feedback for "${movieTitle}" is largely positive. Viewers frequently highlight strengths in storytelling, performances, and overall entertainment value. Sample review themes: ${sample}`;
  }
  if (classification === "negative") {
    return `Audience feedback for "${movieTitle}" is generally negative. Reviewers often point out issues with pacing, execution, or engagement. Sample review themes: ${sample}`;
  }
  return `Audience feedback for "${movieTitle}" is mixed, with both praise and criticism across reviews. Sample review themes: ${sample}`;
}

async function scrapeReviews(imdbId: string, maxReviews = 25): Promise<string[]> {
  const url = `${IMDB_REVIEWS_URL}/${imdbId}/reviews`;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html);
    const reviews: string[] = [];
    const selectors = [
      ".text.show-more__control",
      '[data-testid="review-overflow"]',
      ".review-container .content .text",
      ".ipc-html-content-inner-div",
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 30) {
          reviews.push(text);
        }
      });
      if (reviews.length > 0) break;
    }

    const unique = [...new Set(reviews)].slice(0, maxReviews);
    if (unique.length > 0) return unique;

    // Fallback extraction if main selectors change.
    const secondary: string[] = [];
    $(".lister-item-content, [data-testid='review-card']")
      .find("p, div")
      .each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 60) secondary.push(text);
      });
    return [...new Set(secondary)].slice(0, maxReviews);
  } catch {
    return [];
  }
}

export async function analyseSentiment(movieTitle: string, imdbId: string): Promise<SentimentData> {
  const reviews = await scrapeReviews(imdbId);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    const classification = classifyFromReviews(reviews);
    return {
      aiSummary: fallbackSummary(movieTitle, reviews, classification),
      classification,
    };
  }

  if (reviews.length === 0) {
    return {
      aiSummary: `Audience reviews for "${movieTitle}" could not be retrieved right now, so the sentiment estimate is limited.`,
      classification: "mixed",
    };
  }

  const prompt = `You are a film-review analyst. Given the following ${reviews.length} audience reviews for the movie "${movieTitle}", produce a JSON object with EXACTLY these keys:

1. "summary"           - A concise 3-4 sentence summary of overall audience sentiment.
2. "overall_sentiment" - One of: "Positive", "Mixed", or "Negative".
3. "key_insights"      - A single sentence highlighting 2-3 key themes.
4. "confidence_scores" - An object with:
    - "positivity"  (integer 0-100)
    - "engagement"  (integer 0-100)
    - "criticality" (integer 0-100)

Reviews:
${reviews.map((r, i) => `[${i + 1}] ${r.slice(0, 600)}`).join("\n\n")}

Respond ONLY with valid JSON (no markdown fences, no extra text).`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned) as { summary?: string; overall_sentiment?: string };

    return {
      aiSummary: parsed.summary || "Sentiment analysis completed with formatting issues.",
      classification: normalizeSentimentLabel(parsed.overall_sentiment || "mixed"),
    };
  } catch {
    const classification = classifyFromReviews(reviews);
    return {
      aiSummary: fallbackSummary(movieTitle, reviews, classification),
      classification,
    };
  }
}
