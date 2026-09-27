import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the real layout's boxes so nothing shifts when the data lands. */
export const AnalyticsSkeleton = () => (
  <>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[108px] rounded-2xl" />
      ))}
    </div>

    {/* Chart first, breakdown under it — same order as the real layout. */}
    <Skeleton className="h-[476px] rounded-2xl" />
    <Skeleton className="h-[216px] rounded-2xl" />
  </>
);
