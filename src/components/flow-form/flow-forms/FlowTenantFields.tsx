"use client";

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

export const FlowTenantFields = (props: PropsWithChildren) => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="somevalue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>somevalue</FormLabel>
            <FormControl>
              <Input placeholder="somevalue" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
