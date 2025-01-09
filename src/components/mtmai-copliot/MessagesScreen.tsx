"use client";

import { useMtPathName } from "../../hooks/hooks";
import { MessagesView } from "./MessagesView";

export const MessagesScreen = () => {
	const pathName = useMtPathName();

	if (pathName !== "/") {
		return null;
	}

	return <MessagesView />;
};
