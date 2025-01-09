"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Status } from "../../../../api/types";
// import { getTaskOptions } from "mtmaiapi/@tanstack/react-query.gen";

type Props = {
	id: string;
};

export function useTaskQuery({ id }: Props) {
	const query = useQuery({
		// ...getTaskOptions({
		// 	path: {
		// 		task_id: id,
		// 	},
		// }),
		enabled: !!id,
		refetchInterval: (query) => {
			if (
				query.state.data?.status === Status.Running ||
				query.state.data?.status === Status.Queued
			) {
				return 5000;
			}
			return false;
		},
		placeholderData: keepPreviousData,
	});
	return query;
}
