"use client";

import { FitAddon } from "@xterm/addon-fit";
import { Unicode11Addon } from "@xterm/addon-unicode11";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Terminal as XTerm } from "@xterm/xterm";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { getTerminalTheme } from "./theme";

// const logger = createScopedLogger("Terminal");

export interface TerminalRef {
  reloadStyles: () => void;
}

export interface TerminalProps {
  className?: string;
  theme: Theme;
  readonly?: boolean;
  onTerminalReady?: (terminal: XTerm) => void;
  onTerminalResize?: (cols: number, rows: number) => void;
}

export const Terminal = memo(
  forwardRef<TerminalRef, TerminalProps>(
    (
      { className, theme, readonly, onTerminalReady, onTerminalResize },
      ref,
    ) => {
      const terminalElementRef = useRef<HTMLDivElement>(null);
      const terminalRef = useRef<XTerm>();

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const element = terminalElementRef.current!;

        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();

        // 原版配置
        // const terminal = new XTerm({
        // 	cursorBlink: true,
        // 	convertEol: true,
        // 	disableStdin: readonly,
        // 	theme: getTerminalTheme(readonly ? { cursor: "#00000000" } : {}),
        // 	// theme: getTerminalTheme(readonly ? { cursor: "#888888" } : {}),
        // 	fontSize: 12,
        // 	fontFamily: "Menlo, courier-new, courier, monospace",
        // });

        // 新版配置
        const terminal = new XTerm({
          cursorBlink: true,
          convertEol: true,
          disableStdin: readonly,
          theme: getTerminalTheme(readonly ? { cursor: "#00000000" } : {}),
          fontSize: 12,
          fontFamily: "Menlo, courier-new, courier, monospace",
          // 添加以下配置
          allowTransparency: true,
          scrollback: 1000,
          allowProposedApi: true,
          // rendererType: "canvas",

          cols: 80, // 设置初始列数
          rows: 24, // 设置初始行数
        });
        terminal.write;

        terminalRef.current = terminal;

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webLinksAddon);

        // 添加 Unicode11Addon 以更好地支持 Unicode 字符
        const unicode11Addon = new Unicode11Addon();
        terminal.loadAddon(unicode11Addon);
        // activate the new version
        terminal.unicode.activeVersion = "11";

        terminal.open(element);

        const resizeObserver = new ResizeObserver(() => {
          fitAddon.fit();
          onTerminalResize?.(terminal.cols, terminal.rows);
        });

        resizeObserver.observe(element);

        // logger.info("Attach terminal");

        onTerminalReady?.(terminal);

        return () => {
          resizeObserver.disconnect();
          terminal.dispose();
        };
      }, []);

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const terminal = terminalRef.current!;

        // we render a transparent cursor in case the terminal is readonly
        terminal.options.theme = getTerminalTheme(
          readonly ? { cursor: "#00000000" } : {},
        );

        terminal.options.disableStdin = readonly;
      }, [theme, readonly]);

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useImperativeHandle(
        ref,
        () => {
          return {
            reloadStyles: () => {
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              const terminal = terminalRef.current!;
              terminal.options.theme = getTerminalTheme(
                readonly ? { cursor: "#00000000" } : {},
              );
            },
          };
        },
        [],
      );

      return <div className={className} ref={terminalElementRef} />;
    },
  ),
);
