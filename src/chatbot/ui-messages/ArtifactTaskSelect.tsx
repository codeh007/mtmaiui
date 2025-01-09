"use client";

import { Button } from "mtxuilib/ui/button";
import { Dialog, DialogContent } from "mtxuilib/ui/dialog";
import { toast } from "mtxuilib/ui/use-toast";
import { type ComponentType, type PropsWithChildren, useState } from "react";

export const ArtifactTaskSelect = (props: any) => {
  return (
    <div>
      <TaskFormOpener title="文章改写" Form={SimpleTaskForm} />
    </div>
  );
};

interface SimpleTaskFormOpenerProps extends PropsWithChildren {
  title: string;
  Form: ComponentType<TaskFormProps>;
}
export const TaskFormOpener = (props: SimpleTaskFormOpenerProps) => {
  const { title, children, Form } = props;
  const [open, setOpen] = useState(false);

  const handlerSubmit = (taskConfig) => {
    toast({
      title: "操作成功",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(taskConfig, null, 2)}
          </code>
        </pre>
      ),
    });
  };
  return (
    <div>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
      >
        {title}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form
            onSubmit={handlerSubmit}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
