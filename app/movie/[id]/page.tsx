"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { CastList } from "@/components/movie/CastList";
import { MoviePoster } from "@/components/movie/MoviePoster";
import { PlotSummary } from "@/components/movie/PlotSummary";
import { SentimentCard } from "@/components/sentiment/SentimentCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMovie } from "@/hooks/useMovie";
import { useSentiment } from "@/hooks/useSentiment";

function DetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
      <Skeleton className="h-[500px] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const movieId = params.id;
  const { movie, loading: movieLoading, error: movieError } = useMovie(movieId);
  const { sentiment, loading: sentimentLoading, error: sentimentError } = useSentiment(movieId, movie?.title || "");

  if (movieLoading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10">
        <DetailsSkeleton />
      </section>
    );
  }

  if (movieError || !movie) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10 text-[#ff6b6b]">
        {movieError || "No movie details found."}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]"
      >
        <MoviePoster title={movie.title} poster={movie.poster} imdbRating={movie.imdbRating} />
        <Card className="space-y-5">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-slate-300">
            {movie.releaseYear} | {movie.rating}
          </p>
          <div className="flex flex-wrap gap-2">
            {movie.genre.map((g) => (
              <motion.div key={g} whileHover={{ y: -2 }}>
                <Badge>{g}</Badge>
              </motion.div>
            ))}
          </div>
          <CastList cast={movie.castList} />
          <h3 className="text-lg font-semibold text-[#f5c518]">Short Plot Summary</h3>
          <PlotSummary text={movie.plotSummary} />
        </Card>
      </motion.div>

      <h3 className="text-lg font-semibold text-[#f5c518]">AI Audience Summary</h3>
      {sentimentLoading ? (
        <Skeleton className="h-56 w-full rounded-3xl" />
      ) : (
        <SentimentCard
          sentiment={
            sentimentError || !sentiment
              ? {
                  aiSummary: "AI summary is currently unavailable. Please retry in a moment.",
                  classification: "mixed",
                }
              : sentiment
          }
        />
      )}
    </section>
  );
}
