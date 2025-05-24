import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/mttask/")({
  component: RouteComponent,
});

async function RouteComponent() {
  const handleClick = async () => {
    console.log("测试1");

    const res = await fetch("/api/mq/taskmq_submit", {
      method: "POST",
      body: JSON.stringify({ task_type: "test" }),
    });
    console.log(res);
  };
  return (
    <div>
      <Button onClick={handleClick}>测试1</Button>
    </div>
  );
}
