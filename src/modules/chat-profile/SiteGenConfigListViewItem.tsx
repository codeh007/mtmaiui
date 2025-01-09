"use client";

import type { SiteAutoItemPublic } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

interface SiteGenConfigListViewItemProps {
  item: SiteAutoItemPublic;
}
export const SiteGenConfigListViewItem = (
  props: SiteGenConfigListViewItemProps,
) => {
  const { item } = props;
  return (
    <div>
      <DebugValue data={item} />
    </div>
  );
};
