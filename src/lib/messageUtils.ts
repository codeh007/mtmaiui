import { isEqual } from "lodash";
// import type { IMessageElement, IStep, IThread } from "../stores/types";
export const nestMessages = (messages: IStep[]): IStep[] => {
  let nestedMessages: IStep[] = [];

  for (const message of messages) {
    nestedMessages = addMessage(nestedMessages, message);
  }

  return nestedMessages;
};

export const isLastMessage = (messages: IStep[], index: number) => {
  if (messages.length - 1 === index) {
    return true;
  }

  for (let i = index + 1; i < messages.length; i++) {
    if (messages[i].streaming) {
      continue;
    }
    return false;
  }

  return true;
};

// Nested messages utils

export const addMessage = (messages: IStep[], message: IStep): IStep[] => {
  console.log(
    "addMessage",
    `id: ${message.id?.slice(0, 5)} <- pId: ${message.parentId?.slice(0, 5)}:${message.output?.slice(0, 10)}`,
    message,
    messages,
  );
  if (hasMessageById(messages, message.id)) {
    return updateMessageById(messages, message.id, message);
  }
  if ("parentId" in message && message.parentId) {
    return addMessageToParent(messages, message.parentId, message);
  }
  if ("indent" in message && message.indent && message.indent > 0) {
    return addIndentMessage(messages, message.indent, message);
  }
  return [...messages, message];
};

export const addIndentMessage = (
  messages: IStep[],
  indent: number,
  newMessage: IStep,
  currentIndentation = 0,
): IStep[] => {
  const nextMessages = [...messages];
  console.log("addIndentMessage", indent, newMessage, currentIndentation);
  if (nextMessages.length === 0) {
    return [...nextMessages, newMessage];
  }
  const index = nextMessages.length - 1;
  const msg = nextMessages[index];
  msg.steps = msg.steps || [];

  if (currentIndentation + 1 === indent) {
    msg.steps = [...msg.steps, newMessage];
    nextMessages[index] = { ...msg };

    return nextMessages;
  }
  msg.steps = addIndentMessage(
    msg.steps,
    indent,
    newMessage,
    currentIndentation + 1,
  );

  nextMessages[index] = { ...msg };
  return nextMessages;
};

export const addMessageToParent = (
  messages: IStep[],
  parentId: string,
  newMessage: IStep,
): IStep[] => {
  const nextMessages = [...messages];
  console.log("addMessageToParent", parentId, newMessage);
  for (let index = 0; index < nextMessages.length; index++) {
    const msg = nextMessages[index];

    if (isEqual(msg.id, parentId)) {
      msg.steps = msg.steps ? [...msg.steps, newMessage] : [newMessage];
      nextMessages[index] = { ...msg };
    } else if (hasMessageById(nextMessages, parentId) && msg.steps) {
      msg.steps = addMessageToParent(msg.steps, parentId, newMessage);
      nextMessages[index] = { ...msg };
    }
  }

  return nextMessages;
};

export const findMessageById = (
  messages: IStep[],
  messageId: string,
): IStep | undefined => {
  for (const message of messages) {
    if (isEqual(message.id, messageId)) {
      return message;
    }
    if (message.steps && message.steps.length > 0) {
      const foundMessage = findMessageById(message.steps, messageId);
      if (foundMessage) {
        return foundMessage;
      }
    }
  }
  return undefined;
};

export const hasMessageById = (
  messages: IStep[],
  messageId: string,
): boolean => {
  return findMessageById(messages, messageId) !== undefined;
};

export const updateMessageById = (
  messages: IStep[],
  messageId: string,
  updatedMessage: IStep,
): IStep[] => {
  const nextMessages = [...messages];
  // console.log("updateMessageById", messageId, updatedMessage);
  for (let index = 0; index < nextMessages.length; index++) {
    const msg = nextMessages[index];

    if (isEqual(msg.id, messageId)) {
      nextMessages[index] = { steps: msg.steps, ...updatedMessage };
    } else if (hasMessageById(nextMessages, messageId) && msg.steps) {
      msg.steps = updateMessageById(msg.steps, messageId, updatedMessage);
      nextMessages[index] = { ...msg };
    }
  }

  return nextMessages;
};

export const deleteMessageById = (messages: IStep[], messageId: string) => {
  console.debug("deleteMessageById", messageId, messages);
  let nextMessages = [...messages];

  for (let index = 0; index < nextMessages.length; index++) {
    const msg = nextMessages[index];

    if (msg.id === messageId) {
      nextMessages = [
        ...nextMessages.slice(0, index),
        ...nextMessages.slice(index + 1),
      ];
    } else if (hasMessageById(nextMessages, messageId) && msg.steps) {
      msg.steps = deleteMessageById(msg.steps, messageId);
      nextMessages[index] = { ...msg };
    }
  }

  return nextMessages;
};

