"use client";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import Link from "next/link";

export const envColumns: ColumnDef<Workflow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={`/workflows/${row.original.metadata.id}`}>
          <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap text-md p-2">
            {row.original.name}
          </div>
        </Link>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Value"
        className="whitespace-nowrap"
      />
    ),
    // sortingFn: (a, b) => {
    //   return (
    //     new Date(a.original.metadata.createdAt).getTime() -
    //     new Date(b.original.metadata.createdAt).getTime()
    //   );
    // },
    // cell: ({ row }) => {
    //   return (
    //     <div className="whitespace-nowrap">
    //       {/* <RelativeDate date={row.original.metadata.createdAt} /> */}
    //       {row.getValue()}
    //     </div>
    //   );
    // },
    enableSorting: true,
    enableHiding: true,
  },
  {
    header: () => <></>,
    accessorKey: "chevron",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/workflows/${row.original.metadata.id}`}>
            <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap text-md p-2">
              <ChevronRightIcon
                className="h-5 w-5 flex-none text-gray-700 dark:text-gray-300"
                aria-hidden="true"
              />
            </div>
          </Link>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
