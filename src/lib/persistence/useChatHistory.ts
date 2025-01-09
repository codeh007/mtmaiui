"use client";
import type { Message } from "ai";
import { atom } from "nanostores";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMessages, getNextId, openDatabase, setMessages } from "./db";
import { useMtRouter } from "mtxuilib/hooks/use-router";

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

export const chatId = atom<string | undefined>(undefined);
export const description = atom<string | undefined>(undefined);
const persistenceEnabled = false;

export const useDb = () => {
  const [db, setDb] = useState<IDBDatabase | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined" || !persistenceEnabled) {
      return;
    }

    openDatabase()
      .then((database) => {
        setDb(database);
      })
      .catch((error) => {
        console.error("Failed to open database:", error);
        toast.error("Failed to open database");
      });
  }, []);

  return db;
};
export function useChatHistory() {
  const db = useDb();
  const router = useMtRouter();
  // const { id: mixedId } = useLoaderData<{ id?: string }>();

  const mixedId = undefined;

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [urlId, setUrlId] = useState<string | undefined>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!db) {
      setReady(true);

      if (persistenceEnabled) {
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        toast.error(`Chat persistence is unavailable`);
      }

      return;
    }

    if (mixedId) {
      getMessages(db, mixedId)
        .then((storedMessages) => {
          if (storedMessages && storedMessages.messages.length > 0) {
            setInitialMessages(storedMessages.messages);
            setUrlId(storedMessages.urlId);
            description.set(storedMessages.description);
            chatId.set(storedMessages.id);
          } else {
            router.push("/");
          }

          setReady(true);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, []);

  return {
    ready: !mixedId || ready,
    initialMessages,
    storeMessageHistory: async (messages: Message[]) => {
      if (!db || messages.length === 0) {
        return;
      }

      // const { firstArtifact } = workbenchStore;

      // if (!urlId && firstArtifact?.id) {
      //   const urlId = await getUrlId(db, firstArtifact.id);

      //   navigateChat(urlId);
      //   setUrlId(urlId);
      // }

      if (!description.get() && firstArtifact?.title) {
        description.set(firstArtifact?.title);
      }

      if (initialMessages.length === 0 && !chatId.get()) {
        if (db) {
          console.log("db", db);
          const nextId = await getNextId(db);

          chatId.set(nextId);

          if (!urlId) {
            navigateChat(nextId);
          }
        }
      }

      if (db) {
        await setMessages(
          db,
          chatId.get() as string,
          messages,
          urlId,
          description.get(),
        );
      }
    },
  };
}

function navigateChat(nextId: string) {
  /**
   * FIXME: Using the intended navigate function causes a rerender for <Chat /> that breaks the app.
   *
   * `navigate(`/chat/${nextId}`, { replace: true });`
   */
  const url = new URL(window.location.href);
  url.pathname = `/chat/${nextId}`;

  window.history.replaceState({}, "", url);
}
