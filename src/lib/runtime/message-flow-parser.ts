import { camelToDashCase } from "mtxuilib/lib/utils";
import type {
  ActionType,
  BoltAction,
  BoltActionData,
  FileAction,
  ShellAction,
} from "../../types/actions";
import type { BoltArtifactData } from "../../types/artifact.ts--";

import { unreachable } from "../utils/unreachable.ts--";

const ARTIFACT_TAG_OPEN = "<mtmai_response";
const ARTIFACT_TAG_CLOSE = "</mtmai_response>";
const ARTIFACT_ACTION_TAG_OPEN = "<mtmai_msg";
const ARTIFACT_ACTION_TAG_CLOSE = "</mtmai_msg>";

// const logger = createScopedLogger("FlowMessageParser");

export interface ArtifactCallbackData extends BoltArtifactData {
  messageId: string;
}

export interface ActionCallbackData {
  artifactId: string;
  messageId: string;
  actionId: string;
  action: BoltAction;
}

export type ArtifactCallback = (data: ArtifactCallbackData) => void;
export type ActionCallback = (data: ActionCallbackData) => void;

export interface ParserCallbacks {
  onArtifactOpen?: ArtifactCallback;
  onArtifactClose?: ArtifactCallback;
  onActionOpen?: ActionCallback;
  onActionClose?: ActionCallback;
}

interface ElementFactoryProps {
  messageId: string;
}

type ElementFactory = (props: ElementFactoryProps) => string;

export interface StreamingMessageParserOptions {
  callbacks?: ParserCallbacks;
  artifactElement?: ElementFactory;
}

interface MessageState {
  position: number;
  insideArtifact: boolean;
  insideAction: boolean;
  currentArtifact?: BoltArtifactData;
  currentAction: BoltActionData;
  actionId: number;
}

export class StreamingFlowMessageParser {
  #messages = new Map<string, MessageState>();

  constructor(private _options: StreamingMessageParserOptions = {}) {}

