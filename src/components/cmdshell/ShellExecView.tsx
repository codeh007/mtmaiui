"use client";

import { useEffect, useRef, useState } from "react";

import {
  Terminal,
  type TerminalRef,
} from "../workbench/webcontainer_workbench/terminal/Terminal";
import {
  type MtmaiBotProps,
  XtermProvider,
  useXtermStore,
} from "./xterm.store";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { cn } from "mtxuilib/lib/utils";
import {
  MtTabs,
  MtTabsList,
  MtTabsTrigger,
  MtTabsContent,
} from "mtxuilib/mt/tabs";
import { Button } from "mtxuilib/ui/button";

interface ShellExecViewProps {
  cmdLine: string;
  execApiEndpoint: string;
  label: string;
}
export function ShellExecView({
  cmdLine,
  execApiEndpoint,
  label,
}: ShellExecViewProps) {
  const [listItem, setListItem] = useState([]);

  return (
    <XtermProvider initCmd={cmdLine} wsUrl={execApiEndpoint}>
      <ShellExecViewImpl />
    </XtermProvider>
  );
}

const ShellExecViewImpl = (props: MtmaiBotProps) => {
  const { connected, connecting, error, socket } = useXtermStore();
  const cmd = useXtermStore((x) => x.cmd);
  const listItem = useXtermStore((x) => x.listItem);
  const send = useXtermStore((x) => x.send);
  const initCmd = useXtermStore((x) => x.initCmd);
  const terminalRefs = useRef<Array<TerminalRef | null>>([]);
  const terminalRef = useRef<TerminalRef | null>(null);

  const terminal = useXtermStore((x) => x.terminal);
  const connect = useXtermStore((x) => x.connect);
  const attachTerminal = useXtermStore((x) => x.attachTerminal);
  const theme = "light";

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    connect();
  }, []);

  return (
    <>
      <div className="whitespace-pre font-mono p-4">
        <div className="mb-1 flex flex-row gap-2 items-center justify-end">
          {error ? (
            <span className="text-red-500 ml-2">{error}</span>
          ) : connecting ? (
            <span className="text-yellow-500">正在连接...</span>
          ) : connected ? (
            <Button onClick={() => send(initCmd)}>运行</Button>
          ) : (
            <Button
              onClick={() => {
                console.log("initCmd", initCmd);
                send(initCmd);
              }}
            >
              连接
            </Button>
          )}
          <DebugValue data={{ initCmd }} />
          <Button
            onClick={() => {
              console.log("terminal", terminal);
              terminal?.write("ls");
            }}
          >
            测试2
          </Button>
        </div>

        <MtTabs defaultValue="terminal" className="w-full h-full">
          <MtTabsList className="flex w-full gap-2">
            <MtTabsTrigger value="terminal">终端</MtTabsTrigger>
            <MtTabsTrigger value="messages">消息</MtTabsTrigger>
          </MtTabsList>
          <MtTabsContent value="terminal">
            <div className="h-full overflow-hidden bg-slate-100 border border-slate-300">
              <Terminal
                // key={index}
                className={cn("h-full overflow-hidden", {
                  // hidden: !isActive,
                })}
                ref={(ref) => {
                  terminalRefs.current.push(ref);
                }}
                onTerminalReady={(terminal) => {
                  console.log("onTerminalReady", terminal);
                  // workbenchStore.attachTerminal(terminal)
                  // terminalRef.current = ref;
                  attachTerminal(terminal);
                }}
                onTerminalResize={(cols, rows) => {
                  // workbenchStore.onTerminalResize(cols, rows);
                }}
                theme={theme}
              />
            </div>
          </MtTabsContent>
          <MtTabsContent value="messages">
            {listItem?.length > 0 ? (
              <div className="flex flex-col overflow-y-auto max-h-[600px] whitespace-pre-wrap break-all font-mono text-sm leading-5 bg-black text-gray-200 p-2">
                {listItem?.map((item, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={i} className="min-w-0">
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </MtTabsContent>
        </MtTabs>
      </div>
    </>
  );
};
