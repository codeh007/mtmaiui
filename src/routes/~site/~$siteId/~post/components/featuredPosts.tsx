"use client";

import { Link } from "lucide-react";
import { cn } from "mtxuilib/lib/utils";
import { Card, CardTitle, CardContent, CardFooter } from "mtxuilib/ui/card.jsx";
import { Skeleton } from "mtxuilib/ui/skeleton.jsx";
import { useMemo } from "react";

export type FeaturePostItem =
  EdgeAppRouterOutput["blogPost"]["list"]["items"][number];
export const FeaturePosts = () => {
  const site = useSite();
  if (!site) {
    throw new Error("missing site");
  }
  const [data] = trpc.blogPost.list.useSuspenseInfiniteQuery(
    {
      wid: site?.id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const flatItems = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data],
  );
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg p-2 sm:grid sm:grid-cols-2 xl:grid-cols-3 [&>div]:w-full",
      )}
    >
      {flatItems.map((x, i) => {
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        return <FeaturePostItem key={i} item={x} />;
      })}
    </div>
  );
};

export function FeaturePostsSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="border-raised-border overflow-hidden rounded-lg border p-4 py-6 transition-all duration-150 hover:brightness-150">
        <div className="flex flex-col items-center justify-center">
          <div className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
            <Skeleton className="h-16 w-16" />
          </div>
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="border-raised-border overflow-hidden rounded-lg border p-4 py-6 transition-all duration-150 hover:brightness-150">
        <div className="flex flex-col items-center justify-center">
          <div className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
            <Skeleton className="h-16 w-16" />
          </div>
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeaturePostItem = (props: {
  item: FeaturePostItem;
}) => {
  const { item } = props;
  return (
    <Card
      className={cn(
        "space-y-3 rounded-xl border-2 p-4",
        // "border-blue-400  dark:border-blue-300",
        "max-h-64 min-h-64",
      )}
    >
      <div className="flex space-y-1 p-1">
        <span className="inline-block text-blue-500 dark:text-blue-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </span>
        <CardTitle className="flex-1 text-2xl">
          <h1 className={cn("text-2xl font-semibold capitalize")}>
            {item.title}
          </h1>
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </div>

      <CardContent className="grid flex-1 gap-2">
        <div
          className=""
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: item.content || "",
          }}
        />
      </CardContent>
      <CardFooter>
        <Link
          href="#"
          className="inline-flex rounded-full bg-blue-100 p-2 capitalize text-blue-500 transition-colors duration-200 hover:text-blue-600 hover:underline dark:bg-blue-500 dark:text-white dark:hover:text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>
        <PostAdminEditLink item={item} />
      </CardFooter>
    </Card>
  );
};

export const PostAdminEditLink = (props: {
  item: FeaturePostItem;
}) => {
  const { item } = props;

  // const isAdmin = useIsAdmin();
  // if (!isAdmin) return;
  return (
    <MtLink
      variant="ghost"
      href={`${DASH_PATH}/site/${item.wid}/blogPost/${item.id}`}
    >
      edit
    </MtLink>
  );
};
