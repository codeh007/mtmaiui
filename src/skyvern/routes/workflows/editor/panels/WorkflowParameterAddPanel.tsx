"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "mtxuilib/ui/button";
import { Checkbox } from "mtxuilib/ui/checkbox";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "mtxuilib/ui/select";
import { toast } from "mtxuilib/ui/use-toast";
import { useState } from "react";
import { WorkflowParameterInput } from "../../WorkflowParameterInput";
import { SourceParameterKeySelector } from "../../components/SourceParameterKeySelector";
import { WorkflowParameterValueType } from "../../types/workflowTypes";
import type { ParametersState } from "../FlowRenderer";
import { getDefaultValueForParameterType } from "../workflowEditorUtils";

type Props = {
  type: "workflow" | "credential" | "context";
  onClose: () => void;
  onSave: (value: ParametersState[number]) => void;
};

const workflowParameterTypeOptions = [
  { label: "string", value: WorkflowParameterValueType.String },
  { label: "float", value: WorkflowParameterValueType.Float },
  { label: "integer", value: WorkflowParameterValueType.Integer },
  { label: "boolean", value: WorkflowParameterValueType.Boolean },
  { label: "file", value: WorkflowParameterValueType.FileURL },
  { label: "JSON", value: WorkflowParameterValueType.JSON },
];

function header(type: "workflow" | "credential" | "context") {
  if (type === "workflow") {
    return "Add Workflow Parameter";
  }
  if (type === "credential") {
    return "Add Credential Parameter";
  }
  return "Add Context Parameter";
}

export function WorkflowParameterAddPanel({ type, onClose, onSave }: Props) {
  const [key, setKey] = useState("");
  const [urlParameterKey, setUrlParameterKey] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [parameterType, setParameterType] =
    useState<WorkflowParameterValueType>("string");
  const [defaultValueState, setDefaultValueState] = useState<{
    hasDefaultValue: boolean;
    defaultValue: unknown;
  }>({
    hasDefaultValue: false,
    defaultValue: null,
  });
  const [sourceParameterKey, setSourceParameterKey] = useState<
    string | undefined
  >(undefined);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <span>{header(type)}</span>
        <Cross2Icon className="h-6 w-6 cursor-pointer" onClick={onClose} />
      </header>
      <div className="space-y-1">
        <Label className="text-xs">Key</Label>
        <Input value={key} onChange={(e) => setKey(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {type === "workflow" && (
        <>
          <div className="space-y-1">
            <Label className="text-xs">Value Type</Label>
            <Select
              value={parameterType}
              onValueChange={(value) => {
                setParameterType(value as WorkflowParameterValueType);
                setDefaultValueState((state) => {
                  return {
                    ...state,
                    defaultValue: getDefaultValueForParameterType(
                      value as WorkflowParameterValueType,
                    ),
                  };
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {workflowParameterTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={defaultValueState.hasDefaultValue}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    setDefaultValueState({
                      hasDefaultValue: false,
                      defaultValue: null,
                    });
                    return;
                  }
                  setDefaultValueState({
                    hasDefaultValue: true,
                    defaultValue:
                      getDefaultValueForParameterType(parameterType),
                  });
                }}
              />
              <Label className="text-xs">Use Default Value</Label>
            </div>
            {defaultValueState.hasDefaultValue && (
              <WorkflowParameterInput
                onChange={(value) => {
                  if (
                    parameterType === "file_url" &&
                    typeof value === "object" &&
                    value &&
                    "s3uri" in value
                  ) {
                    setDefaultValueState((state) => {
                      return {
                        ...state,
                        defaultValue: value.s3uri,
                      };
                    });
                    return;
                  }
                  setDefaultValueState((state) => {
                    return {
                      ...state,
                      defaultValue: value,
                    };
                  });
                }}
                type={parameterType}
                value={defaultValueState.defaultValue}
              />
            )}
          </div>
        </>
      )}
      {type === "credential" && (
        <>
          <div className="space-y-1">
            <Label className="text-xs">URL Parameter Key</Label>
            <Input
              value={urlParameterKey}
              onChange={(e) => setUrlParameterKey(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Collection ID</Label>
            <Input
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
            />
          </div>
        </>
      )}
      {type === "context" && (
        <div className="space-y-1">
          <Label className="text-xs">Source Parameter</Label>
          <SourceParameterKeySelector
            value={sourceParameterKey}
            onChange={setSourceParameterKey}
          />
        </div>
      )}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (type === "workflow") {
              if (
                parameterType === "json" &&
                typeof defaultValueState.defaultValue === "string"
              ) {
                try {
                  JSON.parse(defaultValueState.defaultValue);
                } catch (e) {
                  toast({
                    variant: "destructive",
                    title: "Failed to add parameter",
                    description: "Invalid JSON for default value",
                  });
                  return;
                }
              }
              const defaultValue =
                parameterType === "json" &&
                typeof defaultValueState.defaultValue === "string"
                  ? JSON.parse(defaultValueState.defaultValue)
                  : defaultValueState.defaultValue;
              onSave({
                key,
                parameterType: "workflow",
                dataType: parameterType,
                description,
                defaultValue: defaultValueState.hasDefaultValue
                  ? defaultValue
                  : null,
              });
            }
            if (type === "credential") {
              if (!collectionId) {
                toast({
                  variant: "destructive",
                  title: "Failed to add parameter",
                  description: "Collection ID is required",
                });
                return;
              }
              onSave({
                key,
                parameterType: "credential",
                collectionId,
                urlParameterKey,
                description,
              });
            }
            if (type === "context") {
              if (!sourceParameterKey) {
                toast({
                  variant: "destructive",
                  title: "Failed to add parameter",
                  description: "Source parameter key is required",
                });
                return;
              }
              onSave({
                key,
                parameterType: "context",
                sourceParameterKey: sourceParameterKey,
                description,
              });
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
