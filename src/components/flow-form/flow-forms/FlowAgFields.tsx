"use client";

// import type { zAgEvent } from "mtmaiapi/gomtmapi/zod.gen";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import type { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { AgentEventTypeSelect } from "../AgentEventTypeSelect";

export const FlowAgFields = (props: PropsWithChildren) => {
  const form = useFormContext<z.infer<typeof zAgEvent>>();

  return (
    <>
      <FormField
        control={form.control}
        name="event_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>event_type</FormLabel>
            <FormControl>
              {/* <Input placeholder="message_type" {...field} /> */}
              <AgentEventTypeSelect {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="teamName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>teamName</FormLabel>
            <FormControl>
              <Input placeholder="somevalue" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>content</FormLabel>
            <FormControl>
              <Input placeholder="content" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
