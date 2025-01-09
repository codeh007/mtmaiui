// import { StepApiResponse } from "@/api/types";
import { createContext } from "react";
import type { StepApiResponse } from "../api/types";

type TaskCostCalculator = (steps: Array<StepApiResponse>) => number;

const CostCalculatorContext = createContext<TaskCostCalculator | null>(null);

export { CostCalculatorContext };
