import { AgentEventType } from "mtmaiapi";
// import { zSocialAddFollowersInput } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useWorkbenchStore } from "../../../../../stores/workbrench.store";
export const SocialAddFollowersAction = () => {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const form = useZodFormV2({
    schema: zSocialAddFollowersInput,
    toastValidateError: true,
    handleSubmit: (values) => {
      handleHumanInput({
        content: "",
        type: AgentEventType.SOCIAL_ADD_FOLLOWERS_INPUT,
        input: {
          ...values,
          type: AgentEventType.SOCIAL_ADD_FOLLOWERS_INPUT,
          count_to_follow: values.count_to_follow || 1,
        },
      });
    },
  });
  return (
    <div>
      <h1>SocialAddFollowersAction</h1>
      <ZForm {...form} className="space-y-2">
        <FormField
          control={form.form.control}
          name="count_to_follow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>count_to_follow</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="count_to_follow"
                  type="number"
                  {...form.form.register("count_to_follow", { valueAsNumber: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </div>
  );
};
