import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center px-6 py-12">
      <div className="w-full space-y-4 text-center">
        <Skeleton className="mx-auto h-10 w-80" />
        <Skeleton className="mx-auto h-6 w-64" />
        <Skeleton className="mx-auto h-20 max-w-2xl" />
      </div>
    </section>
  );
}
