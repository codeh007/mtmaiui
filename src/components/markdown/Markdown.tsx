"use client";
import Link from "next/link";
import { memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { BundledLanguage } from "shiki";
import {
  allowedHTMLElements,
  rehypePlugins,
  remarkPlugins,
} from "../../lib/utils/markdown";
import { Artifact } from "../chat/Artifact";
import { AskHuman } from "./AskHuman";
import { CodeBlock } from "./CodeBlock";
import styles from "./Markdown.module.scss";

interface MarkdownProps {
  children: string;
  html?: boolean;
  limitedMarkdown?: boolean;
  // refElements?: IMessageElement[];
}

export const NonMemoizedMarkdown = ({
  children,
  html = false,
  limitedMarkdown = false,
  refElements,
}: MarkdownProps) => {
  // logger.trace("Render");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const components = useMemo(() => {
    return {
      askhuman: ({ className, children, node, ...props }) => {
        return (
          <>
            <AskHuman className={className} {...props} />
          </>
        );
      },
      a({ children, ...props }) {
        // 参考 chainlit 前端的  markdown 实现。
        const name = children as string;
        const element = refElements?.find((e) => e.name === name);

        if (element) {
          return <ElementRef element={element} />;
        }
        return (
          <Link {...props} target="_blank" href="">
            {children}
          </Link>
        );
      },
      div: ({ className, children, node, ...props }) => {
        if (className?.includes("__boltArtifact__")) {
          const messageId = node?.properties.dataMessageId as string;

          if (!messageId) {
            // logger.error(`Invalid message id ${messageId}`);
          }

          return <Artifact messageId={messageId} />;
        }
        if (className?.includes("__boltAskHuman__")) {
          const title = node?.properties.title as string;

          if (!title) {
            // logger.error(`Invalid ask human title ${title}`);
          }

          return <AskHuman title={"title1"} />;
        }

        return (
          <div className={className} {...props}>
            {children}
          </div>
        );
      },
      pre: (props) => {
        const { children, node, ...rest } = props;

        const [firstChild] = node?.children ?? [];

        if (
          firstChild &&
          firstChild.type === "element" &&
          firstChild.tagName === "code" &&
          firstChild.children[0].type === "text"
        ) {
          const { className, ...rest } = firstChild.properties;
          const [, language = "plaintext"] =
            /language-(\w+)/.exec(String(className) || "") ?? [];

          return (
            <CodeBlock
              code={firstChild.children[0].value}
              language={language as BundledLanguage}
              {...rest}
            />
          );
        }

        return <pre {...rest}>{children}</pre>;
      },

      //=================================================================================
      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <pre
            {...props}
            className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
          >
            <code className={match[1]}>{children}</code>
          </pre>
        ) : (
          <code
            className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
            {...props}
          >
            {children}
          </code>
        );
      },
      ol: ({ node, children, ...props }) => {
        return (
          <ol className="list-decimal list-outside ml-4" {...props}>
            {children}
          </ol>
        );
      },
      li: ({ node, children, ...props }) => {
        return (
          <li className="py-1" {...props}>
            {children}
          </li>
        );
      },
      ul: ({ node, children, ...props }) => {
        return (
          <ul className="list-decimal list-outside ml-4" {...props}>
            {children}
          </ul>
        );
      },
      strong: ({ node, children, ...props }) => {
        return (
          <span className="font-semibold" {...props}>
            {children}
          </span>
        );
      },
      // a: ({ node, children, ...props }) => {
      //   return (
      //     <Link
      //       className="text-blue-500 hover:underline"
      //       target="_blank"
      //       rel="noreferrer"
      //       {...props}
      //     >
      //       {children}
      //     </Link>
      //   );
      // },
      h1: ({ node, children, ...props }) => {
        return (
          <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
            {children}
          </h1>
        );
      },
      h2: ({ node, children, ...props }) => {
        return (
          <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
            {children}
          </h2>
        );
      },
      h3: ({ node, children, ...props }) => {
        return (
          <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
            {children}
          </h3>
        );
      },
      h4: ({ node, children, ...props }) => {
        return (
          <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
            {children}
          </h4>
        );
      },
      h5: ({ node, children, ...props }) => {
        return (
          <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
            {children}
          </h5>
        );
      },
      h6: ({ node, children, ...props }) => {
        return (
          <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
            {children}
          </h6>
        );
      },
    } satisfies Components;
  }, []);

  return (
    <ReactMarkdown
      allowedElements={allowedHTMLElements}
      className={styles.MarkdownContent}
      components={components}
      remarkPlugins={remarkPlugins(limitedMarkdown)}
      rehypePlugins={rehypePlugins(html)}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
