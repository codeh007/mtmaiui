"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type Connection,
  type NodeChange,
  type NodeMouseHandler,
  type OnEdgesChange,
  type OnNodesChange,
  addEdge,
} from "@xyflow/react";
import { type DebouncedFunc, debounce, isEqual } from "lodash";
import { type Component, comsGetOptions, comsUpsertMutation } from "mtmaiapi";
import { nanoid } from "nanoid";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type {
  CustomEdge,
  CustomNode,
  GraphState,
  NodeData,
  Position,
} from "../components/autogen_views/team/builder/types";
import {
  convertTeamConfigToGraph,
  getLayoutedElements,
  getUniqueName,
} from "../components/autogen_views/team/builder/utils";
import type {
  // Component,
  // ComponentConfig,
  ComponentTypes,
  TeamConfig,
} from "../components/autogen_views/types/datamodel";
import {
  isAgentComponent,
  isAssistantAgent,
  isModelComponent,
  isSelectorTeam,
  isTeamComponent,
  isTerminationComponent,
  isToolComponent,
  isWebSurferAgent,
} from "../components/autogen_views/types/guards";
import type { useNav } from "../hooks/useNav";
import type { ComponentConfig } from "../types/datamodel";
import { RootRoute } from "@tanstack/react-router";

const MAX_HISTORY = 50;
export interface DragItemData {
  type: ComponentTypes;
  config: any;
  label: string;
  icon: React.ReactNode;
}
export interface TeamBuilderProps {
  componentId: string;
  queryParams?: Record<string, any>;
  // tid: string;
  // upsertComponent: UseMutationResult<
  //   MtComponent,
  //   ApiErrors,
  //   Options<ComsUpsertData>,
  //   unknown
  // >;
}
export interface TeamBuilderState extends TeamBuilderProps {
  modelContent: React.ReactNode;
  setModelContent: (modelContent: React.ReactNode) => void;
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange: OnNodesChange<CustomNode>;
  onEdgesChange: OnEdgesChange<CustomEdge>;
  setNodes: Dispatch<SetStateAction<CustomNode[]>>;
  setEdges: (edges: CustomEdge[]) => void;
  onNodeClick: NodeMouseHandler<CustomNode>;
  component?: Component;
  isJsonMode: boolean;
  setIsJsonMode: (isJsonMode: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  validationLoading: boolean;
  setValidationLoading: (validationLoading: boolean) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  teamValidated: boolean;
  setTeamValidated: (teamValidated: boolean) => void;
  validationResults: any;
  setValidationResults: (validationResults: any) => void;
  showGrid: boolean;
  setShowGrid: (showGrid: boolean) => void;
  showMiniMap: boolean;
  setShowMiniMap: (showMiniMap: boolean) => void;
  showFlowControl: boolean;
  setShowFlowControl: (showFlowControl: boolean) => void;
  selectedNodeId: string | null;
  history: Array<{ nodes: CustomNode[]; edges: CustomEdge[] }>;
  currentHistoryIndex: number;
  originalComponent: Component<TeamConfig> | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  addNode: (
    position: Position,
    component: Component<ComponentConfig>,
    targetNodeId: string,
  ) => void;
  updateNode: (nodeId: string, updates: Partial<NodeData>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: CustomEdge) => void;
  removeEdge: (edgeId: string) => void;
  selectedNode: CustomNode | null;
  setSelectedNode: (node: CustomNode | null) => void;
  undo: () => void;
  redo: () => void;
  syncToJson: () => Component | null;
  teamJson: string;
  setTeamJson: (teamJson: string) => void;
  loadFromJson: (config: Component, isInitialLoad?: boolean) => GraphState;
  layoutNodes: () => void;
  resetHistory: () => void;
  addToHistory: () => void;
  activeDragItem?: DragItemData | null;
  setActiveDragItem: (activeDragItem: DragItemData | null) => void;
  handleValidate: () => Promise<void>;
  handleJsonChange: DebouncedFunc<(value: string) => void>;
  handleSave: () => Promise<void>;
  onConnect: (params: Connection) => void;
  newHistoryState: () => void;
  validateDropTarget: (draggedType: ComponentTypes, targetType: ComponentTypes) => boolean;
  nav: ReturnType<typeof useNav>;

  handleSaveV2: (teamValues: any) => void;
}

const buildTeamComponent = (
  teamNode: CustomNode,
  nodes: CustomNode[],
  edges: CustomEdge[],
): Component | null => {
  const componentObj = { ...teamNode.data.component };
  // console.log("componentObj", teamNode.data.component);
  if (!isTeamComponent(componentObj)) return null;

  // Get participants using edges
  const participantEdges = edges.filter(
    (e) => e.source === teamNode.id && e.type === "agent-connection",
  );
  const participants = participantEdges
    .map((edge) => {
      const agentNode = nodes.find((n) => n.id === edge.target);
      if (!agentNode || !isAgentComponent(agentNode.data.component)) return null;
      return agentNode.data.component;
    })
    .filter((agent) => agent !== null);
  // console.log("builded component", componentObj, participants);

  // Create a new object instead of modifying the original
  return {
    ...componentObj,
    config: {
      ...componentObj.config,
      participants,
    },
  };
};

export const createWorkbrenchSlice: StateCreator<TeamBuilderState, [], [], TeamBuilderState> = (
  set,
  get,
  init,
) => {
  return {
    setNodes: (nodes: CustomNode[]) => {
      console.log("setNodes", nodes);
      set({ nodes });
    },
    setEdges: (edges: CustomEdge[]) => {
      console.log("setEdges", edges);
      set({ edges });
    },
    handleSaveV2: (teamValues) => {
      console.log("handleSaveV2", teamValues);
    },
    onNodesChange: (nodes: NodeChange<CustomNode>[]) => {
      for (const node of nodes) {
        if (node.type === "position") {
          const targetNode = get().nodes.find((n) => n.id === node.id);
          if (targetNode && node.position?.x && node.position?.y) {
            // 更新节点位置
            const updatedNode = {
              ...targetNode,
              position: node.position,
            };
            // 更新所有节点
            const updatedNodes = get().nodes.map((n) => (n.id === node.id ? updatedNode : n));
            set({ nodes: updatedNodes });
            // 添加到历史记录
            get().addToHistory();
          }
        }
      }
    },
    onEdgesChange: (edges: CustomEdge[]) => {
      console.log("onEdgesChange", edges);
    },
    selectedNodeId: null,
    history: [],
    currentHistoryIndex: -1,
    originalComponent: null,
    showFlowControl: true,
    setShowFlowControl: (showFlowControl) => {
      set({ showFlowControl });
    },
    isJsonMode: false,
    setIsJsonMode: (isJsonMode) => {
      set({ isJsonMode });
    },
    isFullscreen: false,
    setIsFullscreen: (isFullscreen) => {
      set({ isFullscreen });
    },
    showGrid: true,
    setShowGrid: (showGrid) => {
      set({ showGrid });
    },
    showMiniMap: false,
    setShowMiniMap: (showMiniMap) => {
      set({ showMiniMap });
    },
    setIsDirty: (isDirty) => {
      set({ isDirty });
    },
    setTeamValidated: (teamValidated) => {
      set({ teamValidated });
    },
    setValidationResults: (validationResults) => {
      set({ validationResults });
    },
    setValidationLoading: (validationLoading) => {
      set({ validationLoading });
    },
    setModelContent: (modelContent) => {
      set({ modelContent });
    },
    teamJson: "",
    setTeamJson: (teamJson: string) => {
      set({ teamJson });
    },
    validateDropTarget: (draggedType: ComponentTypes, targetType: ComponentTypes): boolean => {
      // console.log("validateDropTarget", draggedType, targetType);
      const validTargets: Record<ComponentTypes, ComponentTypes[]> = {
        model: ["team", "agent"],
        tool: ["agent"],
        agent: ["team"],
        team: [],
        termination: ["team"],
      };
      const ok = validTargets[draggedType]?.includes(targetType) || false;
      console.log("validateDropTarget", { ok, draggedType, targetType });
      return ok;
    },

    handleDragStart: (event: DragStartEvent) => {
      console.log("handleDragStart", event);
      const { active } = event;
      if (active.data.current) {
        // setActiveDragItem(active.data.current as DragItemData);
        set({ activeDragItem: active.data.current as DragItemData });
      }
    },
    handleDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !active.data?.current?.current) return;

      const draggedItem = active.data.current.current;
      const dropZoneId = over.id as string;
      // console.log({ message: "handleDragEnd", dropZoneId, draggedItem });
      const [nodeId] = dropZoneId.split("@@@");
      // Find target node
      const targetNode = get().nodes.find((node) => node.id === nodeId);
      if (!targetNode) {
        console.error("No target node", get().nodes, nodeId);
        return;
      }

      // Validate drop
      const isValid = get().validateDropTarget(
        draggedItem.type,
        targetNode.data.component.component_type,
      );
      if (!isValid) {
        console.error("Invalid drop", draggedItem, targetNode);
        return;
      }

      const position = {
        x: event.delta.x,
        y: event.delta.y,
      };

      get().addNode(position, draggedItem, nodeId);

      set({ activeDragItem: null });
    },
    handleDragOver: (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over?.id || !active.data.current) return;

