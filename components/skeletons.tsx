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

export function LoadingLayoutSkeleton() {
  return (
    <div>
      <h1 className="flex text-center justify-center font-bold">
        Ladataan . . .
      </h1>
      <div className="space-y-2 p-4 flex items-center justify-center">
        <Skeleton className="w-full h-[420px] " />
      </div>
    </div>
  );
}

// ChatSkeletton: Alya/Chat

export function ChatSkeletton() {
  return (
    <div className="flex flex-col w-full flex-grow max-h-dvh">
      <div className="p-4 w-full max-w-3xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-md text-nowrap sm:text-2xl lg:text-3xl font-bold text-center flex-1">
            Chatbot - Älyäavustaja
          </h1>
        </div>
      </div>
      <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl shadow-sm border rounded-b-lg">
        <div className="p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4">
          <Skeleton className="h-16 w-3/4 self-start" />
          <Skeleton className="h-16 w-3/4 self-end" />
          <Skeleton className="h-16 w-2/3 self-start" />
          <Skeleton className="h-16 w-2/3 self-end" />
        </div>
      </section>
      <section className="p-4">
        <div className="flex w-full flex-col sm:flex-row max-w-3xl mx-auto items-center space-y-2 sm:space-y-0">
          <Skeleton className="flex-1 h-12" />
          <div className="flex gap-2 items-center mt-2 sm:mt-0">
            <Skeleton className="h-12 w-28 ml-2" />
            <Skeleton className="h-12 w-44" />
          </div>
        </div>
      </section>
      <div className="flex flex-col items-center justify-center mt-4">
        <Skeleton className="h-4 w-96 mb-2" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}

export function DashboardCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-card text-card-foreground shadow-sm rounded-lg p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6 mb-4" />
          <div className="mt-auto">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
