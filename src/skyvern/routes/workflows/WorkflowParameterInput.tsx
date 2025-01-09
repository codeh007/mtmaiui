"use client";

import { AutoResizingTextarea } from "mtxuilib/components/AutoResizingTextarea";
import { Checkbox } from "mtxuilib/ui/checkbox";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { type FileInputValue, FileUpload } from "../../components/FileUpload";
import { CodeEditor } from "./components/CodeEditor";
import type { WorkflowParameterValueType } from "./types/workflowTypes";

type Props = {
  type: WorkflowParameterValueType;
  value: unknown;
  onChange: (value: unknown) => void;
};

function WorkflowParameterInput({ type, value, onChange }: Props) {
  if (type === "json") {
    return (
      <CodeEditor
        className="w-full"
        language="json"
        onChange={(value) => onChange(value)}
        value={
          typeof value === "string" ? value : JSON.stringify(value, null, 2)
        }
        minHeight="96px"
        maxHeight="500px"
      />
    );
  }

  if (type === "string") {
    return (
      <AutoResizingTextarea
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (type === "integer") {
    return (
      <Input
        value={value === null ? "" : Number(value)}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        type="number"
      />
    );
  }

  if (type === "float") {
    return (
      <Input
        value={value === null ? "" : Number(value)}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        type="number"
        step="any"
      />
    );
  }

  if (type === "boolean") {
    const checked = typeof value === "boolean" ? value : Boolean(value);
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => onChange(checked)}
          className="block"
        />
        <Label>{value ? "True" : "False"}</Label>
      </div>
    );
  }

  if (type === "file_url") {
    return (
      <FileUpload
        value={value as FileInputValue}
        onChange={(value) => onChange(value)}
      />
    );
  }
}

export { WorkflowParameterInput };