      const draggedType = active.data.current.type;
      const targetNode = get().nodes.find((node) => node.id === over.id);
      // console.log({
      //   message: "handleDragOver",
      //   event,
      //   draggedType,
      //   targetNode,
      //   targetNodeType: targetNode?.data.component.componentType,
      // });
      if (!targetNode) return;

      const isValid = get().validateDropTarget(
        draggedType,
        targetNode.data.component.component_type,
      );
      // Add visual feedback class to target node
      if (isValid) {
        targetNode.className = "drop-target-valid";
      } else {
        targetNode.className = "drop-target-invalid";
      }
    },

    onConnect: (params: Connection) => {
      set({ edges: addEdge(params, get().edges) });
    },
    newHistoryState: () => {
      set({
        history: [
          ...get().history.slice(0, get().currentHistoryIndex + 1),
          { nodes: get().nodes, edges: get().edges },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: get().currentHistoryIndex + 1,
      });
    },
    addNode: (position: Position, component: MtComponent, targetNodeId: string) => {
      // Deep clone the incoming component to avoid reference issues
      const clonedComponent = JSON.parse(JSON.stringify(component.config));
      console.log("addNode", { component, targetNodeId, position });
      let newNodes = [...get().nodes];
      const newEdges = [...get().edges];

      if (targetNodeId) {
        const targetNode = get().nodes.find((n) => n.id === targetNodeId);
        if (!targetNode) {
          return;
        }

        // Handle configuration updates based on component type
        if (isModelComponent(clonedComponent)) {
          if (
            isTeamComponent(targetNode.data.component) &&
            isSelectorTeam(targetNode.data.component)
          ) {
            console.log("model_client", clonedComponent);
            // Update nodes properly using map to create a new array with the updated node
            newNodes = newNodes.map((node) => {
              if (node.id === targetNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    component: {
                      ...node.data.component,
                      config: {
                        ...node.data.component.config,
                        model_client: clonedComponent,
                      },
                    },
                  },
                };
              }
              return node;
            });

            set({ nodes: newNodes });
            get().newHistoryState();
            get().syncToJson();
            return;
          }
          if (
            isAgentComponent(targetNode.data.component) &&
            (isAssistantAgent(targetNode.data.component) ||
              isWebSurferAgent(targetNode.data.component))
          ) {
            // Update nodes properly using map to create a new array with the updated node
            newNodes = newNodes.map((node) => {
              if (node.id === targetNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    component: {
                      ...node.data.component,
                      config: {
                        ...node.data.component.config,
                        model_client: clonedComponent,
                      },
                    },
                  },
                };
              }
              return node;
            });

            set({ nodes: newNodes });
            get().newHistoryState();
            get().syncToJson();
            return;
          }
        } else if (isToolComponent(clonedComponent)) {
          if (
            isAgentComponent(targetNode.data.component) &&
            isAssistantAgent(targetNode.data.component)
          ) {
            if (!targetNode.data.component.config.tools) {
              targetNode.data.component.config.tools = [];
            }
            const toolName = getUniqueName(
              clonedComponent.config.name as string,
              targetNode.data.component.config.tools.map((t) => t.config.name),
            );
            clonedComponent.config.name = toolName;
            targetNode.data.component.config.tools = [
              ...(targetNode.data.component.config.tools || []),
              clonedComponent,
            ];
            set({
              nodes: newNodes,
              edges: newEdges,
            });
            get().newHistoryState();
            get().syncToJson();
            return;
          }
        } else if (isTerminationComponent(clonedComponent)) {
          console.log("Termination component added", clonedComponent);
          if (isTeamComponent(targetNode.data.component)) {
            newNodes = get().nodes.map((node) => {
              if (node.id === targetNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    component: {
                      ...node.data.component,
                      config: {
                        ...node.data.component.config,
                        termination_condition: clonedComponent,
                      },
                    },
                  },
                };
              }
              return node;
            });
            get().syncToJson();
            return;

            // return {
            //   nodes: newNodes,
            //   edges: newEdges,
            //   history: [
            //     ...get().history.slice(0, get().currentHistoryIndex + 1),
            //     { nodes: newNodes, edges: newEdges },
            //   ].slice(-MAX_HISTORY),
            //   currentHistoryIndex: get().currentHistoryIndex + 1,
            // };
          }
        }
      }

      // Handle team and agent nodes
      if (isTeamComponent(clonedComponent)) {
        console.log("Team component added", clonedComponent);
        const newNode: CustomNode = {
          id: nanoid(),
          position,
          type: clonedComponent.component_type,
          data: {
            label: clonedComponent.label || "Team",
            component: clonedComponent,
            type: clonedComponent.component_type as NodeData["type"],
          },
        };
        newNodes.push(newNode);
      } else if (isAgentComponent(clonedComponent)) {
        console.log("Agent component added", clonedComponent);
        // Find the team node to connect to
        let teamNode = newNodes.find((n) => isTeamComponent(n.data.component));
        if (teamNode) {
          // Ensure unique agent name
          if (isAssistantAgent(clonedComponent) && isTeamComponent(teamNode.data.component)) {
            // console.log("teamNode222", teamNode);
            const existingAgents = teamNode.data.component.config.participants || [];
            const existingNames = existingAgents?.map((p) => p.config.name);
            clonedComponent.config.name = getUniqueName(clonedComponent.config.name, existingNames);
          }
          // console.log("clonedComponent", clonedComponent);
          const newNode = {
            id: nanoid(),
            position,
            type: "agent",
            data: {
              label: clonedComponent.label || clonedComponent.config.name,
              component: clonedComponent,
              // type: componentType as NodeData["type"],
              type: "agent",
            },
          } as CustomNode;
          console.log("newNode", newNode);

          newNodes.push(newNode);
          // set({ nodes: [...get().nodes, newNode] });
          // Add connection to team
          newEdges.push({
            id: nanoid(),
            source: teamNode.id,
            target: newNode.id,
            sourceHandle: `${teamNode.id}-agent-output-handle`,
            targetHandle: `${newNode.id}-agent-input-handle`,
            type: "agent-connection",
          });

          // Update team's participants
          if (isTeamComponent(teamNode.data.component)) {
            if (!teamNode.data.component.config.participants) {
              teamNode.data.component.config.participants = [];
            }
            console.log("update teamNode", teamNode);
            teamNode = {
              ...teamNode,
              data: {
                ...teamNode.data,
                component: {
                  ...teamNode.data.component,
                  config: {
                    ...teamNode.data.component.config,
                    participants: [
                      ...(teamNode.data.component.config?.participants || []),
                      newNode.data.component,
                    ],
                  },
                },
              },
            };
          }
          set({
            edges: newEdges,
            nodes: newNodes,
            // history: [
            //   ...get().history.slice(0, get().currentHistoryIndex + 1),
            //   { nodes: newNodes, edges: newEdges },
            // ].slice(-MAX_HISTORY),
            // currentHistoryIndex: get().currentHistoryIndex + 1,
          });
          get().newHistoryState();
          set({ isDirty: true });
          get().syncToJson();
        }
      }

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        newNodes,
        newEdges,
      );

      get().newHistoryState();
      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
        // history: [
        //   ...state.history.slice(0, state.currentHistoryIndex + 1),
        //   { nodes: layoutedNodes, edges: layoutedEdges },
        // ].slice(-MAX_HISTORY),
        // currentHistoryIndex: state.currentHistoryIndex + 1,
      });
      // return {
      //   // nodes: layoutedNodes,
      //   // edges: layoutedEdges,
      //   history: [
      //     ...state.history.slice(0, state.currentHistoryIndex + 1),
      //     { nodes: layoutedNodes, edges: layoutedEdges },
      //   ].slice(-MAX_HISTORY),
      //   currentHistoryIndex: state.currentHistoryIndex + 1,
      // };
      // });
    },

    /**
     * 更新节点
     * TODO: 建议步骤,
     * @param nodeId
     * @param updates
     */
    updateNode: (nodeId: string, updates: Partial<NodeData>) => {
      console.log("updateNode: ", nodeId, updates);
      const newNodes = get().nodes.map((node) => {
        if (node.id !== nodeId) {
          // If this isn't the directly updated node, check if it needs related updates
          const isTeamWithUpdatedAgent =
            isTeamComponent(node.data.component) &&
            get().edges.some(
              (e) => e.type === "agent-connection" && e.target === nodeId && e.source === node.id,
            );

          if (isTeamWithUpdatedAgent && isTeamComponent(node.data.component)) {
            console.log("isTeamWithUpdatedAgent", node);
            // Update team node with the updated agent component
            return {
              ...node,
              data: {
                ...node.data,
                component: {
                  ...node.data.component,
                  config: {
                    ...node.data.component.config,
                    participants:
                      node.data.component.config.participants?.map((participant) =>
                        participant === get().nodes.find((n) => n.id === nodeId)?.data.component
                          ? updates.component
                          : participant,
                      ) || [],
                  },
                },
              },
            };
          }
          return node;
        }

        // This is the directly updated node
        const updatedComponent = updates.component || node.data.component;
        console.log("This is the directly updated node", {
          node,
          updates,
          updatedComponent,
        });

        return {
          ...node,
          data: {
            ...node.data,
            component: {
              ...node.data.component,
              ...updatedComponent,
            },
          },
        };
      });

      // console.log("更新后的节点:", newNodes);
      set({
        nodes: newNodes,
        // history: [
        //   ...get().history.slice(0, get().currentHistoryIndex + 1),
        //   { nodes: newNodes, edges: get().edges },
        // ].slice(-MAX_HISTORY),
        // currentHistoryIndex: get().currentHistoryIndex + 1,
        isDirty: true,
      });
      get().newHistoryState();
      get().syncToJson();
    },

    removeNode: (nodeId: string) => {
      set((state) => {
        const nodesToRemove = new Set<string>();
        const updatedNodes = new Map<string, CustomNode>();

        const collectNodesToRemove = (id: string) => {
          const node = state.nodes.find((n) => n.id === id);
          if (!node) return;

          nodesToRemove.add(id);

          // Find all edges connected to this node
          const connectedEdges = state.edges.filter(
            (edge) => edge.source === id || edge.target === id,
          );

          // Handle cascading deletes based on component type
          if (isTeamComponent(node.data.component)) {
            // Find and remove all connected agents
            // biome-ignore lint/complexity/noForEach: <explanation>
            connectedEdges
              .filter((e) => e.type === "agent-connection")
              .forEach((e) => collectNodesToRemove(e.target));
          } else if (isAgentComponent(node.data.component)) {
            // Update team's participants if agent is connected to a team
            const teamEdge = connectedEdges.find((e) => e.type === "agent-connection");
            if (teamEdge) {
              const teamNode = state.nodes.find((n) => n.id === teamEdge.source);
              if (teamNode && isTeamComponent(teamNode.data.component)) {
                const updatedTeamNode = {
                  ...teamNode,
                  data: {
                    ...teamNode.data,
                    component: {
                      ...teamNode.data.component,
                      config: {
                        ...teamNode.data.component.config,
                        participants: teamNode.data.component.config.participants.filter(
                          (p) => !isEqual(p, node.data.component),
                        ),
                      },
                    },
                  },
                };
                updatedNodes.set(teamNode.id, updatedTeamNode);
              }
            }
          }
        };

        // Start the cascade deletion from the initial node
        collectNodesToRemove(nodeId);

        // Create new nodes array with both removals and updates
        const newNodes = state.nodes
          .filter((node) => !nodesToRemove.has(node.id))
          .map((node) => updatedNodes.get(node.id) || node);

        // Remove all affected edges
        const newEdges = state.edges.filter(
          (edge) => !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target),
        );

        return {
          nodes: newNodes,
          edges: newEdges,
          history: [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            { nodes: newNodes, edges: newEdges },
          ].slice(-MAX_HISTORY),
          currentHistoryIndex: state.currentHistoryIndex + 1,
        };
      });
    },

    addEdge: (edge: CustomEdge) => {
      set((state) => ({
        edges: [...state.edges, edge],
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          { nodes: state.nodes, edges: [...state.edges, edge] },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));
    },

    removeEdge: (edgeId: string) => {
      set((state) => ({
        edges: state.edges.filter((edge) => edge.id !== edgeId),
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          {
            nodes: state.nodes,
            edges: state.edges.filter((edge) => edge.id !== edgeId),
          },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));
    },

    setSelectedNode: (node) => {
      set({ selectedNode: node });

      if (node) {
        const provider = node?.data.component.provider;
        const providerName = provider?.split(".").pop();
        get().nav({
          to: `/coms/${get().componentId}/component_editor/${providerName}`,
        });
      }
    },

    undo: () => {
      set((state) => {
        if (state.currentHistoryIndex <= 0) return state;

        const previousState = state.history[state.currentHistoryIndex - 1];
        return {
          ...state,
          nodes: previousState.nodes,
          edges: previousState.edges,
          currentHistoryIndex: state.currentHistoryIndex - 1,
        };
      });
    },

    redo: () => {
      set((state) => {
        if (state.currentHistoryIndex >= state.history.length - 1) return state;

        const nextState = state.history[state.currentHistoryIndex + 1];
        return {
          ...state,
          nodes: nextState.nodes,
          edges: nextState.edges,
          currentHistoryIndex: state.currentHistoryIndex + 1,
        };
      });
    },

    syncToJson: () => {
      // const state = get();
      // console.log("syncToJson", get().nodes);
      const teamNodes = get().nodes.filter(
        (node) =>
          // node.data.component.component_type === "team" ||
          node.data.component?.component_type === "team",
      );
      if (teamNodes.length === 0) {
        console.log("syncToJson error", get().nodes);
        return;
      }

      const teamNode = teamNodes[0];
      const team = buildTeamComponent(teamNode, get().nodes, get().edges);
      // return buildTeamComponent(teamNode, get().nodes, get().edges);
      set({ component: team });
      // console.log("syncToJson", team);
      set({ teamJson: JSON.stringify(team, null, 2) });
    },

    layoutNodes: () => {
      const { nodes, edges } = get();
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);

      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
        history: [
          ...get().history.slice(0, get().currentHistoryIndex + 1),
          { nodes: layoutedNodes, edges: layoutedEdges },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: get().currentHistoryIndex + 1,
      });
      // get().syncToJson();
    },
    handleSave: async () => {
      // const component = get().syncToJson();
      if (!get().component) {
        throw new Error("(handleSave)Unable to generate valid configuration");
      }
      // if (onChange) {
      //   const teamData: Partial<Team> = team
      //     ? {
      //         ...team,
      //         component,
      //         created_at: undefined,
      //         updated_at: undefined,
      //       }
      //     : { component };
      //   await onChange(teamData);
      //   resetHistory();
      // }
      console.log("handleSave", get().component);
      await get().upsertComponent.mutateAsync({
        path: {
          tenant: get().tid,
          com: get().componentId,
        },
        body: {
          ...get().component,
        },
      });
      set({ isDirty: false });
    },
    handleJsonChange: debounce((value: string) => {
      try {
        const config = JSON.parse(value);
        // Always consider JSON edits as changes that should affect isDirty state
        get().loadFromJson(config, false);
        // Force history update even if nodes/edges appear same
        get().addToHistory();
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }, 1000),
    loadFromJson: (config, isInitialLoad = true) => {
      console.log("loadFromJson", config);
      // Get graph representation of team config
      const { nodes, edges } = convertTeamConfigToGraph(config);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);

      if (isInitialLoad) {
        // Initial load - reset history
        set({
          nodes: layoutedNodes,
          edges: layoutedEdges,
          originalComponent: config,
          history: [{ nodes: layoutedNodes, edges: layoutedEdges }],
          currentHistoryIndex: 0,
          selectedNodeId: null,
        });
      } else {
        // JSON edit - check if state actually changed
        const currentState = get();
        if (
          !isEqual(layoutedNodes, currentState.nodes) ||
          !isEqual(layoutedEdges, currentState.edges)
        ) {
          set((state) => ({
            nodes: layoutedNodes,
            edges: layoutedEdges,
            history: [
              ...state.history.slice(0, state.currentHistoryIndex + 1),
              { nodes: layoutedNodes, edges: layoutedEdges },
            ].slice(-MAX_HISTORY),
            currentHistoryIndex: state.currentHistoryIndex + 1,
          }));
        }
      }
      get().syncToJson();
      get().handleValidate();
      console.log("loadFromJson", layoutedNodes, layoutedEdges);
      // return { nodes: layoutedNodes, edges: layoutedEdges };
      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
        history: [{ nodes: layoutedNodes, edges: layoutedEdges }],
        currentHistoryIndex: 0,
      });
    },

    resetHistory: () => {
      set({
        history: [{ nodes: get().nodes, edges: get().edges }],
        isDirty: false,
        currentHistoryIndex: 0,
      });
    },

    addToHistory: () => {
      set((state) => ({
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          { nodes: state.nodes, edges: state.edges },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));

      if (get().history.length) {
        set({
          isDirty: true,
        });
      }
    },

    setActiveDragItem: (activeDragItem: DragItemData | null) => {
      set({ activeDragItem });
    },
    handleValidate: async () => {
      // const component = get().syncToJson();
      // console.log("handleValidate", component);

      // if (!component) {
      //   throw new Error("Unable to generate valid configuration");
      // }

      try {
        //   setValidationLoading(true);
        //   const validationResult = await validationAPI.validateComponent(component);
        //   setValidationResults(validationResult);
        //   // if (validationResult.is_valid) {
        //   //   messageApi.success("Validation successful");
        //   // }
        // } catch (error) {
        //   console.error("Validation error:", error);
        //   messageApi.error("Validation failed");
      } finally {
        // setValidationLoading(false);
      }
    },
    ...init,
  };
};

