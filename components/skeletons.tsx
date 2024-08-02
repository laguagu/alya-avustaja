import { Skeleton } from "@/components/ui/skeleton";

export default function AiButtonSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col justify-start items-start space-y-2 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function LoadingIssueSkeleton() {
  return (
    <div className="space-y-2 p-4">
      <Skeleton className="w-11/12 h-[420px] " />
    </div>
  );
}

export function LoadingIssuePageSkeleton() {
  return (
    <div>
      <h1 className="flex text-center justify-center font-bold">
        Ladataan vikailmoituksia . . .
      </h1>
      <div className="space-y-2 p-4 flex items-center justify-center">
        <Skeleton className="w-6/12 h-[420px] " />
      </div>
    </div>
  );
}

// ChatSkeletton: Alya/Chat
// FurnituresSkeleton: Alya/Furnitures
