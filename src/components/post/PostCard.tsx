"use client";
import type { components } from "mtmaiapi/query_client/generated";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Button } from "mtxuilib/ui/button";
import Link from "next/link";
import { useBasePath } from "../../hooks/useBasePath";

interface PostCardProps {
  data: components["schemas"]["BlogPost"];
}
export const PostCard = ({ data }: PostCardProps) => {
  const basePath = useBasePath();
  return (
    <div
      key={data.metadata?.id}
      className="border overflow-hidden shadow rounded-lg"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-foreground">
            <Link href={`${basePath}/workflows/${data?.metadata?.id}`}>
              {data?.title}
            </Link>
          </h3>
          {/* {data?.isPaused ? (
            <Badge variant="inProgress">Paused</Badge>
          ) : (
            <Badge variant="successful">Active</Badge>
          )} */}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-700 dark:text-gray-300">
          {/* Last run{' '}
        {data.lastRunAt ? <RelativeDate date={data.lastRunAt} /> : 'never'}
        <br /> */}
          Created at <RelativeDate date={data?.metadata?.createdAt} />
        </p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="text-sm text-background-secondary">
          <Link href={`${basePath}/posts/${data?.metadata?.id}`}>
            <Button>View Post</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
