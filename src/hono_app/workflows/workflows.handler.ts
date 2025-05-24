import { Hono } from "hono";

export const workflowsRoute = new Hono<{ Bindings: Env }>();
/**
 * POST endpoint to trigger a new workflow instance.
 * Expects a JSON payload with a `prompt` property.
 */
workflowsRoute.post("/", async (c) => {
  const { prompt } = (await c.req.json()) as { prompt: string };
  const instance = await c.env.PROMPT_CHAINING_WORKFLOW.create({
    params: { prompt },
  });
  const status = await instance.status();
  return c.json({ id: instance.id, details: status });
});

/**
 * GET endpoint to fetch the status of an existing workflow instance by ID.
 */
workflowsRoute.get("/:id", async (c) => {
  const instanceId = c.req.param("id");
  if (instanceId) {
    const instance = await c.env.PROMPT_CHAINING_WORKFLOW.get(instanceId);
    const status = await instance.status();
    return c.json({ status });
  }
  return c.json({ error: "Instance ID not provided" }, 400);
});
