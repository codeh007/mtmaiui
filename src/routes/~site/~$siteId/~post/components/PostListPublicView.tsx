"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { postListPublicOptions } from "mtmaiapi";
export const PostListViewPublic = () => {
  const query = useSuspenseQuery({
    ...postListPublicOptions({}),
  });
  return (
    <div>
      PostListViewPublic
      <pre>{JSON.stringify(query.data, null, 2)}</pre>
    </div>
  );
};
