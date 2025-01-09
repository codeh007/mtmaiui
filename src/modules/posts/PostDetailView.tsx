"use client";

import type { BlogPostDetailResponse } from "mtmaiapi";

interface PostDetailViewProps {
  post: BlogPostDetailResponse;
}
export const PostDetailView = (props: PostDetailViewProps) => {
  const { post } = props;
  return (
    <div className="prose dark:prose-invert">
      <h1>{post.title}</h1>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};
