"use client";

// import type { zUpsertModel } from "mtmaiapi/gomtmapi/zod.gen";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Switch } from "mtxuilib/ui/switch";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";

export const ModelClientForm = () => {
  const form = useFormContext<z.infer<typeof zUpsertModel>>();
  return (
    <div className="p-2 space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>name</FormLabel>
            <FormControl>
              <Input placeholder="name" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>description</FormLabel>
            <FormControl>
              <Input placeholder="description" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>model</FormLabel>
            <FormControl>
              <Input placeholder="model" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="apiKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>apiKey</FormLabel>
            <FormControl>
              <Input placeholder="apiKey" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="apiBase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>apiBase</FormLabel>
            <FormControl>
              <Input placeholder="apiBase" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="family"
        render={({ field }) => (
          <FormItem>
            <FormLabel>family</FormLabel>
            <FormControl>
              <Input placeholder="family" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name={"jsonOutput"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>jsonOutput</FormLabel>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={(checked) => {
                  form.setValue("jsonOutput", checked);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={"vision"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>vision</FormLabel>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={(checked) => {
                  form.setValue("vision", checked);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={"functionCalling"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>functionCalling</FormLabel>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={(checked) => {
                  form.setValue("functionCalling", checked);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={"tags"}
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
