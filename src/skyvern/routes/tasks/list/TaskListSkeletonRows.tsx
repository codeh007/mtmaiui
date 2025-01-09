"use client";

import { Skeleton } from "mtxuilib/ui/skeleton";
import { TableCell, TableRow } from "mtxuilib/ui/table";

const pageSizeArray = new Array(5).fill(null); // doesn't matter the value

export function TaskListSkeletonRows() {
  return pageSizeArray.map((_, index) => {
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <TableRow key={index}>
        <TableCell className="w-1/3">
          <Skeleton className="h-6 w-full" />
        </TableCell>
        <TableCell className="w-1/4">
          <Skeleton className="h-6 w-full" />
        </TableCell>
        <TableCell className="w-1/3">
          <Skeleton className="h-6 w-full" />
        </TableCell>
        <TableCell className="w-1/12">
          <Skeleton className="h-6 w-full" />
        </TableCell>
      </TableRow>
    );
  });
}
