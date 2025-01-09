"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { SortingState, VisibilityState } from "@tanstack/react-table";

import { useMemo, useState } from "react";
import { BiCard, BiTable } from "react-icons/bi";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { blogCreateMutation, blogListOptions } from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import Link from "next/link";
import { useTenant } from "../../hooks/useAuth";
import { Blogcard } from "./BlogCard";
import { columns } from "./blog-columns";
import { CreateBlogForm } from "./blog-form-create";
import { MtLoading } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "mtxuilib/ui/card";
import { Dialog } from "mtxuilib/ui/dialog";

export const BlogListView = () => {
  const tenant = useTenant();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [rotate, setRotate] = useState(false);
  const tenantBlogListQuery = useSuspenseQuery({
    ...blogListOptions({
      path: {
        tenant: tenant.metadata.id,
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
        <CardTitle>No Registered Workflows</CardTitle>
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
  const createBlogMutation = useMutation({
    ...blogCreateMutation(),
  });

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
    <Button
      key="create-event"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        setShowCreateBlog(true);
      }}
      variant={"default"}
      aria-label="Create new event"
    >
      <PlusCircleIcon className="h-4 w-4" />
    </Button>,
  ];

  const [createBlogFieldErrors, setCreateBlogFieldErrors] = useState<
    Record<string, string>
  >({});
  if (tenantBlogListQuery.isLoading) {
    return <MtLoading />;
  }
  return (
    <>
      <Dialog
        open={showCreateBlog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateBlog(false);
          }
        }}
      >
        <CreateBlogForm
          onSubmit={(data) => {
            createBlogMutation.mutate({
              path: {
                tenant: tenant.metadata.id,
              },
              body: {
                ...data,
              },
            });
          }}
          isLoading={createBlogMutation.isPending}
          fieldErrors={createBlogFieldErrors}
        />
      </Dialog>

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
                component: Blogcard,
              }
            : undefined
        }
      />
    </>
  );
};
