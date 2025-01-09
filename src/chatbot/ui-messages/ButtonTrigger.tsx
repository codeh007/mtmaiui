"use client";

import { ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { renderChildren } from "../ui-core/ui-core";
import { Button } from "mtxuilib/ui/button";
import { DialogTitle } from "mtxuilib/ui/dialog";

interface TriggerButtonProps {
  title: string;
  icon?: string;
  variants?: "fullscreen" | "dlg" | "Collapsible";
  children: any;
}
export const TriggerButton = (props: TriggerButtonProps) => {
  const { title, children, variants } = props;
  const [open, setOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const renderedContent = useMemo(() => {
    switch (variants) {
      case "dlg":
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
              }}
            >
              {title}
            </Button>
            <MtDialog open={open} onOpenChange={setOpen}>
              <MtDialogContent>
                <DialogTitle>{title}</DialogTitle>
                {renderChildren(children)}
              </MtDialogContent>
            </MtDialog>
          </>
        );
      case "fullscreen":
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
              }}
            >
              {title}
            </Button>
            <ScreenPanel open={open} onOpenChange={setOpen}>
              {renderChildren(children)}
            </ScreenPanel>
          </>
        );
      case "Collapsible":
        return (
          <div>
            <span>todo Collapsible</span>
            {renderChildren(children)}
          </div>
        );
      default:
        return (
          <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="w-full space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{title}222</h4>
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {/* <div className="rounded-md border px-4 py-3 font-mono text-sm">
								todo: 其他内容
							</div> */}
              {/* <div className="rounded-md border px-4 py-3 font-mono text-sm"> */}
              {renderChildren(children)}
              {/* </div> */}
            </CollapsibleContent>
          </Collapsible>
        );
    }
  }, [renderChildren, variants, setOpen, open, title, children]);

  // const renderedContent = useCallback(() => {
  // 	switch (variants) {
  // 		case "dlg":
  // 			return (
  // 				<Dialog open={open} onOpenChange={setOpen}>
  // 					<DialogContent>
  // 						<DialogTitle>{title}</DialogTitle>
  // 						{renderChildren(children)}
  // 					</DialogContent>
  // 				</Dialog>
  // 			);
  // 		case "fullscreen":
  // 			return (
  // 				<ScreenPanel open={open} onOpenChange={setOpen}>
  // 					{renderChildren(children)}
  // 				</ScreenPanel>
  // 			);
  // 		default:
  // 			return renderChildren(children);
  // 	}
  // }, [variants, open, title, children, setOpen]);

  return <>{renderedContent}</>;
};
