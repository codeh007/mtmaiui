import { useDroppable } from "@dnd-kit/core";
import {
  BaseEdge,
  type EdgeProps,
  Handle,
  type NodeProps,
  Position,
  getBezierPath,
} from "@xyflow/react";
import {
  Bot,
  Brain,
  Edit,
  type LucideIcon,
  Timer,
  Trash2Icon,
  Users,
  Wrench,
} from "lucide-react";
import type { Component } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import type React from "react";
import { memo } from "react";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";
import { TruncatableText } from "../../atoms";
import type {
  ComponentConfig,
  ComponentTypes
} from "../../types/datamodel";
import {
  isAssistantAgent,
  isSelectorTeam,
  isWebSurferAgent,
} from "../../types/guards";
import type { CustomNode } from "./types";

interface NodeHandleProps {
  type: "source" | "target";
  position: Position;
  id: string;
  className?: string;
}

const NodeHandle = ({ type, position, id, className }: NodeHandleProps) => {
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      className={cn("w-1 h-3 rounded-l-sm -mr-1 border-0", className)}
    />
  );
};

// Icon mapping for different node types
export const iconMap: Record<
  Component<ComponentConfig>["component_type"],
  LucideIcon
> = {
  team: Users,
  agent: Bot,
  tool: Wrench,
  model: Brain,
  termination: Timer,
};

interface DroppableZoneProps {
  accepts: ComponentTypes[];
  children?: React.ReactNode;
  className?: string;
  id: string; // Add this to make each zone uniquely identifiable
}

const DroppableZone = memo<DroppableZoneProps>(
  ({ accepts, children, className, id }) => {
    const { isOver, setNodeRef, active } = useDroppable({
      id,
      data: { accepts },
    });

    // Fix the data path to handle nested current objects
    const isValidDrop =
      isOver &&
      active?.data?.current?.current?.type &&
      accepts.includes(active.data.current.current.type);

    return (
      <div
        ref={setNodeRef}
        className={cn(
          "droppable-zone p-2",
          isValidDrop
            ? "border-dashed border-2 border-accent bg-green-500/10"
            : "",
          className || "",
        )}
      >
        {children}
      </div>
    );
  },
);
DroppableZone.displayName = "DroppableZone";

// Base node layout component
interface BaseNodeProps extends NodeProps<CustomNode> {
  id: string;
  icon: LucideIcon;
  children?: React.ReactNode;
  headerContent?: React.ReactNode;
  descriptionContent?: React.ReactNode;
  className?: string;
  // onEditClick?: (id: string) => void;
}

const BaseNode = memo<BaseNodeProps>(
  ({
    id,
    data,
    selected,
    dragHandle,
    icon: Icon,
    children,
    headerContent,
    descriptionContent,
    className,
    // onEditClick,
  }) => {
    const removeNode = useTeamBuilderStore((state) => state.removeNode);
    const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
    const showDelete = data.type !== "team";
    const componentId = useTeamBuilderStore((x) => x.componentId);

    return (
      <div
        ref={dragHandle}
        className={`
        bg-white relative rounded-lg shadow-lg w-72 
        ${selected ? "ring-2 ring-accent" : ""}
        ${className || ""} 
        transition-all duration-200
      `}
      >
        <div className="border-b p-3 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Icon className="flex-shrink-0 w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800 truncate">
                {data.component.label}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs px-2 py-1 bg-gray-200 rounded text-gray-700">
                {data.component.component_ype}
              </span>
              <CustomLink
                to={`/coms/${componentId}/component_editor`}
                className={cn(
                  "p-1 hover:bg-secondary rounded",
                  buttonVariants({ variant: "outline" }),
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(id);
                }}
              >
                <Edit className="size-4" />
              </CustomLink>
              {showDelete && (
                <Button
                  onClick={(e) => {
                    console.log("remove node", id);
                    e.stopPropagation();
                    if (id) removeNode(id);
                  }}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              )}
            </div>
          </div>
          {headerContent}
        </div>

        <div className="px-3 py-2 border-b text-sm text-gray-600">
          {descriptionContent}
        </div>

        <div className="p-3 space-y-2">{children}</div>
      </div>
    );
  },
);

BaseNode.displayName = "BaseNode";

