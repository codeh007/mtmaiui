import type { OpenAPIHono } from "@hono/zod-openapi";
import { type Agent, getAgentByName } from "agents";
import type { RootAg } from "../../agents/root_ag";
import {
  homeContent,
  layout,
  parseApproveFormBody,
  renderAuthorizationApprovedContent,
  renderAuthorizationRejectedContent,
  renderLoggedInAuthorizeScreen,
  renderLoggedOutAuthorizeScreen,
} from "../auth/utils";
import type { Bindings } from "./lib/types";

export default function configureAgentDemo(app: OpenAPIHono<{ Bindings: Bindings }>) {
  app.post("/agent_info", async (c) => {
    const { agentId, prompt } = await c.req.json<{
      agentId: string;
      prompt: string;
    }>();
    try {
      console.log("agent_info", agentId, c.env.RootAg);

      const namedAgent = await getAgentByName<Env, RootAg>(c.env.RootAg, agentId);

      // const id = c.env.RootAg.idFromName(agentId);
      // const agent = c.env.RootAg.get(id);
      if (!namedAgent) {
        return c.json({ error: "Agent not found" }, 404);
      }
      return c.json({
        agentName: namedAgent.name,
        agentId: namedAgent.id,
        state: namedAgent.state,
      });
    } catch (e: any) {
      console.error(e);
      return c.json({ error: e.message }, 500);
    }
  });

  // 演示
  app.post("/agent_fetch/:agentId", async (c) => {
    try {
      const namedAgent = await getAgentByName<Env, RootAg>(c.env.RootAg, c.req.param("agentId"));
      if (!namedAgent) {
        return c.json({ error: "Agent not found" }, 404);
      }
      return await namedAgent.fetch(c.req.raw);
    } catch (e: any) {
      return c.json(
        {
          error: e.message,
          stack: e.stack,
          name: e.name,
          cause: e.cause,
        },
        500,
      );
    }
  });

  app.all("/agents/step_cb", async (c) => {
    // 远程 agent 运行的步骤回调
    const { session_id, data } = await c.req.json<{
      session_id: string;
      data: any;
    }>();
    const id = c.env.Chat.idFromName(session_id);
    const agent = c.env.Chat.get(id);
    await agent.onStep(data);
    return c.json({ success: true });
  });
  app.get("/agents/:agent/:session_id/state", async (c) => {
    const agentName = c.req.param("agent");
    const session_id = c.req.param("session_id");

    let agentInstance: DurableObjectNamespace<Agent<Env, unknown>> | null = null;
    if (agentName === "Chat") {
      agentInstance = c.env.Chat as unknown as DurableObjectNamespace<Agent<Env, unknown>>;
    } else if (agentName === "RootAg") {
      agentInstance = c.env.RootAg as unknown as DurableObjectNamespace<Agent<Env, unknown>>;
    }
    if (!agentInstance) {
      return c.json({ error: "Agent not found" }, 404);
    }
    const id = agentInstance.idFromName(session_id);
    const agent = agentInstance.get(id);
    const state = await agent.state;
    return c.json({ state });
  });

  app.post("/confirmations/:confirmationId", async (c) => {
    const { agentId, confirm } = await c.req.json<{
      agentId: string;
      confirm: boolean;
    }>();
    const confirmationId = c.req.param("confirmationId");
    const id = c.env.RootAg.idFromName(agentId);
    const agent = c.env.RootAg.get(id);

    // const result = await agent.confirm(confirmationId, confirm);
    return c.json({ hello: "world" });
  });

  // agent 调用(演示结束) =============================================================

  // Render a basic homepage placeholder to make sure the app is up
  app.get("/", async (c) => {
    const content = await homeContent(c.req.raw);
    return c.html(layout(content, "MCP Remote Auth Demo - Home"));
  });

  // Render an authorization page
  // If the user is logged in, we'll show a form to approve the appropriate scopes
  // If the user is not logged in, we'll show a form to both login and approve the scopes
  app.get("/authorize", async (c) => {
    // We don't have an actual auth system, so to demonstrate both paths, you can
    // hard-code whether the user is logged in or not. We'll default to true
    // const isLoggedIn = false;
    const isLoggedIn = true;

    const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);

    const oauthScopes = [
      {
        name: "read_profile",
        description: "Read your basic profile information",
      },
      { name: "read_data", description: "Access your stored data" },
      { name: "write_data", description: "Create and modify your data" },
    ];

    if (isLoggedIn) {
      const content = await renderLoggedInAuthorizeScreen(oauthScopes, oauthReqInfo);
      return c.html(layout(content, "MCP Remote Auth Demo - Authorization"));
    }

    const content = await renderLoggedOutAuthorizeScreen(oauthScopes, oauthReqInfo);
    return c.html(layout(content, "MCP Remote Auth Demo - Authorization"));
  });

  // The /authorize page has a form that will POST to /approve
  // This endpoint is responsible for validating any login information and
  // then completing the authorization request with the OAUTH_PROVIDER
  app.post("/approve", async (c) => {
    const { action, oauthReqInfo, email, password } = await parseApproveFormBody(
      await c.req.parseBody(),
    );

    if (!oauthReqInfo) {
      return c.html("INVALID LOGIN", 401);
    }

    // If the user needs to both login and approve, we should validate the login first
    if (action === "login_approve") {
      // We'll allow any values for email and password for this demo
      // but you could validate them here
      // Ex:
      // if (email !== "user@example.com" || password !== "password") {
      // biome-ignore lint/correctness/noConstantCondition: This is a demo
      if (false) {
        return c.html(
          layout(
            await renderAuthorizationRejectedContent("/"),
            "MCP Remote Auth Demo - Authorization Status",
          ),
        );
      }
    }

    // The user must be successfully logged in and have approved the scopes, so we
    // can complete the authorization request
    const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
      request: oauthReqInfo,
      userId: email,
      metadata: {
        label: "Test User",
      },
      scope: oauthReqInfo.scope,
      props: {
        userEmail: email,
      },
    });

    return c.html(
      layout(
        await renderAuthorizationApprovedContent(redirectTo),
        "MCP Remote Auth Demo - Authorization Status",
      ),
    );
  });
}
