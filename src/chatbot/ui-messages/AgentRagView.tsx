"use client";

import { Dialog, DialogContent } from "mtxuilib/ui/dialog";
import { useState } from "react";

export const AgentRagView = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>AgentRagView</DialogContent>
      </Dialog>
    </>
  );
};
