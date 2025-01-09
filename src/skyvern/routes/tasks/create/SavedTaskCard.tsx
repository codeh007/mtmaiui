import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "mtxuilib/lib/utils";
import { useState } from "react";

import { client } from "mtmaiapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { toast } from "mtxuilib/ui/use-toast";
import { useBasePath } from "../../../../hooks/useBasePath";

type Props = {
  workflowId: string;
  title: string;
  description: string;
  url: string;
};

export function SavedTaskCard({ workflowId, title, url, description }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [hovering, setHovering] = useState(false);
  const basePath = useBasePath();
  const router = useMtRouter();

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return client
        .delete(`/workflows/${id}`)
        .then((response) => response.data);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "There was an error while deleting the template",
        description: error.message,
      });
      setOpen(false);
    },
    onSuccess: () => {
      toast({
        title: "Template deleted",
        description: "Template deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["savedTasks"],
      });
      setOpen(false);
      router.push(`${basePath}/create`);
    },
  });

  return (
    <Card
      className="border-0"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
    >
      <CardHeader
        className={cn("rounded-t-md bg-slate-elevation1", {
          "bg-slate-2": hovering,
        })}
      >
        <CardTitle className="flex items-center justify-between font-normal">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </span>
          <Dialog
            open={open}
            onOpenChange={() => {
              setOpen(false);
            }}
          >
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <DotsHorizontalIcon className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Template Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    setOpen(true);
                  }}
                >
                  删除模板
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确定要删除模板吗？</DialogTitle>
                <DialogDescription>确定要删除这个模板吗？</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteTaskMutation.mutate(workflowId);
                  }}
                  disabled={deleteTaskMutation.isPending}
                >
                  {deleteTaskMutation.isPending && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription className="overflow-hidden text-ellipsis whitespace-nowrap text-slate-400">
          {url}
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          "h-36 cursor-pointer overflow-scroll rounded-b-md bg-slate-elevation3 p-4 text-sm text-slate-300",
          {
            "bg-slate-300": hovering,
          },
        )}
        onClick={() => {
          router.push(`${basePath}/create/${workflowId}`);
        }}
      >
        {description}
      </CardContent>
    </Card>
  );
}