type teamBuilderStore = ReturnType<typeof createTeamBuilderStore>;
export type WorkbrenchStoreState = TeamBuilderState;

const createTeamBuilderStore = (initProps?: Partial<TeamBuilderState>) => {
  return createStore<TeamBuilderState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "teambuilder-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<teamBuilderStore | null>(null);

type AppProviderProps = React.PropsWithChildren<TeamBuilderProps>;
export const TeamBuilderProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  // const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const tid = useTenantId();
  const nav = RootRoute.useNavigate();
  const upsertComponent = useMutation({
    ...comsUpsertMutation(),
  });
  const componentsQuery = useQuery({
    ...comsGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        com: props.componentId,
      },
    }),
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const store = useMemo(() => {
    const store = createTeamBuilderStore({
      ...etc,
      component: componentsQuery.data,
      upsertComponent,
      tid,
      nav,
    });
    return store;
  }, [componentsQuery.data]);

  useEffect(() => {
    if (componentsQuery.data) {
      store.getState().loadFromJson(componentsQuery.data);
    }
  }, [componentsQuery.data, store]);

  useEffect(() => {
    if (!store.getState().isFullscreen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        store.setState({ isFullscreen: false });
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [store]);

  useEffect(() => {
    if (store.getState().isDirty) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [store]);
  return (
    <mtmaiStoreContext.Provider value={store}>
      <DndContext
        sensors={sensors}
        onDragEnd={store.getState().handleDragEnd}
        onDragOver={store.getState().handleDragOver}
        onDragStart={store.getState().handleDragStart}
      >
        {children}
      </DndContext>
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useTeamBuilderStore(): TeamBuilderState;
export function useTeamBuilderStore<T>(selector: (state: TeamBuilderState) => T): T;
export function useTeamBuilderStore<T>(selector?: (state: TeamBuilderState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useTeamBuilderStore must in TeamBuilderProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
