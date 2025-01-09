"use client";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const ArtifactSearchResults = (props: any) => {
	return (
		<div>
			<pre>{JSON.stringify(props, null, 2)}</pre>
		</div>
	);
};
