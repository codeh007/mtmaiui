import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";

import { StepRunStatus, type StepRun, type WorkflowRunShape } from "mtmaiapi";
import { LoggingComponent } from "mtxuilib/mt/logs";
import type React from "react";
import StepRunCodeText from "./step-run-error";
const readableReason = (reason?: string): string => {
  return reason ? reason.toLowerCase().split("_").join(" ") : "";
};

type StepRunOutputProps = {
  stepRun: StepRun;
  workflowRun: WorkflowRunShape;
};

const oneLiner = (text: string) => {
  return (
    <div className="my-4">
      <LoggingComponent
        logs={[
          {
            line: text,
          },
        ]}
        onTopReached={() => {}}
        onBottomReached={() => {}}
      />
    </div>
  );
};

const StepRunOutputCancelled = ({ stepRun }: StepRunOutputProps) => {
  let msg = "步骤被取消";

  if (stepRun.cancelledReason) {
    msg = `步骤被取消: ${readableReason(stepRun.cancelledReason)}`;
  }

  return oneLiner(msg);
};

const StepRunOutputPending = ({ stepRun }: StepRunOutputProps) => {
  let msg = "等待开始...";

  if (stepRun.parents) {
    msg = `Waiting for parent steps to complete: ${stepRun.parents.join(", ")}`;
  }

  return oneLiner(msg);
};

const StepRunOutputPendingAssignment = () => {
  return oneLiner("步骤等待分配...");
};

const StepRunOutputAssigned = () => {
  return oneLiner("步骤已分配，即将开始...");
};

const StepRunOutputRunning = () => {
  return oneLiner("步骤运行中...");
};

const StepRunOutputSucceeded = ({ stepRun }: StepRunOutputProps) => {
  return (
    <CodeHighlighter
      className="my-4 h-[400px] max-h-[600px] overflow-y-auto"
      language="json"
      maxHeight="400px"
      minHeight="400px"
      code={JSON.stringify(JSON.parse(stepRun?.output || "{}"), null, 2)}
    />
  );
};

const StepRunOutputFailed = ({ stepRun }: StepRunOutputProps) => {
  if (!stepRun.error) {
    return oneLiner("步骤运行失败，没有错误信息");
  }

  return (
    <div className="my-4">
      <StepRunCodeText text={stepRun.error} />
    </div>
  );
};

const StepRunOutputCancelling = () => {
  return oneLiner("Step run is being cancelled");
};

const OUTPUT_STATE_MAP: Record<StepRunStatus, React.FC<StepRunOutputProps>> = {
  [StepRunStatus.CANCELLED]: StepRunOutputCancelled,
  [StepRunStatus.PENDING]: StepRunOutputPending,
  [StepRunStatus.PENDING_ASSIGNMENT]: StepRunOutputPendingAssignment,
  [StepRunStatus.ASSIGNED]: StepRunOutputAssigned,
  [StepRunStatus.RUNNING]: StepRunOutputRunning,
  [StepRunStatus.SUCCEEDED]: StepRunOutputSucceeded,
  [StepRunStatus.FAILED]: StepRunOutputFailed,
  [StepRunStatus.CANCELLING]: StepRunOutputCancelling,
};

export const StepRunOutput: React.FC<StepRunOutputProps> = (props) => {
  const Component = OUTPUT_STATE_MAP[props.stepRun.status];
  return <Component {...props} />;
};
