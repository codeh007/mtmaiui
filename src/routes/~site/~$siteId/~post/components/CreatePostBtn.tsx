"use client";

import { Icons } from "mtxuilib/icons/icons";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";

export const CreatePostBtn = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline">
        <Icons.plus className="size-4" />
        Create Post
      </Button>
    </>
  );
};
