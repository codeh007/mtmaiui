"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
// import { tasksTaskListOptions } from "mtmaiapi/@tanstack/react-query.gen";
import { useMemo } from "react";
// import { ListViewEmpty } from "../../components/listview/ListViewEmpty.tsx--";
import { TaskListViewHeader } from "./TaskListViewHeader";
import { useMtRouter } from "mtxuilib/hooks/use-router";
// import { TaskListViewItem } from "./TaskListViewItem";

interface TaskListViewProps {
  siteId: string;
}
export const TaskListView = (props: TaskListViewProps) => {
  const { siteId } = props;

  const router = useMtRouter();

  const listQuery = useSuspenseQuery({
    // ...tasksTaskListOptions({
    //   body: {
    //     // ...searchParams,
    //     // dataType: "task",
    //     siteId,
    //   },
    // }),
  });
  const isEmpty = useMemo(() => {
    return listQuery.data?.data.length === 0;
  }, [listQuery.data?.data]);

  return (
    <>
      <div className="flex flex-col h-full w-full ">
        {isEmpty ? (
          <ListViewEmpty
            message="没有可用数据"
            linkToCreate="/dash/site/${siteId}/tasks/new"
          />
        ) : (
          <>
            <TaskListViewHeader />
            {/* {listQuery.data?.data.map((item) => (
              <TaskListViewItem
                key={item.id}
                item={item}
                // onItemClick={() => router.push(`/dash/site/${item.site_id}`)}
              />
            ))} */}
          </>
        )}
      </div>
    </>
  );
};
