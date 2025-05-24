"use client";
import { ImageNoExist } from "mtxuilib/routes/mtapp.common";
import { MtImage } from "mtxuilib/common/MtImage";
export const BlogPostContent = (props: {
  post;
}) => {
  const { post } = props;
  return (
    <article className="prose dark:prose-invert p-2">
      <h1 className="mt-6">{post.title}</h1>
      <section>
        {/* eslint-disable @next/next/no-img-element */}
        <MtImage
          src={post.topImage || ImageNoExist}
          alt={post.title}
          width={100}
          height={100}
        />
      </section>
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: post.content || "missing content" }}
      />
    </article>
  );
};
