"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";
import { Skeleton } from "mtxuilib/ui/skeleton";

export function RunningTaskSkeleton() {
  // 4 cards with skeletons for each part
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-6 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-24" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-24" />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-6 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-24" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-24" />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-6 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-24" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-24" />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-6 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-24" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-24" />
        </CardFooter>
      </Card>
    </>
  );
}
