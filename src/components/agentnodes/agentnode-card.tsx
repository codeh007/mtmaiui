"use client";

import type { components } from "mtmaiapi/query_client/generated";
import { useBasePath } from "../../hooks/useBasePath";
import { Link } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Badge } from "mtxuilib/ui/badge";
import { buttonVariants } from "mtxuilib/ui/button";

interface AgentNodeCardProps {
  data: components["schemas"]["AgentNode"];
}
export const AgentNodeCard = ({ data }: AgentNodeCardProps) => {
  const basePath = useBasePath();
  return (
    <div
      key={data.metadata?.id}
      className="border overflow-hidden shadow rounded-lg"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-row items-center justify-between mb-2">
          <Badge variant="secondary">{data.type}</Badge>{" "}
          <WorkerStatus status={data.status} health={isHealthy(data)} />
        </div>
        <h3 className="text-lg leading-6 font-medium text-foreground">
          <Link
            href={`${basePath}/workers/${data.metadata?.id}`}
            className="flex flex-row gap-2 hover:underline"
          >
            {/* <SdkInfo runtimeInfo={data?.runtimeInfo} iconOnly={true} /> */}
            {data.webhookUrl || data.name}
          </Link>
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-700 dark:text-gray-300">
          Started <RelativeDate date={data.metadata?.createdAt} />
          <br />
          Last seen{" "}
          {data?.lastHeartbeatAt ? (
            <RelativeDate date={data?.lastHeartbeatAt} />
          ) : (
            "N/A"
          )}
          <br />
          {(data.maxRuns ?? 0) > 0
            ? `${data.availableRuns} / ${data.maxRuns ?? 0}`
            : "100"}{" "}
          available run slots
        </p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="text-sm text-background-secondary">
          <Link
            href={`${basePath}/agentnode/${data.metadata?.id}`}
            className={cn(buttonVariants())}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
  // );
};
