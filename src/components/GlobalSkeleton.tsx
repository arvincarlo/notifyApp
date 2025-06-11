// components/GlobalSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

const GlobalSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {/* Logo */}
        <Skeleton className="h-8 w-32" />
        {/* User info */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r p-4">
          {/* Portfolio Management */}
          <Skeleton className="mb-4 h-6 w-48" />
          {/* Menu items */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          {/* Search bar and filters */}
          <div className="mb-6 flex items-center gap-4">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Content area */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Search icon placeholder */}
            <Skeleton className="h-24 w-24 rounded-full" />
            {/* Text content */}
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSkeleton;
