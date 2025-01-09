"use client";

import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { useWorkflow } from "../../hooks/useWorkflow";

interface OneShotProps {
  resource: string;
  resourceId: string;
  input: string;
  label?: string;
}

export const OneShot = ({ input, ...props }: OneShotProps) => {
  const [label, setLabel] = useState(props.label || "一键操作");
  const workflow = useWorkflow("OneShotV2");

  return (
    <>
      <Button
        onClick={() => {
          workflow.trigger({ message: input, ...props });
        }}
      >
        {label}
      </Button>
    </>
  );
};
