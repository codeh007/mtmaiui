"use client";

import { useMutation } from "@tanstack/react-query";
import { siteHostCreateMutation } from "mtmaiapi";
import { zCreateSiteHostRequest } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "mtxuilib/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";

interface SiteHostCreateDialogProps {
  siteId: string;
  tid: string;
}

export function SiteHostCreateDialog({ siteId, tid }: SiteHostCreateDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <SiteHostNewView siteId={siteId} tid={tid} />
      </DialogContent>
    </Dialog>
  );
}

interface SiteHostNewViewProps {
  siteId: string;
  tid: string;
}
export function SiteHostNewView({ siteId, tid }: SiteHostNewViewProps) {
  const siteHostCreate = useMutation({
    ...siteHostCreateMutation(),
  });

  const handleSubmit = (values) => {
    siteHostCreate.mutate({
      path: {
        tenant: tid,
        site: siteId,
      },
      body: {
        ...values,
      },
    });
  };

  const zform = useZodFormV2({
    schema: zCreateSiteHostRequest,
    handleSubmit,
    defaultValues: {
      host: "",
      title: "",
      // siteId: siteId,
    },
    toastValidateError: true,
  });
  return (
    <ZForm {...zform} handleSubmit={handleSubmit}>
      <FormField
        control={zform.form.control}
        name="host"
        render={({ field }) => (
          <FormItem>
            <FormLabel>域名</FormLabel>
            <FormControl>
              <Input placeholder="域名" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={zform.form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>标题</FormLabel>
            <FormControl>
              <Input placeholder="标题" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <ZFormToolbar form={zform.form} />
    </ZForm>
  );
}
