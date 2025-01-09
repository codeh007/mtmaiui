"use client";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { BlogEditView } from "./Blog-Edit";
import { BlogAutoAction } from "./BlogAutoAction";
import { useBlog } from "./blog.hooks";

interface BlogDetailViewProps {
  blogId: string;
}
export const BlogDetailView = (props: BlogDetailViewProps) => {
  const { blogId } = props;

  const blog = useBlog(blogId);

  return (
    <>
      <div className="flex p-2 gap-2">
        <MtSuspenseBoundary>
          <BlogAutoAction blogId={blogId} />
        </MtSuspenseBoundary>
        <DebugValue data={{ data: blog.data }} />
      </div>
      <MtSuspenseBoundary>
        <BlogEditView blogId={blogId} />
      </MtSuspenseBoundary>
    </>
  );
};
