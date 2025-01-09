"use client";

import { isEmpty } from "lodash";
import { SiteGenConfigListViewHeader } from "./SiteGenConfigListViewHeader";
import { useMtRouter } from "mtxuilib/hooks/use-router";

export const ScheduleListview = () => {
  const router = useMtRouter();

  // const listQuery = useSuspenseQuery({
  //   ...tasksScheduleListOptions({
  //     body: {
  //       // site_id: siteId,
  //     },
  //   }),
  // });
  // const isEmpty = useMemo(() => {
  //   return listQuery.data?.items?.length === 0;
  // }, [listQuery.data?.items]);

  return (
    <>
      <div className="flex flex-col h-full w-full ">
        {isEmpty ? (
          <ListViewEmpty
            message="没有数据"
            // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            linkToCreate={`/dash/schedule/new`}
          />
        ) : (
          <>
            <SiteGenConfigListViewHeader />
            {listQuery.data?.items?.map((item) => (
              // <SiteGenConfigListViewItem
              // 	key={item.id}
              // 	item={item}
              // 	// onItemClick={() => router.push(`/dash/site/${item.site_id}`)}
              // />
              <ListviewItem
                key={item.id}
                item={{
                  id: item.id,
                  // dataType: item.dataType,
                  defaultLink: `/dash/schedule/${item.id}`,
                  title: item.title || item.description || item.id,
                  // sub_title: item.sub_title,
                  // icon: item.icon,
                  // description: item.description,
                  // date_since: item.updated_at,
                }}
                onItemClick={() => router.push(`/dash/chat-profile/${item.id}`)}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};
