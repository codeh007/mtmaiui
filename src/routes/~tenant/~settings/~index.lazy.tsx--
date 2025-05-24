import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";

export const Route = createLazyFileRoute("/tenant/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const mutateWorkflowRun = useMutation({
  //   ...workflowRunCreateMutation({}),
  // });
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>租户设置</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <div className="flex flex-col h-full w-full px-2">
        <CustomLink to={"model_client_settings"}>模型客户端设置</CustomLink>
      </div>
    </>
  );
}
