"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PostCard } from "./PostCard";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { useMemo } from "react";
import { BiCard, BiTable } from "react-icons/bi";

import { postListOptions } from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";
import Link from "next/link";
import { useOptionalTenant } from "../../hooks/useAuth";
import { useBasePath } from "../../hooks/useBasePath";
import { columns } from "./blog-post-columns";

type PostListViewProps = {
  blogId?: string;
};
export const PostListView = (props: PostListViewProps) => {
  const [blogId, setBlogId] = useState(props.blogId);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showCreateBlog, setShowCreateBlog] = useState(false);

  const [rotate, setRotate] = useState(false);
  const optionalTenant = useOptionalTenant();
  const tenantBlogListQuery = useSuspenseQuery({
    ...postListOptions({
      path: {
        tenant: optionalTenant?.metadata.id || "",
      },
    }),
  });

  const data = useMemo(() => {
    const data = tenantBlogListQuery.data?.rows || [];

    return data;
  }, [tenantBlogListQuery.data?.rows]);

  const emptyState = (
    <Card className="w-full text-justify">
      <CardHeader>
        <CardTitle>No posts</CardTitle>
        <CardDescription>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            There are no workflows registered in this tenant. To enable workflow
            execution, please register a workflow with a worker or{" "}
            <a href="support@hatchet.run">contact support</a>.
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="#" className="flex flex-row item-center">
          <Button onClick={() => {}} variant="link" className="p-0 w-fit">
            {/* <QuestionMarkCircleIcon className={cn("h-4 w-4 mr-2")} /> */}
            {/* Docs: Understanding Workflows in Hatchet */}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "title",
      desc: true,
    },
  ]);

  const [cardToggle, setCardToggle] = useState(true);

  const basePath = useBasePath();

  const actions = [
    <Button
      key="card-toggle"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        setCardToggle((t) => !t);
      }}
      variant={"outline"}
      aria-label="Toggle card/table view"
    >
      {!cardToggle ? (
        <BiCard className="size-4" />
      ) : (
        <BiTable className="size-4" />
      )}
    </Button>,
    // <Button
    //   key="card-toggle"
    //   className="h-8 px-2 lg:px-3"
    //   size="sm"
    //   onClick={() => {
    //     setCardToggle((t) => !t);
    //   }}
    //   variant={"outline"}
    //   aria-label="Toggle card/table view"
    // >
    //   {!cardToggle ? (
    //     <Icons.plus className="size-4" />
    //   ) : (
    //     <Icons.plus className="size-4" />
    //   )}
    // </Button>,
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        tenantBlogListQuery.refetch();
        setRotate(!rotate);
      }}
      variant={"outline"}
      aria-label="Refresh events list"
    >
      <ArrowPathIcon
        className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`}
      />
    </Button>,
    <Link
      key="create-post"
      href={`${basePath}/blogs/${blogId}/post/create`}
      className={cn("h-8 px-2 lg:px-3", buttonVariants({ variant: "outline" }))}
      onClick={() => {
        setShowCreateBlog(true);
      }}
      aria-label="Create new post"
    >
      <Icons.plus className="size-4" />
      {/* <PlusCircleIcon className="size-4" /> */}
    </Link>,
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        pageCount={1}
        filters={[]}
        emptyState={emptyState}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        sorting={sorting}
        setSorting={setSorting}
        manualSorting={false}
        actions={actions}
        manualFiltering={false}
        card={
          cardToggle
            ? {
                component: PostCard,
              }
            : undefined
        }
      />
    </>
  );
};
