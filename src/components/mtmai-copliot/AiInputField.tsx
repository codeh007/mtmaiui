"use client";

import { omit } from "lodash";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Textarea } from "mtxuilib/ui/textarea";

import { useFormContext } from "react-hook-form";

export const AiFormInput = ({ element }: { element: InputWidgetBase }) => {
  const form = useFormContext();
  switch (element?.type) {
    case "select":
      // We omit the 'setField' prop to avoid React warnings and ensure it's available for <Tags/>.
      return <SelectInput value={element.value ?? ""} />;
    case "slider":
      return <SliderInput {...element} value={element.value ?? 0} />;
    // case "tags":
    // 	return <TagsInput {...element} value={element.value ?? []} />;
    case "switch":
      return (
        <SwitchInput
          {...omit(element, "setField")}
          checked={!!element.value}
          inputProps={{
            id: element.id,
            name: element.id,
          }}
        />
      );
    case "textinput":
      return (
        <TextInput {...omit(element, "setField")} value={element.value ?? ""} />
      );
    case "number":
      return (
        <TextInput
          {...omit(element, "setField")}
          type="number"
          value={element.value?.toString() ?? "0"}
        />
      );

    case "textarea":
      return (
        <FormField
          control={form.control}
          name={element.name || ""}
          render={({ field }) => (
            <FormItem>
              {element.label && <FormLabel>{element.label}</FormLabel>}
              <FormControl>
                {/* <Input
									placeholder={element.placeholder || ""}
									{...field}
									defaultValue={element.value}
								/> */}
                <Textarea
                  placeholder={element.placeholder || ""}
                  {...field}
                  defaultValue={element.value || ""}
                />
              </FormControl>
              {element.description && (
                <FormDescription>{element.description}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    default:
      return (
        <FormField
          control={form.control}
          name={element.name || ""}
          render={({ field }) => (
            <FormItem>
              {element.label && <FormLabel>{element.label}</FormLabel>}
              <FormControl>
                <Input
                  placeholder={element.placeholder || ""}
                  {...field}
                  defaultValue={element.value || ""}
                />
              </FormControl>
              {element.description && (
                <FormDescription>{element.description}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );
  }
};
