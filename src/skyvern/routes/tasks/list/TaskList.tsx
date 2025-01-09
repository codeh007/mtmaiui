"use client";

import { PlusIcon } from "@radix-ui/react-icons";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { Icons } from "mtxuilib/icons/icons";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";
import Link from "next/link";
import { Suspense } from "react";
import { QueuedTasks } from "../running/QueuedTasks";
import { RunningTasks } from "../running/RunningTasks";
import { TaskHistory } from "./TaskHistory";

export function TaskList() {
  return (
    <div className="space-y-8">
      <header className="flex justify-end">
        <Button asChild>
          <Link href="/create">
            <PlusIcon className="mr-2 h-4 w-4" />
            新建任务
          </Link>
        </Button>
      </header>
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle className="text-xl">运行中的任务</CardTitle>
          <CardDescription>当前正在运行的任务</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <Suspense fallback={<Icons.reload className="animate-spin" />}>
              <MtErrorBoundary>
                <RunningTasks />
              </MtErrorBoundary>
            </Suspense>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle className="text-xl">等待运行的任务</CardTitle>
          <CardDescription>等待运行的任务</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Suspense fallback={<Icons.reload className="animate-spin" />}>
            <MtErrorBoundary>
              <QueuedTasks />
            </MtErrorBoundary>
          </Suspense>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle className="text-xl">运行过的任务</CardTitle>
          <CardDescription>运行过的任务</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <MtErrorBoundary>
            <TaskHistory />
          </MtErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
