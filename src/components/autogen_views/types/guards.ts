import type { MtComponent } from "mtmaiapi";
import type {
  AnthropicClientConfig,
  AssistantAgentConfig,
  AzureOpenAIClientConfig,
  Component,
  ComponentConfig,
  FunctionToolConfig,
  MaxMessageTerminationConfig,
  MultimodalWebSurferConfig,
  OpenAIClientConfig,
  OrTerminationConfig,
  RoundRobinGroupChatConfig,
  SelectorGroupChatConfig,
  TextMentionTerminationConfig,
  UnboundedChatCompletionContextConfig,
  UserProxyAgentConfig,
} from "./datamodel";

// Provider constants
const PROVIDERS = {
  // Teams
  ROUND_ROBIN_TEAM: "autogen_agentchat.teams.RoundRobinGroupChat",
  SELECTOR_TEAM: "autogen_agentchat.teams.SelectorGroupChat",
  INSTAGRAM_TEAM: "mtmai.teams.instagram_team.instagram_team.InstagramTeam",

  // Agents
  ASSISTANT_AGENT: "autogen_agentchat.agents.AssistantAgent",
  MT_ASSISTANT_AGENT: "mtmai.agents.assistant_agent.AssistantAgent",
  USER_PROXY: "autogen_agentchat.agents.UserProxyAgent",
  WEB_SURFER: "autogen_ext.agents.web_surfer.MultimodalWebSurfer",
  MT_WEB_SURFER: "mtmai.agents.web_surfer.MtMultimodalWebSurfer",
  // Models
  OPENAI: "autogen_ext.models.openai.OpenAIChatCompletionClient",
  MTM_OPENAI: "mtmai.model_client.MtOpenAIChatCompletionClient",
  AZURE_OPENAI: "autogen_ext.models.openai.AzureOpenAIChatCompletionClient",
  ANTHROPIC: "autogen_ext.models.anthropic.AnthropicChatCompletionClient",

  // Tools
  FUNCTION_TOOL: "autogen_core.tools.FunctionTool",

  // Termination
  OR_TERMINATION: "autogen_agentchat.base.OrTerminationCondition",
  MAX_MESSAGE: "autogen_agentchat.conditions.MaxMessageTermination",
  TEXT_MENTION: "autogen_agentchat.conditions.TextMentionTermination",

  // Contexts
  UNBOUNDED_CONTEXT:
    "autogen_core.model_context.UnboundedChatCompletionContext",
} as const;

// Provider type and mapping
export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];

type ProviderToConfig = {
  // Teams
  [PROVIDERS.SELECTOR_TEAM]: SelectorGroupChatConfig;
  [PROVIDERS.ROUND_ROBIN_TEAM]: RoundRobinGroupChatConfig;
  [PROVIDERS.ANTHROPIC]: AnthropicClientConfig;

  // Agents
  [PROVIDERS.ASSISTANT_AGENT]: AssistantAgentConfig;
  [PROVIDERS.USER_PROXY]: UserProxyAgentConfig;
  [PROVIDERS.WEB_SURFER]: MultimodalWebSurferConfig;

  // Models
  [PROVIDERS.OPENAI]: OpenAIClientConfig;
  [PROVIDERS.AZURE_OPENAI]: AzureOpenAIClientConfig;

  // Tools
  [PROVIDERS.FUNCTION_TOOL]: FunctionToolConfig;

  // Termination
  [PROVIDERS.OR_TERMINATION]: OrTerminationConfig;
  [PROVIDERS.MAX_MESSAGE]: MaxMessageTerminationConfig;
  [PROVIDERS.TEXT_MENTION]: TextMentionTerminationConfig;

  // Contexts
  [PROVIDERS.UNBOUNDED_CONTEXT]: UnboundedChatCompletionContextConfig;
};

// Helper type to get config type from provider
type ConfigForProvider<P extends Provider> = P extends keyof ProviderToConfig
  ? ProviderToConfig[P]
  : never;

export function isComponent(value: any): value is Component<ComponentConfig> {
  return (
    value &&
    typeof value === "object" &&
    "provider" in value &&
    "component_type" in value &&
    "config" in value
  );
}
// Generic component type guard
function isComponentOfType<P extends Provider>(
  component: MtComponent,
  provider: P,
): component is MtComponent {
  return component.provider === provider;
}

