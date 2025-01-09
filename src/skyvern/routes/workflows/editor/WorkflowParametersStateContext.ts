import { createContext } from "react";
import type { ParametersState } from "./FlowRenderer";

type WorkflowParametersState = [
	ParametersState,
	React.Dispatch<React.SetStateAction<ParametersState>>,
];

export const WorkflowParametersStateContext = createContext<
	WorkflowParametersState | undefined
>(undefined);
