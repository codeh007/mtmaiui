"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "mtxuilib/ui/sheet";

import { useCanGoBack, useLocation, useNavigate, useRouterState } from "@tanstack/react-router";
import type { Gallery } from "mtmaiapi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "mtxuilib/ui/dialog";
import { createContext, useContext, useEffect, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

export interface ModalProps {
  defaultGallery?: Gallery;
  galleries?: Gallery[];
}

type ModalVariant = "modal" | "sheet" | "drawer";
interface ModalState extends ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  backLink: { to: string };
  setBackLink: (backLink: { to: string }) => void;
  variant: ModalVariant;
  setVariant: (variant: ModalVariant) => void;
  children: React.ReactNode;
  setChildren: (children: React.ReactNode) => void;
}
export const createModelStoreSlice: StateCreator<ModalState, [], [], ModalState> = (
  set,
  get,
  init,
) => {
  return {
    open: false,
    setOpen: (open: boolean) => set({ open }),
    backLink: { to: "../.." },
    setBackLink: (backLink: { to: string }) => set({ backLink }),
    variant: "modal",
    setVariant: (variant) => set({ variant }),
    children: null,
    setChildren: (children: React.ReactNode) => set({ children }),
    ...init,
  };
};

const createModalStore = (initProps?: Partial<ModalState>) => {
  return createStore<ModalState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createModelStoreSlice(...a),
          ...initProps,
        })),
        {
          name: "model-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<ReturnType<typeof createModalStore> | null>(null);

type AppProviderProps = React.PropsWithChildren<ModalProps>;
export const ModalProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createModalStore(etc), [etc]);
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
      <ModalDisplay />
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useModelStore(): ModalState;
export function useModelStore<T>(selector: (state: ModalState) => T): T;
export function useModelStore<T>(selector?: (state: ModalState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useModelStore must in ModalProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}

const ModalDisplay = () => {
  const open = useModelStore((x) => x.open);
  const setOpen = useModelStore((x) => x.setOpen);
  const children = useModelStore((x) => x.children);
  const variant = useModelStore((x) => x.variant);
  const backLink = useModelStore((x) => x.backLink);
  const r = useRouterState();
  const n = useNavigate();
  const canGoBack = useCanGoBack();
  const loc = useLocation();

  // const can = useCanGoBack()

  const handleClose = () => {
    setOpen(false);
    // window.history.back();
    // nav({ to: backLink.to });
    if (canGoBack) {
      window.history.back();
    }
  };
  if (variant === "modal") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        {children}
      </Dialog>
    );
  }
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      {children}
    </Sheet>
  );
};

interface TeamBuilderModelWrapperProps {
  children: React.ReactNode;
}
export function MtModal({ children }: TeamBuilderModelWrapperProps) {
  const setOpen = useModelStore((x) => x.setOpen);
  const setChildren = useModelStore((x) => x.setChildren);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(true);
    setChildren(children);
  }, []);
  return null;
}

interface ModelHeaderProps {
  children: React.ReactNode;
}
export const ModelHeader = ({ children }: ModelHeaderProps) => {
  const variant = useModelStore((x) => x.variant);
  if (variant === "modal") {
    return <DialogHeader>{children}</DialogHeader>;
  }
  return <SheetHeader>{children}</SheetHeader>;
};

interface ModelTitleProps {
  children: React.ReactNode;
}
export const ModelTitle = ({ children }: ModelTitleProps) => {
  const variant = useModelStore((x) => x.variant);
  if (variant === "modal") {
    return <DialogTitle>{children}</DialogTitle>;
  }
  return <SheetTitle>{children}</SheetTitle>;
};

interface ModelContentProps {
  children: React.ReactNode;
}
export const ModelContent = ({ children }: ModelContentProps) => {
  const variant = useModelStore((x) => x.variant);
  if (variant === "modal") {
    return (
      <DialogContent className="max-h-lvh overflow-scroll min-w-xl sm:max-w-5xl">
        {children}
      </DialogContent>
    );
  }
  return <SheetContent className="w-full sm:max-w-5xl">{children}</SheetContent>;
};