// Reusable components
const NodeSection: React.FC<{
  title: string | React.ReactNode;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="space-y-1 relative">
    <h4 className="text-xs font-medium text-gray-500 uppercase">{title}</h4>
    <div className="bg-gray-50 rounded p-2">{children}</div>
  </div>
);

const ConnectionBadge: React.FC<{
  connected: boolean;
  label: string;
}> = ({ connected, label }) => (
  <span
    className={`
      text-xs px-2 py-1 rounded-full
      ${connected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
    `}
  >
    {label}
  </span>
);

// Team Node
export const TeamNode = memo<NodeProps<CustomNode>>((props) => {
  const component = props.data.component as MtComponent;
  const hasModel = isSelectorTeam(component) && !!component.config.model_client;
  const participantCount = component.config.participants?.length || 0;
  const componentId = useTeamBuilderStore((x) => x.componentId);
  return (
    <BaseNode
      {...props}
      icon={iconMap.team}
      headerContent={
        <div className="flex gap-2 mt-2">
          <ConnectionBadge connected={hasModel} label="Model" />
          <ConnectionBadge
            connected={participantCount > 0}
            label={`${participantCount} Agent${
              participantCount > 1 ? "s" : ""
            }`}
          />
        </div>
      }
      descriptionContent={
        <div>
          <div>
            <TruncatableText
              content={component.description || component.label || ""}
              textThreshold={150}
              showFullscreen={false}
            />
          </div>
          {isSelectorTeam(component) && component.config.selector_prompt && (
            <div className="mt-1 text-xs">
              Selector:{" "}
              <TruncatableText
                content={component.config.selector_prompt}
                textThreshold={150}
                showFullscreen={false}
              />
            </div>
          )}
        </div>
      }
    >
      {isSelectorTeam(component) && (
        <NodeSection title="Model">
          {/* <Handle
            type="target"
            position={Position.Left}
            id={`${props.id}-model-input-handle`}
            className="my-left-handle"
          /> */}

          <div className="relative">
            {hasModel && (
              <div className="text-sm">
                {component.config.model_client.config.model}
              </div>
            )}
            <DroppableZone id={`${props.id}@@@model-zone`} accepts={["model"]}>
              <div className="text-xs my-1 text-center">Drop model here</div>
            </DroppableZone>
          </div>
        </NodeSection>
      )}

      <NodeSection
        title={
          <div>
            Agents
            <span className="text-xs text-accent">({participantCount})</span>
          </div>
        }
      >
        {/* <Handle
          type="source"
          position={Position.Right}
          id={`${props.id}-agent-output-handle`}
          className="w-1 h-3 rounded-l-sm -mr-1 border-0"
        /> */}
        <NodeHandle
          type="source"
          position={Position.Right}
          id={`${props.id}-agent-output-handle`}
          // className="w-1 h-3 rounded-l-sm -mr-1 border-0"
        />
        <div className="space-y-1">
          {component.config.participants?.map((participant, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className="relative text-sm py-1 px-2 bg-white rounded flex items-center gap-2"
            >
              <Brain className="size-4 text-gray-500" />
              <span>
                {participant.config.name}
                <CustomLink
                  to={`/coms/${componentId}/team_builder/component`}
                  className={cn(
                    "rounded",
                    buttonVariants({ variant: "outline", size: "icon" }),
                  )}
                >
                  <Edit className="size-4" />{" "}
                </CustomLink>
                <DebugValue data={participant} />
              </span>
            </div>
          ))}
          <DroppableZone id={`${props.id}@@@agent-zone`} accepts={["agent"]}>
            <div className="text-xs my-1 text-center">Drop agents here</div>
          </DroppableZone>
        </div>
      </NodeSection>

      <NodeSection title="Terminations">
        {/* {
          <Handle
            type="target"
            position={Position.Left}
            id={`${props.id}-termination-input-handle`}
            className="my-left-handle"
          />
        } */}
        <div className="space-y-1">
          {component.config.termination_condition && (
            <div className="text-sm py-1 px-2 bg-white rounded flex items-center gap-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <span>
                {component.config.termination_condition.label ||
                  component.config.termination_condition.component_type}
              </span>
            </div>
          )}
          <DroppableZone
            id={`${props.id}@@@termination-zone`}
            accepts={["termination"]}
          >
            <div className="text-xs my-1 text-center">拖放终结条件到此</div>
          </DroppableZone>
        </div>
      </NodeSection>
    </BaseNode>
  );
});

