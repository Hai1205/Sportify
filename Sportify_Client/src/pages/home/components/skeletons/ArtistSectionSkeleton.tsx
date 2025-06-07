import { Skeleton } from "@/components/ui/skeleton";

export const ArtistSectionSkeleton = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Top Artists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 cursor-pointer"
          >
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};
