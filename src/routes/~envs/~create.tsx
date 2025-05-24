import { createFileRoute } from "@tanstack/react-router";
// import { postCreateMutation } from "mtmaiapi";
import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";

// import CodeMirror from "@uiw/react-codemirror";
import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { z } from "zod";
// import type { EditorDocument } from "../../components/editor/codemirror/CodeMirrorEditor.tsx--";
import { useTenant } from "../../hooks/useAuth";

export const Route = createFileRoute("/envs/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useSearch();
  const tenant = useTenant();
  // const createEnv = useMutation({
  //   ...postCreateMutation(),
  //   onSuccess: (data) => {
  //     toast.success("操作成功");
  //   },
  //   onError: (error) => {
  //     console.log("失败", error);
  //   },
  // });

  const [editorDocument, setEditorDocument] = useState<EditorDocument>({
    value: "hello",
    isBinary: false,
    filePath: "/",
  });

  const form = useZodForm({
    schema: z.any(),
  });

  // const handleDocSave: OnSaveCallback = () => {
  //   console.log(editorDocument);
  // };
  const onEditorChange = (value: string) => {
    console.log(value);
    form.setValue("value", value);
  };
  return (
    <>
      <ZForm
        form={form}
        handleSubmit={(values) => {
          // createEnv.mutate({
          //   path: {
          //     tenant: tenant!.metadata.id,
          //   },
          //   body: {
          //     ...values,
          //     siteId: siteId,
          //   },
          // });
        }}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>envName</FormLabel>
              <FormControl>
                <Input {...form.register("name")} placeholder="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="max-h-[500px] bg-blue-100  p-2">
          {/* <CodeMirrorEditor
            theme={"light"}
            // editable={!isStreaming && editorDocument !== undefined}
            // settings={editorSettings}
            doc={editorDocument}
            // autoFocusOnDocumentChange={isDesktop}
            // onScroll={onEditorScroll}
            onChange={onEditorChange}
            onSave={handleDocSave}
          /> */}

          {/* <CodeMirror
            className="h-[300px]"
            value={editorDocument.value}
            extensions={[javascript({ jsx: true })]}
            onChange={onEditorChange}
          /> */}
        </div>
      </ZForm>
      <ZFormToolbar form={form} />
    </>
  );
}
