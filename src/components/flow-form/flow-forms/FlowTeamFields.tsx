"use client";

import type { TeamRun } from "mtmaiapi";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import type { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";

export const FlowTeamFields = (props: PropsWithChildren) => {
  const form = useFormContext<TeamRun>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>team_name</FormLabel>
            <FormControl>
              <Input placeholder="team_name" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="task"
        render={({ field }) => (
          <FormItem>
            <FormLabel>task</FormLabel>
            <FormControl>
              <Input placeholder="task" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
