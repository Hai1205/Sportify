import { Skeleton } from "@/components/ui/skeleton"
import { Music } from "lucide-react"

export function SongDetailsSkeleton() {
  return (
    <div className="h-full flex items-stretch justify-center">
      <div className="relative w-full max-w-full transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
        {/* Background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <div className="mt-2">
            <Skeleton className="h-4 w-48 bg-gray-700" />
          </div>

          <div className="grid gap-6 py-4">
            <div className="flex gap-6">
              {/* Song thumbnail skeleton */}
              <div className="h-32 w-32 rounded-md bg-[#282828] flex items-center justify-center">
                <Music className="h-10 w-10 text-gray-600" />
              </div>

              <div className="flex flex-col justify-between">
                {/* Song title skeleton */}
                <Skeleton className="h-8 w-64 bg-gray-700" />

                <div className="flex gap-2 mt-4">
                  {/* Play button skeleton */}
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                  {/* Like/Edit button skeleton */}
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                </div>
              </div>
            </div>

            <br />

            <div className="grid grid-cols-2 gap-6">
              <div>
                {/* Song Information heading skeleton */}
                <Skeleton className="h-6 w-40 mb-2 bg-gray-700" />

                <div className="space-y-4">
                  {/* Artist info skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                  </div>

                  {/* Album info skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                  </div>

                  {/* Duration info skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                    <Skeleton className="h-4 w-20 bg-gray-700" />
                  </div>

                  {/* Views info skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                  </div>

                  {/* Release date info skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                  </div>
                </div>
              </div>

              {/* Lyrics section skeleton */}
              <div>
                <Skeleton className="h-6 w-24 mb-2 bg-gray-700" />
                <div className="h-[220px] rounded-md border border-gray-700 bg-[#282828] p-4">
                  <div className="space-y-2">
                    {Array(8)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton
                          key={index}
                          className="h-3 w-full bg-gray-700"
                          style={{ width: `${Math.random() * 40 + 60}%` }}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

