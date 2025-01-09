"use client";

import { CodeEditor } from "mtxuilib/mt/code-editor";
import { MtLoading } from "mtxuilib/mt/mtloading";

export interface StepRunOutputProps {
  output: string;
  isLoading: boolean;
  errors: string[];
}

export const StepRunOutput: React.FC<StepRunOutputProps> = ({
  output,
  isLoading,
  errors,
}) => {
  if (isLoading) {
    return <MtLoading />;
  }

  return (
    <>
      <CodeEditor
        language="json"
        className="mb-4"
        height="400px"
        code={JSON.stringify(
          errors.length > 0
            ? errors.flatMap((error) => error.split("\\n"))
            : JSON.parse(output),
          null,
          2,
        )}
      />
    </>
  );
};
