import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
        <Skeleton className="h-[500px] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <Skeleton className="h-56 w-full rounded-3xl" />
    </section>
  );
}
