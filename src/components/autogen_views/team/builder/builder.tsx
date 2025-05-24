import { DragOverlay } from "@dnd-kit/core";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "mtxuilib/lib/utils";
import { MonacoEditor } from "mtxuilib/mt/monaco";
import { Button } from "mtxuilib/ui/button";
import { useRef } from "react";
import "./builder.css";
import { edgeTypes, nodeTypes } from "./nodes";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const TeamBuilder = () => {
  const nodes = useTeamBuilderStore((x) => x.nodes);
  const edges = useTeamBuilderStore((x) => x.edges);
  const showGrid = useTeamBuilderStore((x) => x.showGrid);
  const showMiniMap = useTeamBuilderStore((x) => x.showMiniMap);
  const editorRef = useRef(null);
  const isJsonMode = useTeamBuilderStore((x) => x.isJsonMode);
  const isFullscreen = useTeamBuilderStore((x) => x.isFullscreen);
  const setIsFullscreen = useTeamBuilderStore((x) => x.setIsFullscreen);
  const teamJson = useTeamBuilderStore((x) => x.teamJson);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const activeDragItem = useTeamBuilderStore((x) => x.activeDragItem);
  const handleJsonChange = useTeamBuilderStore((x) => x.handleJsonChange);
  const onConnect = useTeamBuilderStore((x) => x.onConnect);
  const onNodesChange = useTeamBuilderStore((x) => x.onNodesChange);
  const onEdgesChange = useTeamBuilderStore((x) => x.onEdgesChange);
  const showFlowControl = useTeamBuilderStore((x) => x.showFlowControl);
  return (
    <>
      <div className=" relative h-[calc(100vh-50px)] flex-1">
        <div className=" rounded bg-slate-500 w-full h-full">
          <div className="relative rounded w-full h-full">
            <div
              className={cn(
                "w-full h-full transition-all duration-200",
                isFullscreen
                  ? "fixed inset-4 z-50 shadow bg-tertiary  backdrop-blur-sm"
                  : "",
              )}
            >
              {isJsonMode ? (
                <MonacoEditor
                  value={teamJson}
                  onChange={handleJsonChange}
                  editorRef={editorRef}
                  language="json"
                  minimap={false}
                />
              ) : (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={(_, node) => setSelectedNode(node)}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  onDrop={(event) => event.preventDefault()}
                  onDragOver={(event) => event.preventDefault()}
                  className="rounded"
                  fitView
                  fitViewOptions={{ padding: 10 }}
                >
                  {showGrid && <Background />}
                  {showMiniMap && <MiniMap />}
                  {showFlowControl && <Controls />}
                </ReactFlow>
              )}
            </div>
            {isFullscreen && (
              <Button
                variant="ghost"
                className="fixed inset-0 -z-10 bg-background bg-opacity-80 backdrop-blur-sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
            )}
          </div>
        </div>
      </div>
      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeDragItem ? (
          <div className="p-1 h-full rounded bg-slate-100 border border-dashed border-slate-400">
            <div className="flex items-center gap-2">
              {activeDragItem.icon}
              <span className="text-sm">{activeDragItem.label}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </>
  );
};
