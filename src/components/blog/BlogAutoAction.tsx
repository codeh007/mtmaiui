"use client";

import { Icons } from "mtxuilib/icons/icons";
import { useTenant } from "../../hooks/useAuth";
import { Button } from "mtxuilib/ui/button";

interface BlogAutoActionProps {
  blogId: string;
}
export const BlogAutoAction = ({ blogId }: BlogAutoActionProps) => {
  // const { resourceId, resourceType, run } = useResource();
  const tenant = useTenant();
  const handleClick = async () => {
    // const resposne = await blogAuto({
    //   path: {
    //     tenant: tenant.metadata.id,
    //     blog: blogId,
    //   },
    // });
  };
  return (
    <>
      <Button onClick={handleClick}>
        <Icons.play className="size-4" />
      </Button>
    </>
  );
};
