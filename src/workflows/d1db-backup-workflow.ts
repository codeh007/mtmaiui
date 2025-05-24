/**
 * 备份 D1 数据库, 到 R2 中
 *
 */

import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";

// import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";

// We are using R2 to store the D1 backup
type Env = {
  BACKUP_WORKFLOW: Workflow;
  D1_REST_API_TOKEN: string;
  BACKUP_BUCKET: R2Bucket;
};

// Workflow parameters: we expect accountId and databaseId
type Params = {
  accountId: string;
  databaseId: string;
};

// Workflow logic
export class D1DbBackupWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const { accountId, databaseId } = event.payload;

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/export`;
    const method = "POST";
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${this.env.D1_REST_API_TOKEN}`);

    const bookmark = await step.do(`Starting backup for ${databaseId}`, async () => {
      const payload = { output_format: "polling" };

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      const { result } = (await res.json()) as any;

      // If we don't get `at_bookmark` we throw to retry the step
      if (!result?.at_bookmark) throw new Error("Missing `at_bookmark`");

      return result.at_bookmark;
    });

    await step.do("Check backup status and store it on R2", async () => {
      const payload = { current_bookmark: bookmark };

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      const { result } = (await res.json()) as any;

      // The endpoint sends `signed_url` when the backup is ready to download.
      // If we don't get `signed_url` we throw to retry the step.
      if (!result?.signed_url) throw new Error("Missing `signed_url`");

      const dumpResponse = await fetch(result.signed_url);
      if (!dumpResponse.ok) throw new Error("Failed to fetch dump file");

      // Finally, stream the file directly to R2
      await this.env.BACKUP_BUCKET.put(result.filename, dumpResponse.body);
    });
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    return new Response("Not found", { status: 404 });
  },
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const params: Params = {
      accountId: "{accountId}",
      databaseId: "{databaseId}",
    };
    const instance = await env.BACKUP_WORKFLOW.create({ params });
    console.log(`Started workflow: ${instance.id}`);
  },
};
