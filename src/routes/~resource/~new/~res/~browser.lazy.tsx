import { createLazyFileRoute } from "@tanstack/react-router";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const Route = createLazyFileRoute("/resource/new/res/browser")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useFormContext();
  // console.log(form.getValues());
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.setValue("type", "browser");
  }, []);
  return (
    <div>
      <h1>浏览器配置</h1>
      <div className="flex flex-col h-full w-full px-2">
        {/* <ZForm
          form={form}
          handleSubmit={(values) => {
            createBrowserMutation.mutate({
              path: {
                tenant: tid,
              },
              body: {
                ...values,
              },
            });
          }}
          className="space-y-2"
        > */}
        {/* <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="type" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>content</FormLabel>
              <FormControl>
                <Input {...field} placeholder="content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <EditFormToolbar form={form} />
        </ZForm> */}
      </div>
    </div>
  );
}