export const updateMessageContentById = (
  messages: IStep[],
  messageId: number | string,
  updatedContent: string,
  isSequence: boolean,
  isInput: boolean,
): IStep[] => {
  const nextMessages = [...messages];
  console.debug("updateMessageContentById", messageId, updatedContent);
  for (let index = 0; index < nextMessages.length; index++) {
    const msg = nextMessages[index];

    if (isEqual(msg.id, messageId)) {
      if ("content" in msg && msg.content !== undefined) {
        if (isSequence) {
          msg.content = updatedContent;
        } else {
          msg.content += updatedContent;
        }
      } else if (isInput) {
        if ("input" in msg && msg.input !== undefined) {
          if (isSequence) {
            msg.input = updatedContent;
          } else {
            msg.input += updatedContent;
          }
        }
      } else {
        if ("output" in msg && msg.output !== undefined) {
          if (isSequence) {
            msg.output = updatedContent;
          } else {
            msg.output += updatedContent;
          }
        }
      }

      nextMessages[index] = { ...msg };
    } else if (msg.steps) {
      msg.steps = updateMessageContentById(
        msg.steps,
        messageId,
        updatedContent,
        isSequence,
        isInput,
      );
      nextMessages[index] = { ...msg };
    }
  }

  return nextMessages;
};

export const groupByDate = (data: IThread[]) => {
  const groupedData: { [key: string]: IThread[] } = {};

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // biome-ignore lint/complexity/noForEach: <explanation>
  data.forEach((item) => {
    const createdAt = new Date(item.createdAt);
    const isToday = createdAt.toDateString() === today.toDateString();
    const isYesterday = createdAt.toDateString() === yesterday.toDateString();
    const isLast7Days = createdAt >= sevenDaysAgo;
    const isLast30Days = createdAt >= thirtyDaysAgo;

    let category: string;

    if (isToday) {
      category = "Today";
    } else if (isYesterday) {
      category = "Yesterday";
    } else if (isLast7Days) {
      category = "Previous 7 days";
    } else if (isLast30Days) {
      category = "Previous 30 days";
    } else {
      const monthYear = createdAt.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      category = monthYear.split(" ").slice(0, 1).join(" ");
    }

    if (!groupedData[category]) {
      groupedData[category] = [];
    }

    groupedData[category].push(item);
  });

  return groupedData;
};

export const isForIdMatch = (
  id: string | number | undefined,
  forId: string,
) => {
  if (!forId || !id) {
    return false;
  }

  return forId === id.toString();
};

const escapeRegExp = (string: string) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const prepareContent = ({
  elements,
  content,
  id,
  language,
}: {
  elements: IMessageElement[];
  content?: string;
  id: string;
  language?: string;
}) => {
  const elementNames = elements.map((e) => escapeRegExp(e.name));

  // Sort by descending length to avoid matching substrings
  elementNames.sort((a, b) => b.length - a.length);

  const elementRegexp = elementNames.length
    ? new RegExp(`(${elementNames.join("|")})`, "g")
    : undefined;

  let preparedContent = content ? content.trim() : "";
  const inlinedElements = elements.filter(
    (e) => isForIdMatch(id, e?.forId) && e.display === "inline",
  );
  const refElements: IMessageElement[] = [];

  if (elementRegexp) {
    preparedContent = preparedContent.replaceAll(elementRegexp, (match) => {
      const element = elements.find((e) => {
        const nameMatch = e.name === match;
        const scopeMatch = isForIdMatch(id, e?.forId);
        return nameMatch && scopeMatch;
      });
      const foundElement = !!element;

      const inlined = element?.display === "inline";
      if (!foundElement) {
        // Element reference does not exist, return plain text
        return match;
      }
      if (inlined) {
        // If element is inlined, add it to the list and return plain text
        if (inlinedElements.indexOf(element) === -1) {
          inlinedElements.push(element);
        }
        return match;
      }
      // Element is a reference, add it to the list and return link
      refElements.push(element);
      return `[${match}](${match.replaceAll(" ", "_")})`;
    });
  }

  if (language && preparedContent) {
    const prefix = `\`\`\`${language}`;
    const suffix = "```";
    if (!preparedContent.startsWith("```")) {
      preparedContent = `${prefix}\n${preparedContent}\n${suffix}`;
    }
  }
  return {
    preparedContent,
    inlinedElements,
    refElements,
  };
};
