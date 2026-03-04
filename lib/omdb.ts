import axios from "axios";
import { MovieData } from "@/types/movie";

const OMDB_BASE_URL = "https://www.omdbapi.com";
const PLACEHOLDER_KEY = "your_omdb_api_key_here";

function buildOmdbUrl(imdbId: string, apiKey?: string): string {
  const configuredUrl = process.env.OMDB_API;
  if (configuredUrl && configuredUrl !== "your_omdb_api_url_here") {
    const url = new URL(configuredUrl);
    url.searchParams.set("i", imdbId);
    url.searchParams.set("plot", "full");
    // Always prefer OMDB_API_KEY over any key embedded in OMDB_API.
    if (apiKey) {
      url.searchParams.set("apikey", apiKey);
    }
    return url.toString();
  }

  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("i", imdbId);
  url.searchParams.set("plot", "full");
  if (apiKey) {
    url.searchParams.set("apikey", apiKey);
  }
  return url.toString();
}

export async function fetchMovieDetails(imdbId: string): Promise<MovieData> {
  const apiKey = process.env.OMDB_API_KEY?.trim();
  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    throw new Error("OMDB_API_KEY is missing. Add a valid key in .env.local.");
  }

  const requestUrl = buildOmdbUrl(imdbId, apiKey);
  try {
    const { data } = await axios.get(requestUrl, { timeout: 15000 });

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found");
    }

    return {
      id: imdbId,
      title: data.Title,
      poster: data.Poster,
      castList: data.Actors ? data.Actors.split(",").map((n: string) => n.trim()).filter(Boolean) : [],
      releaseYear: data.Year,
      rating: data.Rated,
      genre: data.Genre ? data.Genre.split(",").map((g: string) => g.trim()).filter(Boolean) : [],
      plotSummary: data.Plot,
      imdbRating: data.imdbRating,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      throw new Error("OMDb authentication failed (401/403). Check OMDB_API_KEY in .env.local.");
    }
    throw error;
  }
}
