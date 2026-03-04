"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-rose-400">{error.message || "Something went wrong."}</p>
    </section>
  );
}
