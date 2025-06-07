import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Disc } from "lucide-react"

export function AlbumDetailsSkeleton() {
  return (
    <div className="h-full">
      <div className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
             to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              {/* Album Cover Skeleton */}
              <div className="flex justify-center">
                <div className="h-60 w-60 rounded-md bg-[#282828] flex items-center justify-center">
                  <Disc className="h-16 w-16 text-gray-600" />
                </div>
              </div>

              <div className="flex flex-col justify-end">
                {/* Album Type Skeleton */}
                <Skeleton className="h-4 w-16 bg-gray-700" />

                {/* Album Title Skeleton */}
                <Skeleton className="h-16 w-64 my-4 bg-gray-700" />

                {/* Album Info Skeleton */}
                <div className="flex items-center gap-2 text-sm">
                  <Skeleton className="h-4 w-32 bg-gray-700" />
                  <Skeleton className="h-4 w-20 bg-gray-700" />
                  <Skeleton className="h-4 w-24 bg-gray-700" />
                </div>
              </div>

              {/* Edit Button Skeleton (hidden in skeleton) */}
            </div>

            {/* Play Button Skeleton */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Skeleton className="w-14 h-14 rounded-full bg-gray-700" />
              <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table Header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm 
                text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div className="text-left">Views</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Songs List Skeleton */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 rounded-md"
                      >
                        {/* Song Number */}
                        <div className="flex items-center justify-center">
                          <Skeleton className="h-4 w-4 bg-gray-700" />
                        </div>

                        {/* Song Title and Thumbnail */}
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 rounded-md bg-gray-700" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32 bg-gray-700" />
                            <Skeleton className="h-3 w-24 bg-gray-700" />
                          </div>
                        </div>

                        {/* Release Date */}
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-24 bg-gray-700" />
                        </div>

                        {/* Views */}
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-16 bg-gray-700" />
                        </div>

                        {/* Duration */}
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-12 bg-gray-700" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}