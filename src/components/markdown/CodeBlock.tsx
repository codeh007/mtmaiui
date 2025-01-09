"use client";
import { memo, useEffect, useState } from "react";
import {
  type BundledLanguage,
  type SpecialLanguage,
  bundledLanguages,
  codeToHtml,
  isSpecialLang,
} from "shiki";

import classNames from "classnames";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import styles from "./CodeBlock.module.scss";

interface CodeBlockProps {
  className?: string;
  code: string;
  language?: BundledLanguage | SpecialLanguage;
  theme?: "light-plus" | "dark-plus";
  disableCopy?: boolean;
}

export const CodeBlock = memo(
  ({
    className,
    code,
    language = "plaintext",
    theme = "dark-plus",
    disableCopy = false,
  }: CodeBlockProps) => {
    const [html, setHTML] = useState<string | undefined>(undefined);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      if (copied) {
        return;
      }

      navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (
        language &&
        !isSpecialLang(language) &&
        !(language in bundledLanguages)
      ) {
        // logger.warn(`Unsupported language '${language}'`);
      }

      // logger.trace(`Language = ${language}`);

      const processCode = async () => {
        setHTML(await codeToHtml(code, { lang: language, theme }));
      };

      processCode();
    }, [code]);

    return (
      <div className={cn("relative group text-left", className)}>
        <div
          className={classNames(
            styles.CopyButtonContainer,
            "bg-white absolute top-[10px] right-[10px] rounded-md z-10 text-lg flex items-center justify-center opacity-0 group-hover:opacity-100",
            {
              "rounded-l-0 opacity-100": copied,
            },
          )}
        >
          {!disableCopy && (
            <button
              type="button"
              className={classNames(
                "flex items-center bg-transparent p-[6px] justify-center before:bg-white before:rounded-l-md before:text-gray-500 before:border-r before:border-gray-300",
                {
                  "before:opacity-0": !copied,
                  "before:opacity-100": copied,
                },
              )}
              title="Copy Code"
              onClick={() => copyToClipboard()}
            >
              <Icons.copy className="text-sm size-4" />
            </button>
          )}
        </div>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />
      </div>
    );
  },
);
