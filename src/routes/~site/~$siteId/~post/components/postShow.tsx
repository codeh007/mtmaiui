"use client";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { DiffView } from "../../../../../aichatbot/diffview";
import { useTenant } from "../../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../../stores/workbrench.store";
import { Editor } from "../../../aichatbot/editor";

const doc1 = `
# title1

## nnnnn
 am trying to do a simple thing, check if there is a table, if not then create that table in database. Here this is the logic I used.
1 answer



Top answer:
I have solved the problem using ffss and MySQL. _, table_check := db.Query("select * from " + table + ";") if table_check == nil { fmt.Println("table ...
How to check if a table exists in a given schema - Stack Overflow
Dec 14, 2013
PostgreSQL how to check table existence? - Stack Overflow
Jun 26, 2019
PostgreSQL check if table exist throwing "relation does not ...
Jul 18, 2016
`;
const doc2 = `
# title1
## nnnnn
 am trying to do a simple thing, check if there is a table, if not then create that table in database. Here this is the logic I used.
1 answer

·

Top answer:
I have solved the problem using golang and MySQL. _, table_check := db.Query("select * from " + table + ";") if table_check == nil { fmt.Println("table ...
How to check if a table exists in a given schema - Stack Overflow
Dec 14, 2013
PostgreSQL how to check table existence? - Stack Overflow
Jun 26, 2019
PostgreSQL check if table exist throwing "relation does not ...
Jul 18, 2016
PostgreSQL: Select from table only if table exists
Dec 24, 2020
More results from stackoverflow.com
`;

interface Props {
  postId: string;
}
export const PostShow = ({ postId }: Props) => {
  return (
    <AssistantLoader
      // profile="postEdit"
      params={{
        postId: postId,
      }}
    >
      <MtSuspenseBoundary>
        <MtSuspenseBoundary>
          <PostEditView postId={postId} />
        </MtSuspenseBoundary>
      </MtSuspenseBoundary>
    </AssistantLoader>
  );
};

interface PostDetailWithAiProps {
  postId: string;
  onChange: (value: string) => void;
}
const PostEditView = ({ postId }: PostDetailWithAiProps) => {
  // const mtmapi = useMtmClient();
  const tenant = useTenant();

  const [mode, setMode] = useState<"edit" | "diff">("edit");
  const postQuery = mtmapi.useSuspenseQuery("get", "/api/v1/tenants/{tenant}/posts/{post}", {
    params: {
      path: {
        tenant: tenant.metadata.id,
        post: postId,
      },
    },
  });
  const post = postQuery.data;

  const updateMutation = mtmapi.useMutation("patch", "/api/v1/tenants/{tenant}/posts/{post}", {});

  const handleAgentSubmit = useWorkbenchStore((x) => x.handleSubmit);
  const handleSubmit = (values) => {
    updateMutation.mutate({
      params: {
        path: {
          tenant: tenant.metadata.id,
          post: postId,
        },
      },
      body: {
        ...values,
      },
    });
  };
  const createArtifact = mtmapi.useMutation("post", "/api/v1/tenants/{tenant}/artifacts");
  const handleEdit = (values) => {
    createArtifact.mutate({
      params: {
        path: {
          tenant: tenant.metadata.id,
        },
      },
      body: {
        state: {
          title: "标题1",
          content: "内容1",
        },
      },
    });
  };

  const form = useZodForm({
    defaultValues: post,
  });

  const handleSaveContent = (content: string) => {
    form.setValue("content", content);
  };
  return (
    <>
      <div className="flex gap-2 p-2 justify-end">
        <Button
          onClick={() => {
            handleAgentSubmit();
          }}
        >
          agent
        </Button>

        <Button type="submit" form={form.id}>
          保存
        </Button>
      </div>
      <ZForm form={form} handleSubmit={handleSubmit}>
        <div className="prose dark:prose-invert">
          <FormField
            control={form.control}
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
        </div>
        <MtMDEditor mode={mode} content={post.content} saveContent={handleSaveContent} />
      </ZForm>
    </>
  );
};

interface MtMDEditorProps {
  mode: "edit" | "diff";
  content: string;
  saveContent: (updatedContent: string, debounce: boolean) => void;
}
export const MtMDEditor = (props: MtMDEditorProps) => {
  const [content, setContent] = useState<string>(props.content);
  const [mode, setMode] = useState(props.mode);
  return (
    <div className="prose dark:prose-invert dark:bg-muted bg-background h-full overflow-y-scroll px-4 py-8 md:p-20 !max-w-full pb-40 items-center">
      <div className="flex flex-row max-w-[600px] mx-auto">
        {mode === "diff" && <DiffView oldContent={doc1} newContent={doc2} />}

        {mode === "edit" && (
          <Editor
            content={content}
            isCurrentVersion={true}
            currentVersionIndex={1}
            status={"idle"}
            saveContent={props.saveContent}
            suggestions={[]}
          />
        )}
      </div>
    </div>
  );
};
