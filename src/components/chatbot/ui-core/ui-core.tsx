import { ChevronsUpDown } from "lucide-react";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

import { type Renderable, flexRender } from "mtxuilib/lib/render";
import { Button } from "mtxuilib/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "mtxuilib/ui/collapsible";
import { useState } from "react";
import { AiCompletion } from "../ui-messages/AiCompletion.tsx--";
import { ArtifactCode } from "../ui-messages/ArtifactCode";
import { ArtifactSearchResults } from "../ui-messages/ArtifactSearchResults";
import { ArtifactTaskSelect } from "../ui-messages/ArtifactTaskSelect";
import { DocsAdminPanel } from "../ui-messages/DocAdminPanel";
import { Image } from "../ui-messages/Image.tsx--";
import { UserInputMessage } from "../ui-messages/UserInputMessage";

export const UiItem = (props: {
  item: UiMessagesItem;
  variant?: "sidebar" | "mainscreen";
}) => {
  const { item, variant = "sidebar" } = props;

  const Component = getComponent(item.component || "");

  return <>{flexRender(Component, item.props)}</>;
};

export function getComponent(name: string): Renderable<any> {
  switch (name) {
    case "Image":
      return Image;
    case "UserMessage":
      return UserInputMessage;
    case "AiCompletion":
      return AiCompletion;
    case "Document":
      return DocumentEditor;
    case "DocumentEditor":
      return DocumentEditor;
    // case "TriggerButton":
    // 	return TriggerButton;
    case "DocsAdminPanel":
      return DocsAdminPanel;
    case "AdminView":
      return AdminView;
    case "ArtifactSearchResults":
      return ArtifactSearchResults;
    case "Code":
      return ArtifactCode;
    case "TaskSelect":
      return ArtifactTaskSelect;

    default:
      return (
        <div className="bg-orange-300 p-2">
          <DebugValue data={{ name }} title="出错: 未知的客户端组件" />
        </div>
      );
  }
}

export const renderChildren = (props: any) => {
  const componentName = props.component;
  if (!componentName) {
    return (
      <div> 出错： renderChildren missing componentName: {componentName} </div>
    );
  }
  const Component = getComponent(componentName);
  return <>{flexRender(Component, props.props)}</>;
};

export const renderArtiface = (props: any) => {
  const componentName = props.artiface_type;
  if (!componentName) {
    return (
      <div>
        <DebugValue
          data={{ props }}
          title={`出错,未知的Artiface组件: ${componentName} `}
        />
      </div>
    );
  }
  const Component = getComponent(componentName);
  return <>{flexRender(Component, props.props)}</>;
};

export interface ArticleFaceItemProps {
  artiface_type: string;
  title?: string;
  description?: string;
  props;
}
export const ArticleFaceItem = (props: ArticleFaceItemProps) => {
  const { artiface_type, title, description } = props;
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="relative w-full space-y-2 border-muted sm:rounded-lg sm:border shadow-xs"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-1 px-2 cursor-pointer">
          <h4 className="text-sm font-semibold">{title}</h4>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {renderArtiface(props)}
      </CollapsibleContent>
    </Collapsible>
  );
};
