"use client";

import { AgentEventType } from "mtmaiapi";
import { zSocialTeam } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { ParticipantsInput } from "./ParticipantsInput";

export function SocialTeamEditor() {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const team = useWorkbenchStore((x) => x.team);
  const form = useZodFormV2({
    schema: zSocialTeam,
    toastValidateError: true,
    defaultValues: team,
    handleSubmit: (values) => {
      handleHumanInput({
        // component: values as TeamComponent,
        // session_id: "123",
        // task: "告诉我,您能帮我做什么事情?",
        // init_state: {},
        type: AgentEventType.CHAT_MESSAGE_INPUT,
        content: "告诉我,您能帮我做什么事情?",
      });
    },
  });

  return (
    <>
      <ZForm {...form}>
        <h1>团队编辑</h1>
        <FormField
          control={form.form.control}
          name="config.username"
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
          control={form.form.control}
          name="config.password"
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
          control={form.form.control}
          name="config.otp_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>otp_key</FormLabel>
              <FormControl>
                <Input {...field} placeholder="otp_key" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ParticipantsInput
          participants={team.config.participants}
          onChange={(participants) => {
            // form.setValue("config.participants", participants);
          }}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}
