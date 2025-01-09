"use client";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const ArtifactCode = (props: any) => {
	return (
		<div className="prose dark:prose-invert">
			<pre>
				<code>{props.content}</code>
			</pre>
		</div>
	);
};