TeamNode.displayName = "TeamNode";

export const AgentNode = memo<NodeProps<CustomNode>>((props) => {
  const component = props.data.component as MtComponent;
  const hasModel =
    isAssistantAgent(component) && !!component.config.model_client;
  const toolCount = isAssistantAgent(component)
    ? component.config.tools?.length || 0
    : 0;

  return (
    <BaseNode
      {...props}
      icon={iconMap.agent}
      headerContent={
        <div className="flex gap-2 mt-2">
          {isAssistantAgent(component) && (
            <>
              <ConnectionBadge connected={hasModel} label="Model" />
              <ConnectionBadge
                connected={toolCount > 0}
                label={`${toolCount} Tools`}
              />
            </>
          )}
        </div>
      }
      descriptionContent={
        <div>
          <div className="break-words truncate mb-1">
            {component.config.name}
          </div>
          <div className="break-words"> {component.description}</div>
        </div>
      }
    >
      <Handle
        type="target"
        position={Position.Left}
        id={`${props.id}-agent-input-handle`}
        className="w-1 h-3 rounded-r-sm -ml-1 border-0 z-100"
      />

      {(isAssistantAgent(component) || isWebSurferAgent(component)) && (
        <>
          <NodeSection title="Model">
            {/* <Handle
              type="target"
              position={Position.Left}
              id={`${props.id}-model-input-handle`}
              className="my-left-handle"
            /> */}

            <div className="relative">
              {component.config?.model_client && (
                <div className="text-sm">
                  {component.config?.model_client.config?.model}
                </div>
              )}
              <DroppableZone
                id={`${props.id}@@@model-zone`}
                accepts={["model"]}
              >
                <div className="text-xs my-1 text-center">Drop model here</div>
              </DroppableZone>
            </div>
          </NodeSection>

          {isAssistantAgent(component) && (
            <NodeSection title="Tools">
              <div className="space-y-1">
                {component.config.tools && toolCount > 0 && (
                  <div className="space-y-1">
                    {component.config.tools.map((tool, index) => (
                      <div
                        key={index}
                        className="relative text-sm py-1 px-2 bg-white rounded flex items-center gap-2"
                      >
                        <Wrench className="w-4 h-4 text-gray-500" />
                        <span>{tool.config.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <DroppableZone
                  id={`${props.id}@@@tool-zone`}
                  accepts={["tool"]}
                >
                  <div className="text-xs my-1 text-center">
                    Drop tools here
                  </div>
                </DroppableZone>
              </div>
            </NodeSection>
          )}
        </>
      )}
    </BaseNode>
  );
});

AgentNode.displayName = "AgentNode";

// Export all node types
export const nodeTypes = {
  team: TeamNode,
  agent: AgentNode,
};

const EDGE_STYLES = {
  "model-connection": { stroke: "rgb(220,220,220)" },
  "tool-connection": { stroke: "rgb(220,220,220)" },
  "agent-connection": { stroke: "rgb(220,220,220)" },
  "termination-connection": { stroke: "rgb(220,220,220)" },
} as const;

type EdgeType = keyof typeof EDGE_STYLES;
type CustomEdgeProps = EdgeProps & {
  type: EdgeType;
};

export const CustomEdge = ({
  type,
  data,
  deletable,
  ...props
}: CustomEdgeProps) => {
  const [edgePath] = getBezierPath(props);
  const edgeType = type || "model-connection";

  // Extract only the SVG path properties we want to pass
  const { style: baseStyle, ...pathProps } = props;
  const {
    // Filter out the problematic props
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    sourceHandleId,
    targetHandleId,
    pathOptions,
    selectable,
    ...validPathProps
  } = pathProps;

  return (
    <BaseEdge
      path={edgePath}
      style={{ ...EDGE_STYLES[edgeType], strokeWidth: 2 }}
      {...validPathProps}
    />
  );
};

export const edgeTypes = {
  "model-connection": CustomEdge,
  "tool-connection": CustomEdge,
  "agent-connection": CustomEdge,
  "termination-connection": CustomEdge,
};
