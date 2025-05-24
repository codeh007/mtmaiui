"use client";

import type { Step, StepRun, WorkflowRunShape } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { cn } from "mtxuilib/lib/utils";
import type React from "react";
import { useMemo } from "react";
import type { TabOption } from "./step-run-detail/step-run-detail";
import StepRunNode from "./step-run-node";
import { hasChildSteps } from "./workflow_utils";

interface MiniMapProps {
  shape: WorkflowRunShape;
  selectedStepRunId?: string;
  onClick: (stepRunId?: string, defaultOpenTab?: TabOption) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({ shape, onClick }) => {
  return (
    <div className={cn("grow", hasChildSteps(shape) && "pb-12")}>
      {shape.jobRuns?.map(({ job, stepRuns, metadata }) => {
        const steps = job?.steps;

        if (!steps) {
          return (
            <div>
              error no steps{" "}
              <DebugValue title="mini map" data={shape.jobRuns} />
            </div>
          );
        }
        if (!stepRuns) {
          return (
            <div>
              error no steps runs{" "}
              <DebugValue title="mini map" data={shape.jobRuns} />
            </div>
          );
        }

        return (
          <JobMiniMap
            steps={steps}
            stepRuns={stepRuns}
            key={metadata.id}
            onClick={(stepRunId, defaultOpenTab) =>
              onClick(stepRunId, defaultOpenTab)
            }
          />
        );
      })}
    </div>
  );
};

interface JobMiniMapProps {
  steps: Step[];
  stepRuns: StepRun[];
  selectedStepRunId?: string;
  onClick: (stepRunId?: string, defaultOpenTab?: TabOption) => void;
}

export const JobMiniMap: React.FC<JobMiniMapProps> = ({
  steps = [],
  stepRuns = [],
  onClick,
}) => {
  const columns = useMemo(() => {
    const columns: Step[][] = [];
    const processed = new Set<string>();

    const addToColumn = (step: Step, columnIndex: number) => {
      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }
      columns[columnIndex].push(step);
      processed.add(step.metadata.id);
    };

    const processStep = (step: Step) => {
      if (processed.has(step.metadata.id)) {
        return;
      }

      if (!step.parents || step.parents.length === 0) {
        addToColumn(step, 0);
      } else {
        const maxParentColumn = Math.max(
          ...step.parents.map((parentId) => {
            const parentStep = steps.find((s) => s.metadata.id === parentId);
            return parentStep
              ? columns.findIndex((col) => col.includes(parentStep))
              : -1;
          }),
        );

        addToColumn(step, maxParentColumn + 1);
      }
    };

    while (processed.size < steps.length) {
      steps.forEach(processStep);
    }

    return columns;
  }, [steps]);

  const normalizedStepRunsByStepId = useMemo(() => {
    return steps.reduce(
      (acc, step) => {
        const stepRun = stepRuns?.find((sr) => sr.stepId === step.metadata.id);
        if (stepRun) {
          acc[step.metadata.id] = stepRun;
        }
        return acc;
      },
      {} as Record<string, StepRun>,
    );
  }, [steps, stepRuns]);

  return (
    <div className="flex flex-row p-4 rounded-sm relative gap-1">
      {columns.map((column, colIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={colIndex}
          className="flex flex-col justify-start h-full min-w-fit grow"
        >
          {column.map((step) => {
            const stepRun = normalizedStepRunsByStepId[step.metadata.id];

            return (
              <StepRunNode
                key={step.metadata.id}
                data={{
                  step,
                  stepRun,
                  graphVariant: "none",
                  onClick: (tabOption) =>
                    onClick(stepRun?.metadata.id, tabOption),
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
