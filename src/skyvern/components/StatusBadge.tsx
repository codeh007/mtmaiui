import { cn } from "mtxuilib/lib/utils";
import { Badge } from "mtxuilib/ui/badge";
import { Status } from "../api/types";

type Props = {
  status: Status;
};

export function StatusBadge({ status }: Props) {
  const statusText = status === "timed_out" ? "timed out" : status;

  return (
    <Badge
      className={cn(
        "flex h-7 w-24 justify-center text-gray-600 bg-primary/50",
        {
          "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600":
            status === Status.Completed,
          "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600":
            status === Status.Terminated,
          "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600":
            status === Status.Created,
          "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600":
            status === Status.Failed ||
            status === Status.Canceled ||
            status === Status.TimedOut,
          "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600":
            status === Status.Running || status === Status.Queued,
        },
      )}
    >
      <span className="text-gray-600 dark:text-white">
        {statusText || "unknown"}
      </span>
    </Badge>
  );
}
