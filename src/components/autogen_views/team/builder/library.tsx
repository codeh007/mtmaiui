import { useDraggable } from "@dnd-kit/core";
import {
  Bot,
  Brain,
  GripVertical,
  Maximize2,
  Minimize2,
  Timer,
  Wrench,
} from "lucide-react";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "mtxuilib/ui/accordion";
import { Button } from "mtxuilib/ui/button";
import React, { useMemo } from "react";
import type { ComponentTypes, Gallery } from "../../types/datamodel";

interface ComponentConfigTypes {
  [key: string]: any;
}

interface PresetItemProps {
  id: string;
  type: ComponentTypes;
  config: ComponentConfigTypes;
  label: string;
  // icon: React.ReactNode;
  className?: string;
}

export const PresetItem = ({
  id,
  type,
  config,
  label,
  className,
}: PresetItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        current: {
          type,
          config,
          label,
        },
      },
    });

  const icon2 = useMemo(() => {
    if (type === "agent") {
      return <Bot className="size-4" />;
    }
    if (type === "model") {
      return <Brain className="size-4" />;
    }
    if (type === "tool") {
      return <Wrench className="size-4" />;
    }
    if (type === "termination") {
      return <Timer className="size-4" />;
    }
    return <Icons.boxes className="size-4" />;
  }, [type]);
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "p-2 text-primary mb-2 border  rounded cursor-move  bg-secondary transition-colors",
        isDragging && "opacity-70",
        "border-dashed border-slate-400",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 inline-block" />
        {icon2}
        <span className=" text-sm">{label}</span>
      </div>
    </div>
  );
};

interface LibraryProps {
  defaultGallery: Gallery;
}

export const ComponentLibrary = ({ defaultGallery }: LibraryProps) => {
  // const [searchTerm, setSearchTerm] = React.useState("");
  const [isMinimized, setIsMinimized] = React.useState(false);

  const exampleAgents = [
    {
      label: "Agent 1",
      config: {
        name: "Agent 1",
      },
    },
    {
      label: "Agent 2",
      config: {
        name: "Agent 2",
      },
    },
  ];
  // Map gallery components to sections format
  const sections = React.useMemo(
    () => [
      {
        title: "Agents",
        type: "agent" as ComponentTypes,
        // items: defaultGallery.config.components?.agents?.map((agent) => ({
        //   label: agent.label,
        //   config: agent,
        // })),
        icon: <Bot className="w-4 h-4" />,
        items: exampleAgents,
      },
      {
        title: "Models",
        type: "model" as ComponentTypes,
        items: defaultGallery.config.components?.models?.map((model) => ({
          label: `${model.label || model.config.model}`,
          config: model,
        })),
        icon: <Brain className="w-4 h-4" />,
      },
      {
        title: "Tools",
        type: "tool" as ComponentTypes,
        items: defaultGallery.config.components?.tools?.map((tool) => ({
          label: tool.config.name,
          config: tool,
        })),
        icon: <Wrench className="w-4 h-4" />,
      },
      {
        title: "Terminations",
        type: "termination" as ComponentTypes,
        items: defaultGallery.config.components?.terminations?.map(
          (termination) => ({
            label: `${termination.label}`,
            config: termination,
          }),
        ),
        icon: <Timer className="w-4 h-4" />,
      },
    ],
    [defaultGallery],
  );

  // const items = sections?.map((section) => {
  //   const filteredItems = section.items?.filter((item) =>
  //     item.label?.toLowerCase().includes(searchTerm.toLowerCase()),
  //   );

  //   return {
  //     key: section.title,
  //     label: (
  //       <div className="flex items-center gap-2 font-medium">
  //         {section.icon}
  //         <span>{section?.title}</span>
  //         <span className="text-xs text-gray-500">
  //           ({filteredItems?.length})
  //         </span>
  //       </div>
  //     ),
  //     children: (
  //       <div className="space-y-2">
  //         {filteredItems?.map((item, itemIndex) => (
  //           <PresetItem
  //             // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
  //             key={itemIndex}
  //             id={`${section?.title?.toLowerCase()}-${itemIndex}`}
  //             type={section?.type}
  //             config={item?.config}
  //             label={item?.label || ""}
  //             icon={section?.icon}
  //           />
  //         ))}
  //       </div>
  //     ),
  //   };
  // });

  if (isMinimized) {
    return (
      <div
        // onClick={() => setIsMinimized(false)}
        className="absolute group top-4 left-4 shadow-md rounded px-4 pr-2 py-2 cursor-pointer transition-all duration-300 z-50 flex items-center gap-2"
      >
        <span>Show Component Library</span>
        <Button
          onClick={() => setIsMinimized(false)}
          className="p-1 group-hover:bg-tertiary rounded transition-colors"
          title="Maximize Library"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[300px] border z-10 mr-2 border-r border-secondary">
      <div className="rounded p-2 pt-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-normal">Component Library</div>
          <Button
            // onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-tertiary rounded transition-colors"
            title="Minimize Library"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
        {/* <div className="flex items-center gap-2 mb-2">
          <Input
            placeholder="Search components..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2"
          />
        </div> */}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="agents">
            <AccordionTrigger>Agents</AccordionTrigger>
            <AccordionContent>
              {exampleAgents.map((agent, index) => (
                <PresetItem
                  key={`${agent.label?.toLowerCase()}-${index}`}
                  id={`${agent.label?.toLowerCase()}-${index}`}
                  type={"agent"}
                  config={agent.config}
                  label={agent.label || ""}
                  icon={<Bot className="w-4 h-4" />}
                />
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tools">
            <AccordionTrigger>Tools</AccordionTrigger>
            <AccordionContent>{/* Tools content */}</AccordionContent>
          </AccordionItem>

          {/* Add more AccordionItems as needed */}
        </Accordion>
      </div>
    </div>
  );
};
