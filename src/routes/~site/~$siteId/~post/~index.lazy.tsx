"use client";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useTenantId } from "../../../../hooks/useAuth";
import { PostListView } from "./PostListView";

export const Route = createLazyFileRoute("/site/$siteId/post/")({
  component: PostListViewComponent,
});

export function PostListViewComponent() {
  const { siteId } = Route.useParams();
  const tid = useTenantId();
  return (
    <div className="flex flex-col gap-2 p-2">
      <PostListView siteId={siteId} tid={tid} />
    </div>
  );
}
