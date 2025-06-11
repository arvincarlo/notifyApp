import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ResultSkeleton = () => {
  const sections = Array(4).fill(0);
  const accountsPerSection = Array(3).fill(0);

  return (
    <div className="relative">
      {/* Generate Report Button Skeleton */}
      <div className="absolute right-4 top-4">
        <Skeleton className="h-10 w-36 rounded-[50px]" />
      </div>

      <Card className="mt-16">
        <CardContent className="pt-10 pl-8 mt-6">
          {sections.map((_, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              {/* Section Header Skeleton */}
              <div className="px-6 py-4 bg-gray-50 mb-2">
                <Skeleton className="h-6 w-48" />
              </div>

              {/* Table Header Skeleton */}
              <div className="grid grid-cols-[auto,1fr] gap-4 p-4 bg-white border-b">
                <div className="pl-6">
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Account Rows Skeleton */}
              {accountsPerSection.map((_, accountIndex) => (
                <div
                  key={accountIndex}
                  className="grid grid-cols-[auto,1fr] gap-4 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 ml-6" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-28" /> {/* Account Number */}
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-36" /> {/* Account Name */}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultSkeleton;