  parse(messageId: string, input: string, callbacks: ParserCallbacks) {
    let state = this.#messages.get(messageId);

    // 初始化消息状态，如果该消息ID不存在
    if (!state) {
      state = {
        position: 0,
        insideAction: false,
        insideArtifact: false,
        currentAction: { content: "" },
        actionId: 0,
      };

      this.#messages.set(messageId, state);
    }

    let output = "";
    let i = state.position;
    let earlyBreak = false;
    // 主循环：逐字符解析输入
    while (i < input.length) {
      console.log("flow mesage i", i);
      // 如果当前在artifact标签内
      if (state.insideArtifact) {
        const currentArtifact = state.currentArtifact;

        if (currentArtifact === undefined) {
          unreachable("Artifact not initialized");
        }

        // 如果当前在action标签内
        if (state.insideAction) {
          const closeIndex = input.indexOf(ARTIFACT_ACTION_TAG_CLOSE, i);

          const currentAction = state.currentAction;

          // 如果找到action结束标签
          if (closeIndex !== -1) {
            console.log("找到action结束标签", closeIndex, ARTIFACT_ACTION_TAG_CLOSE);
            // 提取action内容并处理
            currentAction.content += input.slice(i, closeIndex);

            let content = currentAction.content.trim();

            if ("type" in currentAction && currentAction.type === "file") {
              content += "\n";
            }

            currentAction.content = content;

            // 触发action关闭回调
            console.log("触发action关闭回调", currentAction);
            // this._options.callbacks?.onActionClose?.({
            callbacks.onActionClose?.({
              artifactId: currentArtifact.id,
              messageId,
              actionId: String(state.actionId - 1),
              action: currentAction as BoltAction,
            });

            // 重置action相关状态
            state.insideAction = false;
            state.currentAction = { content: "" };

            i = closeIndex + ARTIFACT_ACTION_TAG_CLOSE.length;
          } else {
            break;
          }
        } else {
          // 寻找下一个action开始标签或artifact结束标签
          const actionOpenIndex = input.indexOf(ARTIFACT_ACTION_TAG_OPEN, i);
          const artifactCloseIndex = input.indexOf(ARTIFACT_TAG_CLOSE, i);

          // 如果找到action开始标签，且在artifact结束标签之前
          if (
            actionOpenIndex !== -1 &&
            (artifactCloseIndex === -1 || actionOpenIndex < artifactCloseIndex)
          ) {
            const actionEndIndex = input.indexOf(">", actionOpenIndex);

            if (actionEndIndex !== -1) {
              // 进入action处理状态
              state.insideAction = true;

              // 解析action标签
              state.currentAction = this.#parseActionTag(input, actionOpenIndex, actionEndIndex);

              // 触发action开始回调
              console.log("触发action开始回调", state.currentAction);
              // this._options.callbacks?.onActionOpen?.({
              callbacks.onActionOpen?.({
                artifactId: currentArtifact.id,
                messageId,
                actionId: String(state.actionId++),
                action: state.currentAction as BoltAction,
              });

              i = actionEndIndex + 1;
            } else {
              break;
            }
          } else if (artifactCloseIndex !== -1) {
            // 如果找到artifact结束标签
            // 触发artifact关闭回调
            // this._options.callbacks?.onArtifactClose?.({
            callbacks.onArtifactClose?.({
              messageId,
              ...currentArtifact,
            });

            // 重置artifact相关状态
            state.insideArtifact = false;
            state.currentArtifact = undefined;

            i = artifactCloseIndex + ARTIFACT_TAG_CLOSE.length;
          } else {
            break;
          }
        }
      } else if (input[i] === "<" && input[i + 1] !== "/") {
        // 检查是否是潜在的artifact开始标签
        let j = i;
        let potentialTag = "";

        // 尝试匹配artifact开始标签
        while (j < input.length && potentialTag.length < ARTIFACT_TAG_OPEN.length) {
          potentialTag += input[j];

          if (potentialTag === ARTIFACT_TAG_OPEN) {
            console.log("潜在的标签", potentialTag);
            const nextChar = input[j + 1];

            // 验证标签的有效性
            if (nextChar && nextChar !== ">" && nextChar !== " ") {
              output += input.slice(i, j + 1);
              i = j + 1;
              break;
            }

            const openTagEnd = input.indexOf(">", j);

            if (openTagEnd !== -1) {
              // 解析artifact标签
              const artifactTag = input.slice(i, openTagEnd + 1);

              const artifactTitle = this.#extractAttribute(artifactTag, "title") as string;
              const artifactId = this.#extractAttribute(artifactTag, "id") as string;

              if (!artifactTitle) {
                // logger.warn("Artifact title missing");
              }

              if (!artifactId) {
                // logger.warn("Artifact id missing");
              }

              // 进入artifact处理状态
              state.insideArtifact = true;

              const currentArtifact = {
                id: artifactId,
                title: artifactTitle,
              } satisfies BoltArtifactData;

              state.currentArtifact = currentArtifact;

              // 触发artifact开始回调
              this._options.callbacks?.onArtifactOpen?.({
                messageId,
                ...currentArtifact,
              });

              // 创建artifact元素
              const artifactFactory = this._options.artifactElement ?? createArtifactElement;

              output += artifactFactory({ messageId });

              i = openTagEnd + 1;
            } else {
              earlyBreak = true;
            }

            break;
          }
          if (!ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
            output += input.slice(i, j + 1);
            i = j + 1;
            break;
          }
          j++;
        }

        if (j === input.length && ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
          break;
        }
      } else {
        // 如果不是特殊标签，直接添加到输出
        output += input[i];
        i++;
      }

      if (earlyBreak) {
        break;
      }
    }

    // 更新解析位置
    state.position = i;
    if (process.env.NODE_ENV === "development") {
      console.log("flow parsed:", output);
    }
    return output;
  }

  reset() {
    this.#messages.clear();
  }

  #parseActionTag(input: string, actionOpenIndex: number, actionEndIndex: number) {
    const actionTag = input.slice(actionOpenIndex, actionEndIndex + 1);

    const actionType = this.#extractAttribute(actionTag, "type") as ActionType;

    const actionAttributes = {
      type: actionType,
      content: "",
    };

    if (actionType === "file") {
      const filePath = this.#extractAttribute(actionTag, "filePath") as string;

      if (!filePath) {
        console.debug("File path not specified");
      }
      (actionAttributes as FileAction).filePath = filePath;
    } else if (actionType !== "shell") {
      console.warn(`Unknown action type '${actionType}'`);
    }

    console.log("parseActionTag", actionAttributes);
    return actionAttributes as FileAction | ShellAction;
  }

  #extractAttribute(tag: string, attributeName: string): string | undefined {
    const match = tag.match(new RegExp(`${attributeName}="([^"]*)"`, "i"));
    return match ? match[1] : undefined;
  }
}

const createArtifactElement: ElementFactory = (props) => {
  console.log("createArtifactElement", props);
  const elementProps = [
    'class="__boltArtifact__"',
    ...Object.entries(props).map(([key, value]) => {
      return `data-${camelToDashCase(key)}=${JSON.stringify(value)}`;
    }),
  ];

  return `<div ${elementProps.join(" ")}></div>`;
};

// function camelToDashCase(input: string) {
//   return input.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
// }
