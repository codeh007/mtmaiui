"use client";
import { CursorArrowIcon, InputIcon } from "@radix-ui/react-icons";
import { type ActionType, ReadableActionTypes } from "../../../api/types";

type Props = {
	actionType: ActionType;
};

const icons: Partial<Record<ActionType, React.ReactNode>> = {
	click: <CursorArrowIcon className="h-4 w-4" />,
	input_text: <InputIcon className="h-4 w-4" />,
};

export function ActionTypePill({ actionType }: Props) {
	return (
		<div className="flex gap-1 rounded-sm bg-slate-elevation5 px-2 py-1">
			{icons[actionType] ?? null}
			<span className="text-xs">{ReadableActionTypes[actionType]}</span>
		</div>
	);
}
