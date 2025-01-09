"use client";
import type { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { type WritableAtom, atom } from "nanostores";
import { newShellProcess } from "../lib/utils/shell";
import { coloredText } from "../lib/utils/terminal";
import type { ITerminal } from "../types/terminal";
export class TerminalStore {
  #webcontainer: Promise<WebContainer>;
  #terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }> = [];

  showTerminal: WritableAtom<boolean> = atom(false);

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;
  }

  toggleTerminal(value?: boolean) {
    this.showTerminal.set(
      value !== undefined ? value : !this.showTerminal.get(),
    );
  }

  async attachTerminal(terminal: ITerminal) {
    try {
      const shellProcess = await newShellProcess(
        await this.#webcontainer,
        terminal,
      );
      this.#terminals.push({ terminal, process: shellProcess });
    } catch (error) {
      terminal.write(
        coloredText.red("Failed to spawn shell\n\n") + (error as Error).message,
      );
      return;
    }
  }

  onTerminalResize(cols: number, rows: number) {
    for (const { process } of this.#terminals) {
      process.resize({ cols, rows });
    }
  }
}