// Base component type guards
export function isTeamComponent(component: MtComponent) {
  return component.component_type === "team";
}

export function isAgentComponent(component: MtComponent) {
  return component.component_type === "agent";
}

export function isModelComponent(
  component: MtComponent,
): component is MtComponent {
  return component.component_type === "model";
}

export function isToolComponent(
  component: MtComponent,
): component is MtComponent {
  return component.component_type === "tool";
}

export function isTerminationComponent(
  component: MtComponent,
): component is MtComponent {
  return component.component_type === "termination";
}

// export function isChatCompletionContextComponent(
//   component: Component<ComponentConfig>
// ): component is Component<ChatCompletionContextConfig> {
//   return component.component_type === "chat_completion_context";
// }

// Team provider guards with proper type narrowing
export function isRoundRobinTeam(
  component: MtComponent,
): component is MtComponent {
  return isComponentOfType(component, PROVIDERS.ROUND_ROBIN_TEAM);
}

export function isSelectorTeam(
  component: MtComponent,
): component is MtComponent {
  return (
    isComponentOfType(component, PROVIDERS.SELECTOR_TEAM) ||
    isComponentOfType(component, PROVIDERS.INSTAGRAM_TEAM)
  );
}

export function isInstagramTeam(
  component: MtComponent,
): component is MtComponent {
  return isComponentOfType(component, PROVIDERS.INSTAGRAM_TEAM);
}

// Agent provider guards with proper type narrowing
export function isAssistantAgent(component: MtComponent) {
  const ok =
    isComponentOfType(component, PROVIDERS.ASSISTANT_AGENT) ||
    isComponentOfType(component, PROVIDERS.MT_ASSISTANT_AGENT);
  return ok;
}

export function isUserProxyAgent(component: MtComponent) {
  return isComponentOfType(component, PROVIDERS.USER_PROXY);
}

export function isWebSurferAgent(component: MtComponent) {
  return (
    isComponentOfType(component, PROVIDERS.WEB_SURFER) ||
    isComponentOfType(component, PROVIDERS.MT_WEB_SURFER)
  );
}

// Model provider guards with proper type narrowing
export function isOpenAIModel(component: MtComponent) {
  return (
    isComponentOfType(component, PROVIDERS.OPENAI) ||
    isComponentOfType(component, PROVIDERS.MTM_OPENAI)
  );
}

export function isAzureOpenAIModel(component: MtComponent) {
  return isComponentOfType(component, PROVIDERS.AZURE_OPENAI);
}
export function isAnthropicModel(component: MtComponent) {
  return isComponentOfType(component, PROVIDERS.ANTHROPIC);
}
// export function is(component: MtComponent) {
//   return !isOpenAIModel(component) && !isAzureOpenAIModel(component) && !isAnthropicModel(component);
// }

// Tool provider guards with proper type narrowing
export function isFunctionTool(
  component: MtComponent,
): component is MtComponent {
  return isComponentOfType(component, PROVIDERS.FUNCTION_TOOL);
}

// Termination provider guards with proper type narrowing
export function isOrTermination(
  component: MtComponent,
): component is MtComponent {
  return isComponentOfType(component, PROVIDERS.OR_TERMINATION);
}

export function isMaxMessageTermination(
  component: MtComponent,
): component is MtComponent {
  return isComponentOfType(component, PROVIDERS.MAX_MESSAGE);
}

export function isTextMentionTermination(
  component: MtComponent,
): component is MtComponent {
  return isComponentOfType(component, PROVIDERS.TEXT_MENTION);
}

// Context provider guards with proper type narrowing
export function isUnboundedContext(
  component: MtComponent,
): component is MtComponent {
  return isComponentOfType(component, PROVIDERS.UNBOUNDED_CONTEXT);
}

// Runtime assertions
export function assertComponentType<P extends Provider>(
  component: MtComponent,
  provider: P,
): asserts component is MtComponent {
  if (!isComponentOfType(component, provider)) {
    throw new Error(
      `Expected component with provider ${provider}, got ${component as MtComponent}.provider}`,
    );
  }
}

export { PROVIDERS };
