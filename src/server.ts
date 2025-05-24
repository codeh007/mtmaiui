import { Chat } from "./agents/chat";
import { DemoMcpServer } from "./agents/demoMcpServer";
import { EmailAgent } from "./agents/email";
import { MyMcpAgent } from "./agents/mcp_agent";
import { RootAg } from "./agents/root_ag";
import { Scheduler } from "./agents/scheduler";
import { ShortVideoAg } from "./agents/shortvideo/shortvideo_agent";
import { WorkerAgent } from "./agents/worker_agent";
import app from "./hono_app/app";

// 智能体
export {
  RootAg,
  Chat,
  EmailAgent,
  Scheduler,
  WorkerAgent,
  MyMcpAgent,
  DemoMcpServer,
  ShortVideoAg,
};

// 工作流
export { PromptChainingWorkflow } from "./workflows/prompt-chaining-workflow";
export { D1DbBackupWorkflow } from "./workflows/d1db-backup-workflow";

export { ShortVideoWorkflow } from "./agents/shortvideo/shortvideo-workflow";
export default {
  fetch: (request: Request, env, ctx) => {
    // setupPostgres(env.HYPERDRIVE.connectionString);
    try {
      globalThis.env = env;
      process.env.MTM_DATABASE_URL = env.HYPERDRIVE.connectionString;
      const response = app.fetch(request, env, ctx);
      return response;
    } catch (error: any) {
      console.error(error);
      return new Response(`entry server error: ${error.stack}`, { status: 500 });
    }
  },
  scheduled: async (batch, env) => {},
} satisfies ExportedHandler<Env>;
