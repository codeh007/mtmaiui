import {
  Cable,
  Code2,
  Grid,
  LayoutGrid,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  Map,
  Maximize2,
  Minimize2,
  Redo2,
  Undo2,
} from "lucide-react";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import type React from "react";

interface TeamBuilderToolbarProps {
  isJsonMode: boolean;
  isFullscreen: boolean;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  onToggleView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onToggleGrid: () => void;
  onToggleFullscreen: () => void;
  onAutoLayout: () => void;
  onToggleMiniMap: () => void;
}

export const TeamBuilderToolbar: React.FC<TeamBuilderToolbarProps> = ({
  isJsonMode,
  isFullscreen,
  showGrid,
  canUndo,
  canRedo,
  isDirty,
  onToggleView,
  onUndo,
  onRedo,
  onSave,
  onToggleGrid,
  onToggleFullscreen,
  onAutoLayout,
  onToggleMiniMap,
}) => {
  const menuItems: any = [
    {
      key: "autoLayout",
      label: "Auto Layout",
      icon: <LayoutGrid size={16} />,
      onClick: onAutoLayout,
    },
    {
      key: "grid",
      label: "Show Grid",
      icon: <Grid size={16} />,
      onClick: onToggleGrid,
    },
    {
      key: "minimap",
      label: "Show Mini Map",
      icon: <Map size={16} />,
      onClick: onToggleMiniMap,
    },
  ];

  return (
    <div
      className={`${
        isFullscreen ? "fixed top-6 right-6" : ""
      } hover:bg-secondary rounded shadow-sm`}
    >
      <div className="p-1 flex items-center gap-1">
        {!isJsonMode && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onUndo}
                  disabled={!canUndo}
                  size="sm"
                  variant="outline"
                >
                  <Undo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Undo</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onRedo}
                  disabled={!canRedo}
                  size="sm"
                  variant="outline"
                >
                  <Redo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Redo</span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onToggleFullscreen}
                  size="sm"
                  variant="outline"
                >
                  {isFullscreen ? (
                    <Minimize2 className="size-4" />
                  ) : (
                    <Maximize2 className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                </span>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              size="sm"
              variant="outline"
              // disabled={!isDirty}
            >
              <div className="relative">
                <Save size={18} />
                {isDirty && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Save Changes</span>
          </TooltipContent>
        </Tooltip> */}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onToggleView} size="sm" variant="outline">
              {isJsonMode ? (
                <Cable className="size-4" />
              ) : (
                <Code2 className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{isJsonMode ? "Switch to Visual" : "Switch to JSON"}</span>
          </TooltipContent>
        </Tooltip>

        {/* {!isJsonMode && (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            overlayStyle={{ zIndex: 1001 }}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreHorizontal size={18} />}
              className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
              title="More Options"
            />
          </Dropdown>
        )} */}
      </div>
    </div>
  );
};
