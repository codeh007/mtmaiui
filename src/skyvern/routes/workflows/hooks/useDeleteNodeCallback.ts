"use client";
import { useContext } from "react";
import { DeleteNodeCallbackContext } from "../../../store/DeleteNodeCallbackContext";

export function useDeleteNodeCallback() {
	const deleteNodeCallback = useContext(DeleteNodeCallbackContext);

	if (!deleteNodeCallback) {
		throw new Error(
			"useDeleteNodeCallback must be used within a DeleteNodeCallbackProvider",
		);
	}

	return deleteNodeCallback;
}
