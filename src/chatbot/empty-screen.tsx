import { AgentListSelect } from "./AgentList";

export function EmptyScreen() {
	return (
		<div className="mx-auto max-w-2xl px-4">
			<div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
				<h1 className="text-lg font-semibold">选择对应的智能体进行聊天</h1>
				<p className="leading-normal text-muted-foreground">
					针对不同的场景，选择对应的智能体
				</p>
				<p className="leading-normal text-muted-foreground">
					<AgentListSelect />
				</p>
			</div>
		</div>
	);
}
