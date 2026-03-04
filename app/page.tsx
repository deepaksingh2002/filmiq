"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidImdbId } from "@/lib/validators";

const examples = ["tt0133093", "tt0111161", "tt0468569"];

export default function HomePage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim();
    if (!isValidImdbId(trimmed)) {
      setError("Invalid IMDb ID. Use format like tt0133093.");
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/movie/${trimmed}`);
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center px-6 py-12">
      <div className="w-full text-center">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold text-[#f5c518]">
          AI Movie Insight Builder
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-slate-300">
          Enter an IMDb ID to unlock cinematic insights.
        </motion.p>

        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-10 max-w-2xl space-y-4">
          <div className="rounded-2xl border border-[#f5c518]/35 bg-[#1a1a1a]/95 p-2 backdrop-blur-2xl">
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter IMDb ID (e.g. tt0133093)"
                className="border-0 bg-transparent"
              />
              <Button loading={loading} type="submit" className="min-w-36">
                Search
              </Button>
            </div>
          </div>
          {error ? <p className="text-sm text-[#ff6b6b]">{error}</p> : null}
        </motion.form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {examples.map((example) => (
            <button key={example} onClick={() => setId(example)} className="transition-transform hover:-translate-y-0.5">
              <Badge>{example}</Badge>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
