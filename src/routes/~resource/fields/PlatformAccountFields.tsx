"use client";

import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";

export const PlatformAccountFields = () => {
  const form = useFormContext();
  return (
    <div className="flex flex-col h-full w-full px-2 space-y-2">
      <FormField
        control={form.control}
        name="content.username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="username" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content.password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input {...field} placeholder="password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="email" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content.platform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>platform</FormLabel>
            <FormControl>
              <Input {...field} placeholder="platform" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content.tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>tags</FormLabel>
            <FormControl>
              <TagsInput {...field} placeholder="tags" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
