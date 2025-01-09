import { createContext } from "react";

type LayoutCallbackFunction = () => void;

export const LayoutCallbackContext = createContext<
	LayoutCallbackFunction | undefined
>(undefined);
